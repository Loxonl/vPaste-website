const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const settle = page => page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
async function jump(page, selector) {
  await page.locator(selector).click();
  await page.waitForTimeout(80);
  await settle(page);
}

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(await page.locator(".site-header [data-section-link], [data-menu-button]").count(), 0, "Use only the chapter navigator, not duplicate header links");
    await page.evaluate(() => { window.originalCards = [...document.querySelectorAll(".app-content .vp-clip-card")]; });
    await jump(page, '[data-chapter-link="2"]');
    assert.equal(await page.locator('[data-feature-example="0"] h3').innerText(), "持续记录复制历史");
    assert(await page.evaluate(() => {
      const heading = document.querySelector("#use-cases .chapter-heading").getBoundingClientRect();
      const caption = document.querySelector(".feature-gallery").getBoundingClientRect();
      return caption.top - heading.bottom > 30;
    }), "Separate the section introduction from the individual feature caption");
    await jump(page, '[data-feature-jump="1"]');
    const peaks = Array(6).fill(0);
    for (let i = 0; i < 24; i++) {
      const ys = await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.map(card => Math.abs(gsap.getProperty(card, "y"))));
      ys.forEach((y, n) => { peaks[n] = Math.max(peaks[n], y); });
      await page.waitForTimeout(100);
    }
    assert(peaks.every(y => y > 8), "The formatting wave reaches every original card");
    await jump(page, '[data-feature-jump="2"]');
    await page.waitForTimeout(900);
    assert(await page.locator(".demo-tab-active").evaluate(tab => {
      const line = document.querySelector(".demo-tab-indicator").getBoundingClientRect();
      const rect = tab.getBoundingClientRect();
      return getComputedStyle(tab).backgroundColor === "rgba(0, 0, 0, 0)" && line.height < 4 && Math.abs(line.bottom - rect.bottom) < 3;
    }), "Selected tabs use the client's accent underline, not a colored box");
    await jump(page, '[data-feature-jump="5"]');
    await page.waitForTimeout(2200);
    assert.equal(await page.locator("[data-queue-count]").innerText(), "4");
    assert.equal(await page.locator(".demo-form-value").evaluateAll(values => values.filter(v => getComputedStyle(v).visibility === "visible").length), 0);
    await page.waitForTimeout(6000);
    assert.equal(await page.locator("[data-queue-count]").innerText(), "0");
    assert.equal(await page.locator(".demo-form-value").evaluateAll(values => values.filter(v => getComputedStyle(v).visibility === "visible").length), 4);
    assert.equal(await page.locator(".demo-queue-badge").count(), 0);
    await jump(page, '[data-chapter-link="3"]');
    assert(await page.locator(".app-content .vp-clip-card").first().evaluate(card => {
      const world = document.querySelector(".story-world").getBoundingClientRect();
      const rect = card.getBoundingClientRect();
      return (rect.left - world.left) / (world.width / 1440) < 900;
    }), "Bring the extracted card closer to the description");
    await jump(page, '[data-chapter-link="4"]');
    assert(await page.locator(".settings-catalog article p").evaluateAll(items => items.every(p => p.textContent.length >= 22)));
    await jump(page, '[data-chapter-link="5"]');
    assert.equal(await page.locator(".privacy-features li").count(), 5);
    await page.waitForTimeout(1300);
    assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.some(card => gsap.getProperty(card, "scaleX") < .6)), "The original cards travel into local storage");
    assert(await page.locator(".local-device").evaluateAll(devices => devices.every(device => device.offsetWidth <= 130)));
    await jump(page, '[data-chapter-link="0"]');
    assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.every((card, i) => card === window.originalCards[i] && Number(getComputedStyle(card).opacity) === 1 && gsap.getProperty(card, "scaleX") === 1)), "Leaving storage restores the original cards");
    await jump(page, '[data-chapter-link="5"]');
    await page.waitForTimeout(4400);
    await jump(page, '[data-chapter-link="6"]');
    await jump(page, '[data-chapter-link="4"]');
    assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.every(card => gsap.getProperty(card, "scaleX") === 1 && gsap.getProperty(card, "x") === 0)), "Leaving after the local loop's reset keyframes also restores all cards");
    assert.deepEqual(errors, []);
    console.log("PASS detail refinements: spacing, copy, all-card wave, real tabs, four-field queue, card placement, settings, compact local migration and cleanup");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
