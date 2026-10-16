// Preserve the genuine client toolbar and compose the website's promotional cards.
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const assets = path.resolve(__dirname, '..');
const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="600"><defs><radialGradient id="glow"><stop stop-color="#dcecff" stop-opacity=".72"/><stop offset="1" stop-color="#fafcff" stop-opacity="0"/></radialGradient><filter id="shadow" x="-20%" y="-70%" width="140%" height="240%"><feGaussianBlur stdDeviation="15"/></filter></defs><rect width="1800" height="600" fill="#fafcff"/><ellipse cx="900" cy="480" rx="1100" ry="225" fill="url(#glow)"/><rect x="60" y="219" width="1680" height="350" rx="15" fill="#21569a" opacity=".15" filter="url(#shadow)"/></svg>`);
const corners = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1680" height="350"><rect width="1680" height="350" rx="14" fill="white"/></svg>');

(async () => {
  const verification = { viewport: {width:1448,height:302}, captureScale:2, output:{width:1800,height:600}, window:{x:60,y:208,width:1680,height:350}, languages:{} };
  for (const language of ['zh', 'en']) {
    const header = await sharp(path.join(__dirname, `header-${language}.png`)).png().toBuffer();
    // Only width is specified: Sharp preserves the capture's aspect ratio.
    const native = await sharp(path.join(__dirname, `native-window-${language}.png`)).resize({width:1680}).png().toBuffer();
    const cards = await sharp(path.join(__dirname, `promo-cards-${language}.png`)).resize({width:1680}).png().toBuffer();
    const ui = await sharp(native).composite([{input:cards,left:0,top:56}]).png().toBuffer();
    const framed = await sharp(ui).ensureAlpha().composite([{input:corners,blend:'dest-in'}]).png().toBuffer();
    const output = path.join(assets, `readme-banner-${language}.png`);
    await sharp(background).composite([{input:header,left:0,top:0},{input:framed,left:60,top:208}]).removeAlpha().png({compressionLevel:9,adaptiveFiltering:true}).toFile(output);
    const actual = await sharp(output).extract({left:76,top:224,width:1648,height:318}).raw().toBuffer();
    const expected = await sharp(ui).extract({left:16,top:16,width:1648,height:318}).removeAlpha().raw().toBuffer();
    assert.deepEqual(actual, expected, `${language}: preserve the composed window pixels`);
    const toolbar = await sharp(output).extract({left:76,top:224,width:1648,height:40}).raw().toBuffer();
    const nativeToolbar = await sharp(native).extract({left:16,top:16,width:1648,height:40}).removeAlpha().raw().toBuffer();
    assert.deepEqual(toolbar, nativeToolbar, `${language}: native toolbar must remain unchanged`);
    const renderedCards = await sharp(output).extract({left:76,top:280,width:1648,height:262}).raw().toBuffer();
    const sourceCards = await sharp(cards).extract({left:16,top:16,width:1648,height:262}).removeAlpha().raw().toBuffer();
    assert.deepEqual(renderedCards, sourceCards, `${language}: preserve the rendered website cards`);
    const brand = await sharp(output).extract({left:0,top:0,width:1800,height:202}).raw().toBuffer();
    assert.deepEqual(brand, await sharp(header).removeAlpha().raw().toBuffer(), `${language}: preserve the approved brand/header`);
    const file = fs.readFileSync(output);
    verification.languages[language] = {nativeToolbarPixelDifference:0,promoCardsPixelDifference:0,headerPixelDifference:0,bytes:file.length,sha256:crypto.createHash('sha256').update(file).digest('hex')};
  }
  fs.writeFileSync(path.join(__dirname, 'verification.json'), JSON.stringify(verification, null, 2));
  console.log(JSON.stringify(verification, null, 2));
})().catch(error => { console.error(error); process.exitCode=1; });
