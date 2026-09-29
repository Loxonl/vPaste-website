const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const settle = page => page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
const chapter = async (page, index) => {
  await page.locator("[data-chapter-link]").nth(index).click();
  await page.waitForTimeout(80);
  await settle(page);
};
const feature = async (page, index) => {
  await page.locator("[data-feature-jump]").nth(index).click();
  await page.waitForTimeout(80);
  await settle(page);
};
const pose = (page, selector) => page.locator(selector).evaluate(el => ({
  transform: getComputedStyle(el).transform,
  opacity: getComputedStyle(el).opacity,
}));

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) errors.push(response.status() + " " + response.url()); });
    await page.addInitScript(() => {
      window.webVitals = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => list.getEntries().forEach(entry => { window.webVitals.lcp = entry.startTime; })).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(entry => { if (!entry.hadRecentInput) window.webVitals.cls += entry.value; })).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(base, { waitUntil: "networkidle" });
    console.log("Local lab initial rendering", await page.evaluate(() => window.webVitals));
    assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").filter(r => r.name.includes("/assets/artwork/")).length), 0);
    await chapter(page, 2);
    await page.waitForTimeout(1300);
    await page.locator("[data-demo-pause]").click();
    const frozen = await pose(page, ".app-content .vp-card-rail");
    await page.waitForTimeout(800);
    assert.deepEqual(await pose(page, ".app-content .vp-card-rail"), frozen, "Pausing freezes the active loop");
    await page.locator("[data-demo-pause]").click();
    await page.waitForTimeout(500);
    assert.notDeepEqual(await pose(page, ".app-content .vp-card-rail"), frozen, "Resuming continues the loop");
    await feature(page, 2);
    await page.locator("[data-language-button]").first().click();
    await page.waitForTimeout(1000);
    assert(await page.evaluate(() => {
      const tab = document.querySelector(".demo-tab-active").getBoundingClientRect();
      const ring = document.querySelector(".demo-tab-indicator").getBoundingClientRect();
      return Math.abs(tab.left + tab.width / 2 - ring.left - ring.width / 2) < 2;
    }), "Changing language recomputes the real tab positions");
    await feature(page, 3);
    await page.waitForTimeout(2000);
    assert.equal(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.filter(c => Number(getComputedStyle(c).opacity) > .9).length), 3);
    await feature(page, 5);
    await page.waitForTimeout(8300);
    assert.equal(await page.locator("[data-queue-count]").textContent(), "0");
    assert.equal(await page.locator(".demo-form-value").evaluateAll(rows => rows.filter(row => getComputedStyle(row).visibility === "visible").length), 4);
    await feature(page, 6);
    await page.waitForTimeout(3000);
    assert.equal((await pose(page, ".demo-dropzone img")).opacity, "1", "Dragging delivers the image into the receiving document");
    await chapter(page, 5);
    await page.waitForTimeout(4700);
    await page.locator("[data-demo-pause]").click();
    const archive = await pose(page, ".migration-bundle");
    assert.equal(archive.opacity, "1");
    await page.waitForTimeout(500);
    assert.deepEqual(await pose(page, ".migration-bundle"), archive);
    assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some(r => r.name.includes("local-history.webp"))), false);
    await chapter(page, 6);
    assert.equal(await page.locator("[data-demo-pause]").isVisible(), false);
    assert.equal(await page.locator(".app-actor").getAttribute("data-demo"), null);
    assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren(true, false, true).filter(t => t.repeat() === -1).length), 0, "Off-scene loops are removed");
    // Exercise teardown while a demo is active, then re-enter without duplicate DOM/listeners.
    await chapter(page, 2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(250);
    assert.equal(await page.locator(".product-overlays, .demo-search-field, .history-continuation").count(), 0);
    assert.equal(await page.locator("#workflow .settings-sheet").count(), 1);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(250);
    assert.equal(await page.locator(".product-overlays").count(), 1);
    assert.equal(await page.locator(".demo-search-field").count(), 1);
    assert.deepEqual(errors, []);
    console.log("PASS active loop pause/resume, language geometry, search, queue, drag, manual migration, off-scene cleanup and reduced-motion re-entry");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
