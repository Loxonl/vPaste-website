// Compile the unmodified desktop frontend with public, in-memory demo data.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname, '..');
const client = path.resolve(root, '../../vPaste-clean-public');
const out = path.join(root, 'public/revision3/client');
const generated = path.join(root, '.cache/desktop-stage');
fs.mkdirSync(generated, {recursive: true});
fs.mkdirSync(out, {recursive: true});
async function main() {
  const {build} = await import(pathToFileURL(path.join(client, 'node_modules/vite/dist/node/index.js')).href);
  const bootstrap = fs.readFileSync(path.join(root, 'scripts/desktop-fixture.js'), 'utf8');
  const html = `<html lang="zh-CN"><meta charset="utf-8"><div id="root"></div><script>${bootstrap}</script><script type="module" src="./entry.ts"></script></html>`;
  fs.writeFileSync(path.join(generated, 'entry.ts'), `import ${JSON.stringify(path.join(client,'src/main.tsx').replaceAll('\\','/'))};`);
  fs.writeFileSync(path.join(generated, 'desktop.html'), html);
  await build({root:generated, configFile: path.join(client, 'vite.config.ts'), publicDir:path.join(client,'public'), base:'./', logLevel:'warn', build:{outDir:out, emptyOutDir:false, rollupOptions:{input:path.join(generated,'desktop.html')}}});
  const htmlFiles = fs.readdirSync(out, {recursive:true}).filter(f=>f.endsWith('.html'));
  const built = fs.readFileSync(path.join(out, htmlFiles[0]), 'utf8').replace(/(?:\.\.\/)+assets\//g, './assets/');
  fs.writeFileSync(path.join(out, 'index.html'), built);
  const motion = fs.readFileSync(path.join(client, 'src-tauri/src/main.rs'), 'utf8');
  const height = Number(motion.match(/const CLIPBOARD_WINDOW_HEIGHT: f64 = ([\d.]+)/)[1]);
  const showMs = Number(motion.match(/const CLIPBOARD_SHOW_ANIMATION_MS: u64 = (\d+)/)[1]);
  const hideMs = Number(motion.match(/const CLIPBOARD_HIDE_ANIMATION_MS: u64 = (\d+)/)[1]);
  const bleed = Number(motion.match(/const CLIPBOARD_HORIZONTAL_BLEED: f64 = ([\d.]+)/)[1]);
  const provenance = {clientRoot:client, height, showMs, hideMs, bleed, showEase:'1 - (1 - progress)^3',hideEase:'progress^3',sourceHash:crypto.createHash('sha256').update(motion).digest('hex'),frontend:'Unmodified original React/MUI frontend. In-memory fixtures replace only Tauri data services.'};
  fs.writeFileSync(path.join(root, 'public/revision3/desktop-source.json'), JSON.stringify(provenance,null,2));
  fs.writeFileSync(path.join(root, 'src/generated/desktop-motion.ts'), 'export const desktopMotion = '+JSON.stringify(provenance)+' as const;');
  console.log('Compiled original desktop UI:', JSON.stringify({height,showMs,hideMs,bleed}));
}
main().catch(e=>{console.error(e);process.exitCode=1});
