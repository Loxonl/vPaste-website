const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition, renderStill, renderMedia} = require('@remotion/renderer');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'out');
const mode = process.argv[2] || 'stills';
if (!['stills', 'preview', 'final'].includes(mode)) throw new Error('Use stills, preview, or final');
async function main() {
  fs.mkdirSync(path.join(out, 'promo-frames'), {recursive: true});
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
  const browser = await openBrowser('chrome');
  try {
    const composition = await selectComposition({serveUrl, id: 'Vpaste40s', puppeteerInstance: browser});
    if (composition.durationInFrames !== 1200 || composition.fps !== 30) throw new Error('Expected exactly 40 seconds at 30 fps');
    if (mode === 'stills') {
      const times = [0, 2.3, 5.5, 8.4, 10.5, 12.5, 14.9, 17.2, 19.3, 21.5, 22.5, 25.8, 29.5, 33.1, 36.8, 39.9];
      for (const time of times) {
        await renderStill({serveUrl, composition, puppeteerInstance: browser, frame: Math.round(time * 30), output: path.join(out, 'promo-frames', `${String(Math.round(time * 30)).padStart(4, '0')}.png`), imageFormat: 'png'});
        console.log(`Checked frame at ${time}s`);
      }
    } else {
      let last = -1;
      await renderMedia({serveUrl, composition, puppeteerInstance: browser, outputLocation: path.join(out, mode === 'preview' ? 'vpaste-40s-preview.mp4' : 'vpaste-40s.mp4'), codec: 'h264', audioCodec: 'aac', pixelFormat: 'yuv420p', crf: mode === 'preview' ? 25 : 18, scale: mode === 'preview' ? .5 : 1, concurrency: 4, onProgress: ({progress}) => {const percent = Math.floor(progress * 100 / 5) * 5; if (percent !== last) {console.log(`Render ${percent}%`); last = percent;}}});
    }
  } finally {await browser.close({silent: true});}
}
main().catch(error => {console.error(error); process.exitCode = 1;});
