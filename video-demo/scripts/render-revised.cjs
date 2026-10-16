const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const timing = require('../src/revised-timing.json');
const {execFileSync} = require('node:child_process');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition, renderStill, renderMedia} = require('@remotion/renderer');
const root = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'stills';
const language = process.argv[3] || 'zh';
const resolution = process.argv[4] || '1080';
if (!['stills', 'final'].includes(mode)) throw new Error('Use stills or final');
if (!['zh', 'en'].includes(language) || !['1080', '1440'].includes(resolution)) throw new Error('Use zh/en and 1080/1440');
const is1440 = resolution==='1440';
if (!is1440 && language!=='zh') throw new Error('English delivery uses the 1440 composition');
const out = path.join(root, is1440 ? `out/revised-1440/${language}` : 'out/revised');
const compositionId = is1440 ? `Vpaste40s-1440-${language}` : 'Vpaste40s-Revised';
const videoName = is1440 ? `vpaste-40s-1440p-${language}.mp4` : 'vpaste-40s-refined-v3.mp4';
function checkCover(framePath, coverPath, pixelCount) {
  if (fs.readFileSync(framePath).equals(fs.readFileSync(coverPath))) return;
  const decode = file => execFileSync('ffmpeg', ['-v','error','-i',file,'-f','rawvideo','-pix_fmt','rgb24','pipe:1'], {maxBuffer:pixelCount*3+1024,windowsHide:true});
  const frame = decode(framePath), cover = decode(coverPath);
  assert.equal(frame.length, cover.length);
  let changedPixels = 0;
  for (let i=0;i<frame.length;i+=3) {
    let changed = false;
    for (let c=0;c<3;c++) {
      const delta = Math.abs(frame[i+c]-cover[i+c]);
      assert(delta<=2, `Cover color or position differs: ${framePath}`);
      changed ||= delta>0;
    }
    if (changed) changedPixels++;
  }
  // Chromium's composited cover can round a few antialiased edges by two RGB levels.
  assert(changedPixels<=pixelCount*.0001, `Cover is not static: ${framePath}`);
  console.log(`Cover raster rounding: ${changedPixels} pixels, at most 2/255 per channel.`);
}
async function main() {
  fs.mkdirSync(path.join(out, 'frames'), {recursive: true});
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/revised-index.tsx'), publicDir: path.join(root, 'public')});
  // Use the renderer's managed browser; installed Edge can reject its headless flags.
  const browser = await openBrowser('chrome');
  try {
    const inputProps = {language};
    const composition = await selectComposition({serveUrl, id:compositionId, inputProps, puppeteerInstance: browser});
    assert.equal(composition.durationInFrames, 1200);
    assert.equal(composition.fps, 30);
    assert.equal(composition.width,is1440?2560:1920);
    assert.equal(composition.height,is1440?1440:1080);
    if (mode === 'stills') {
      const originalTimes = [.3, .5, 1, 2.2, 3.8, 5.7, 7.5, 8.8, 9.15, 9.45, 9.8, 10.3, 11.4, 12.05, 12.85, 13.6, 14.3, 15, 15.55, 16, 16.1, 16.7, 17.3, 17.8, 18.8, 19.4, 19.766667, 20, 20.2, 20.65, 21.7, 23.3, 23.733333, 24.15, 25, 25.9, 27, 27.85, 28.95, 30.5, 32.8, 34.65, 36.2, 37.8];
      const times = [...new Set([0, .5, 1, 1.2, 1.4, 1.6, 1.8, 2, ...originalTimes.map(time=>time+timing.introOffset), 39.4, 39.8, 39.9666667])].sort((a,b)=>a-b);
      for (const time of times) {
        const frame = Math.min(1199, Math.round(time*30));
        await renderStill({serveUrl, composition, inputProps, puppeteerInstance: browser, frame, output: path.join(out, 'frames', `${String(frame).padStart(4,'0')}.png`)});
        console.log(`Checked ${time.toFixed(2)}s`);
      }
      // The real first frame is also the poster, and must match both held segments.
      fs.copyFileSync(path.join(out, 'frames/0000.png'), path.join(out, 'vpaste-cover.png'));
      for (const frame of [0,15,30,1182,1194,1199]) {
        checkCover(path.join(out, 'frames', `${String(frame).padStart(4,'0')}.png`), path.join(out, 'vpaste-cover.png'), composition.width*composition.height);
      }
      console.log('First-frame cover matches 0–1s and the held ending at 39.4s, 39.8s, and the last frame.');
    } else {
      let last = -1;
      await renderMedia({serveUrl, composition, inputProps, puppeteerInstance: browser, outputLocation: path.join(out, videoName), codec:'h264',audioCodec:'aac',pixelFormat:'yuv420p',crf:is1440?22:18,...(is1440?{x264Preset:'slow',audioBitrate:'160k'}:{}),concurrency:4,onProgress:({progress})=>{const percent=Math.floor(progress*20)*5;if(percent!==last){last=percent;console.log(`Render ${language} ${resolution}p ${percent}%`);}}});
      await renderStill({serveUrl, composition, inputProps, frame:0, puppeteerInstance:browser, output:path.join(out, 'vpaste-cover.png')});
    }
  } finally {await browser.close({silent:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
