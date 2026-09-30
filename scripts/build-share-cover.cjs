// A lightweight social cover captured from the real final homepage, not a mock UI.
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const sharp = require(process.env.SHARP_MODULE || "sharp");
(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "en-US", deviceScaleFactor: 1 });
    await page.goto((process.env.SITE_URL || "http://127.0.0.1:8765") + "/en/", { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ".nav-actions, .story-wayfinder, .scroll-progress { visibility: hidden !important; }" });
    const capture = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 756 } });
    const output = path.resolve(__dirname, "../assets/share-cover.jpg");
    await sharp(capture).resize(1200, 630).jpeg({ quality: 85, mozjpeg: true }).toFile(output);
    console.log("Built assets/share-cover.jpg (1200 × 630)");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
