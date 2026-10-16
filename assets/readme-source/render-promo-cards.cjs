// Render the website's approved promotional cards below the native toolbar.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const sourcePath = path.resolve(__dirname, '../../video-demo/src/generated/website.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const readExport = name => JSON.parse(source.match(new RegExp(`^export const ${name} = (.+);$`, 'm'))[1]);
const cardCss = readExport('cardCss');
// These dimensions and table refinements are the approved website/video version.
const layout = `html,body{margin:0;width:1680px;height:294px;overflow:hidden;background:#edf0ed}*{box-sizing:border-box}.vp-product-surface{--vp-card-width:168px;--vp-card-height:184px;--vp-card-header:48px;--vp-source-frame:60px;--vp-source-height:58px;--vp-source-icon:54px;--vp-source-offset:-4px;position:absolute;left:58.45px;top:13.6px;display:flex;gap:14px;width:1078px;height:184px;min-height:0;background:transparent;overflow:visible;transform:scale(1.45);transform-origin:0 0}.vp-clip-card{border-radius:12px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}svg{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round}img{display:block;max-width:100%}.vp-rich-card{padding:6px}.vp-rich-card table{min-width:0;width:100%;font-size:10.5px;line-height:1.3;table-layout:fixed}.vp-rich-card th,.vp-rich-card td{padding:4px 3px;white-space:normal;overflow-wrap:anywhere}.vp-rich-card th:first-child{width:44%}html[lang=en] .vp-rich-card th:first-child{width:38%}html[lang=en] .vp-rich-card th:nth-child(2){width:24%}html[lang=en] .vp-rich-card th:nth-child(3){width:38%}html[lang=en] .vp-rich-card th,html[lang=en] .vp-rich-card td{padding:4px 2px}`;

(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  try {
    for(const language of ['zh','en']) {
      const cards = readExport(language === 'zh' ? 'cards' : 'englishCards');
      assert.equal(cards.length,6);
      const page = await browser.newPage({viewport:{width:1680,height:294},deviceScaleFactor:2});
      await page.setContent(`<html lang="${language}"><meta charset="utf-8"><style>${cardCss}\n${layout}</style><body><div class="vp-product-surface">${cards.join('')}</div></body></html>`);
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
      const metrics = await page.locator('.vp-clip-card').evaluateAll(cards=>cards.map(card=>{const r=card.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));
      for(const card of metrics) {
        assert.ok(Math.abs(card.width/card.height-168/184)<0.001);
        assert.ok(card.x>=0 && card.x+card.width<=1680 && card.y>=0 && card.y+card.height<=294);
      }
      const table = await page.locator('.vp-rich-card').evaluate(container=>{const table=container.querySelector('table');const r=container.getBoundingClientRect();const t=table.getBoundingClientRect();return {columns:table.rows[0].cells.length,fits:t.right<=r.right && t.bottom<=r.bottom};});
      assert.equal(table.columns,3);assert.ok(table.fits);
      await page.screenshot({path:path.join(__dirname,`promo-cards-${language}.png`)});
      fs.writeFileSync(path.join(__dirname,`promo-metrics-${language}.json`),JSON.stringify({source:'video-demo/src/generated/website.ts',sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),scale:1.45,cards:metrics,table},null,2));
      console.log(`${language}: six website cards at original 168:184 aspect ratio; all three table columns visible`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
