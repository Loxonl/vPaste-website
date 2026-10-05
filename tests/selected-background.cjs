const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../test-results/selected-background");
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};
const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    const issues = [];
    page.on("pageerror", error => issues.push(error.message));
    page.on("response", response => { if (response.status() >= 400) issues.push(response.status() + " " + response.url()); });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-backdrop"), "ce");
    assert.equal(await page.locator("html").getAttribute("data-background-family"), "glyphs");
    assert.equal(await page.locator("html").getAttribute("data-background-layout"), "cutout");
    assert.equal(await page.locator(".study-picker").count(), 0, "No experiment selector remains on the final homepage");
    assert.equal(await page.locator(".site-nav > .brand img").getAttribute("src"), "/assets/vpaste-tray.svg");
    assert.equal(await page.locator(".bg-glyph").count(), 7);
    assert.equal(await page.locator('[data-bg-motion^="cutout"]').count(), 0);
    assert.equal(await page.locator(".world-lines").isVisible(), false);
    assert.equal(await page.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--accent").trim()), "#0b86ff");
    assert.equal(await page.locator(".study-backdrop").getAttribute("data-seed"), "72522374415698564986764039109175775362558060185520166889326183585323754639733375696758390039863613407718927478202773874106329198");
    const rail = await page.locator(".story-wayfinder").evaluate(el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return { left: r.left, right: r.right, bottom: r.bottom, height: r.height, background: s.backgroundColor, color: s.color }; });
    assert.deepEqual([rail.left, rail.right, rail.bottom, rail.height], [0, 1440, 980, 62]);
    assert.equal(rail.background, "rgb(7, 91, 232)");
    const brightness = [luminance(rail.background), luminance(rail.color)].sort((a, b) => b - a);
    assert((brightness[0] + .05) / (brightness[1] + .05) >= 4.5, "Footer labels remain readable on product blue");
    await page.evaluate(() => { window.originalApp = document.querySelector(".app-actor"); window.originalCards = [...document.querySelectorAll(".app-content .vp-clip-card")]; });
    const initial = await page.locator('[data-bg-motion="glyph-belt"]').getAttribute("transform");
    for (const chapter of [0, 1, 2, 3, 4, 5, 6, 0]) {
      await page.locator(`[data-chapter-link="${chapter}"]`).click();
      await settle(page);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert(await page.evaluate(() => document.querySelector(".app-actor") === window.originalApp && [...document.querySelectorAll(".app-content .vp-clip-card")].every((card, i) => card === window.originalCards[i])));
      if (chapter === 6) assert.notEqual(await page.locator('[data-bg-motion="glyph-belt"]').getAttribute("transform"), initial);
      await page.screenshot({ path: path.join(output, `desktop-${chapter}.png`) });
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.locator('[data-language-button="en"]').click();
    for (const chapter of [2, 4, 6]) {
      await page.locator(`[data-chapter-link="${chapter}"]`).click();
      await settle(page);
      assert(await page.locator(".chapter-links").evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }));
      await page.screenshot({ path: path.join(output, `english-${chapter}.png`) });
    }
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 980 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForFunction(() => !document.querySelector(".story-motion"));
      assert.equal(await page.locator(".story-motion").count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert(await page.locator(".nav-github").isVisible());
      assert.equal(await page.locator("footer").count(), 0);
      await page.screenshot({ path: path.join(output, `reduced-${width}.png`) });
    }
    for (const variant of ["c", "e"]) {
      await page.goto(base + "/?backdrop=" + variant, { waitUntil: "networkidle" });
      assert.equal(await page.locator("html").getAttribute("data-backdrop"), "ce");
      assert.equal(await page.locator("[data-backdrop-choice]").count(), 0);
    }
    assert.deepEqual(issues, []);
    console.log("PASS C artwork + E layout + Electric white, scene identity, contrast, small screens and normalized old links");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
