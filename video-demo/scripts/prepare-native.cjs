// Reuse the website renderer and interaction code, not a video-specific UI replica.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const generated = path.join(root, 'video-demo/src/generated');
const publicDir = path.join(root, 'video-demo/public/native');
fs.mkdirSync(generated, {recursive: true});
fs.mkdirSync(publicDir, {recursive: true});
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('src/page.html');
const start = html.indexOf('<div class="app-actor">');
const end = html.indexOf('<div class="story-copies">', start);
if (start < 0 || end < 0) throw new Error('Original app actor was not found');
const actorHtml = html.slice(start, end).trim().replaceAll(' loading="lazy"', '');
const localHtml = html.match(/<figure class="data-visual">[\s\S]*?<\/figure>/)?.[0];
if (!localHtml) throw new Error('Original local history diagram was not found');
const css = read('styles.css');
const motionCss = read('motion-concepts.css');
const cardCss = css.slice(css.indexOf('.vp-product-surface {'), css.indexOf('.vp-photo-preview {'));
const actorCss = motionCss.slice(motionCss.indexOf('.story-product.vp-product-surface {'), motionCss.indexOf('.settings-sheet {'));
const sourceCss = cardCss + '\n' + actorCss + '\n' + read('product-demos.css');
const copy = require(path.join(root, 'site-copy.js')).zh;
fs.writeFileSync(path.join(generated, 'native-data.ts'),
  `// Generated from the current website. Do not edit.\nexport const actorHtml = ${JSON.stringify(actorHtml)};\nexport const localHtml = ${JSON.stringify(localHtml)};\nexport const nativeCss = ${JSON.stringify(sourceCss)};\nexport const nativeCopy: Record<string, string> = ${JSON.stringify(copy)};\n`);
// Only adapt the module boundary and local asset URLs. All original GSAP timings,
// selectors, callbacks, geometry, and easing remain byte-for-byte unchanged.
const runtime = read('product-demos.js')
  .replace('window.createProductDemos =', 'export const createProductDemos =')
  .replace('window.createLocalHistoryLoop =', 'export const createLocalHistoryLoop =')
  .replace('    const gsap = window.gsap;', '')
  .replaceAll(' loading="lazy"', '')
  .replace(/src="\/assets\/([^"]+)"/g, (_, file) => `src="\${staticFile('${'native/assets/' + file}')}"`)
  .replace('    pause: paused => loop.paused(paused),', '    seek: time => loop.pause().repeat(0).totalTime(time, false),\n    pause: paused => loop.paused(paused),');
const icons = read('story-icons.js').replaceAll('window.vpasteIcon', 'vpasteIcon').replace('vpasteIcon =', 'export const vpasteIcon =');
fs.writeFileSync(path.join(generated, 'native-runtime.ts'), '// @ts-nocheck\n// Original website runtime, adapted only for imports, assets, and frame seeking.\nimport {gsap} from "../../../assets/vendor/gsap-3.15.0.min.js";\nimport {staticFile} from "remotion";\nexport {gsap};\n' + icons + '\n' + runtime);
const assets = new Set([...actorHtml.matchAll(/src="\/assets\/([^"]+)"/g), ...read('product-demos.js').matchAll(/src="\/assets\/([^"]+)"/g)].map(m => m[1]));
['vpaste-logo.png', 'vpaste-tray.svg', 'product/settings-theme-zh.png', 'product/settings-zh.png'].forEach(file => assets.add(file));
for (const file of assets) {
  const target = path.join(publicDir, 'assets', file);
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.copyFileSync(path.join(root, 'assets', file), target);
}
const sourceFiles = ['src/page.html', 'styles.css', 'motion-concepts.css', 'product-demos.js', 'product-demos.css', 'story-icons.js', 'site-copy.js'];
const hashes = Object.fromEntries(sourceFiles.map(file => [file, crypto.createHash('sha256').update(read(file)).digest('hex')]));
fs.writeFileSync(path.join(publicDir, 'source-manifest.json'), JSON.stringify({sourceFiles: hashes, clientReference: 'vPaste-clean-public 054def6', changes: ['module exports', 'local asset URLs', 'paused frame seeking', 'hide editorial helper captions', 'camera framing outside native UI']}, null, 2));
console.log(`Prepared original native actor, unchanged interaction timelines, and ${assets.size} assets.`);
