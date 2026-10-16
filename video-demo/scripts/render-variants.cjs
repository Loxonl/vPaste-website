const fs = require('node:fs');
const path = require('node:path');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition, renderStill, renderMedia} = require('@remotion/renderer');
const revision3 = process.argv.includes('--revision3');
const {variants} = require(revision3 ? '../design/revision3.json' : '../design/variants.json');
const root = path.resolve(__dirname, '..');
const mode = process.argv[2] || 'stills';
const selected = process.argv[3] || 'all';
if (!['stills', 'final', 'preview'].includes(mode)) throw new Error('Use stills, final, or preview');
if (!['A', 'B', 'C', 'all'].includes(selected)) throw new Error('Use A, B, C, or all');
async function main() {
  const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
  const browser = await openBrowser('chrome');
  try {
    for (const variant of variants.filter(v => selected === 'all' || v.id === selected)) {
      const out = path.join(root, 'out', ...(revision3 ? ['revision3'] : []), `variant-${variant.id}`);
      fs.mkdirSync(path.join(out, 'frames'), {recursive: true});
      const composition = await selectComposition({serveUrl, id: `${revision3 ? 'Vpaste-R3' : 'Vpaste40s'}-${variant.id}`, puppeteerInstance: browser});
      if (composition.durationInFrames !== 1200) throw new Error('Expected 1200 frames');
      if (mode === 'stills') {
        for (const shot of variant.shots) {
          const frame = Math.min(1199, Math.round(shot.from + (shot.to - shot.from) * .66));
          await renderStill({serveUrl, composition, puppeteerInstance: browser, frame, output: path.join(out, 'frames', `${String(shot.from).padStart(4, '0')}-${shot.kind}.png`), imageFormat: 'png'});
          console.log(`${variant.id}: ${shot.kind} @ ${frame}`);
        }
        if (revision3) {
          const types=variant.shots.find(s=>s.kind==='types');
          for(const frame of [0,45,90,130,Math.round(types.from+8),...Array.from({length:5},(_,i)=>Math.round(types.from+(i+.6)*(types.to-types.from)/5))]) {
            await renderStill({serveUrl,composition,puppeteerInstance:browser,frame,output:path.join(out,'frames',`check-${frame}.png`),imageFormat:'png'});
          }
        }
      } else {
        let last = -1;
        await renderMedia({serveUrl, composition, puppeteerInstance: browser, outputLocation: path.join(out, `vpaste-40s-${variant.id}${mode === 'preview' ? '-preview' : ''}.mp4`), codec: 'h264', audioCodec: 'aac', pixelFormat: 'yuv420p', crf: mode === 'preview' ? 25 : 18, scale: mode === 'preview' ? .5 : 1, concurrency: 4, onProgress: ({progress}) => {const percent = Math.floor(progress * 20) * 5; if (percent !== last) {console.log(`${variant.id}: ${percent}%`); last = percent;}}});
      }
    }
  } finally {await browser.close({silent: true});}
}
main().catch(error => {console.error(error); process.exitCode = 1;});
