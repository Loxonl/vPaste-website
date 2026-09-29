const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../visual-experiments/background-studies");
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    const issues = [];
    page.on("pageerror", error => issues.push(error.message));
    page.on("response", response => { if (response.status() >= 400) issues.push(response.status() + " " + response.url()); });
    await page.goto(base + "/?backdrop=a", { waitUntil: "networkidle" });
    assert.equal(await page.locator("[data-backdrop-choice]").count(), 7);
    await page.evaluate(() => { window.initialActor = document.querySelector(".app-actor"); window.initialCards = [...document.querySelectorAll(".app-content .vp-clip-card")]; window.initialCopy = document.querySelector(".story-copies").textContent; });
    const families = new Set();
    for (const variant of "abcdefg") {
      await page.locator(".study-picker summary").click();
      await page.locator(`[data-backdrop-choice="${variant}"]`).click();
      assert.equal(await page.locator("html").getAttribute("data-backdrop"), variant);
      assert.equal(await page.locator(".study-picker").getAttribute("open"), null);
      assert.equal(await page.locator(".study-backdrop").count(), 1);
      families.add(await page.locator(".study-backdrop").getAttribute("data-family"));
      assert.match(await page.locator(".study-backdrop").getAttribute("data-seed"), /^\d{128}$/);
      assert(await page.evaluate(() => document.querySelector(".app-actor") === window.initialActor && [...document.querySelectorAll(".app-content .vp-clip-card")].every((card, i) => card === window.initialCards[i]) && document.querySelector(".story-copies").textContent === window.initialCopy));
      await page.locator('[data-chapter-link="0"]').click();
      await settle(page);
      await page.screenshot({ path: path.join(output, variant + "-intro.png") });
      const initial = await page.locator(".study-backdrop [data-bg-motion]").first().getAttribute("transform");
      await page.mouse.wheel(0, 100);
      await settle(page);
      assert.notEqual(await page.locator(".study-backdrop [data-bg-motion]").first().getAttribute("transform"), initial, "The background follows the scene transition");
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.screenshot({ path: path.join(output, variant + "-features.png") });
      const step = await page.locator(".continuous-story").getAttribute("data-step");
      await page.locator(".study-picker summary").click();
      await page.locator(`[data-backdrop-choice="${variant}"]`).click();
      assert.equal(await page.locator(".continuous-story").getAttribute("data-step"), step, "Compare designs without restarting the content");
      await page.locator('[data-chapter-link="6"]').click();
      await settle(page);
      await page.screenshot({ path: path.join(output, variant + "-closing.png") });
      assert.equal(await page.locator("footer").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren(true, false, true).filter(t => t.repeat() === -1).length), 0, "No perpetual background render loops");
      console.log("PASS background", variant, "identity, motion, navigation, closing");
    }
    assert.equal(families.size, 7);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.locator('[data-language-button="en"]').click();
    for (const variant of "abcdefg") {
      await page.locator(".study-picker summary").click();
      await page.locator(`[data-backdrop-choice="${variant}"]`).click();
      for (const chapter of [4, 5, 6]) {
        await page.locator(`[data-chapter-link="${chapter}"]`).click();
        await settle(page);
        assert(await page.locator(".chapter-links").evaluate(el => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; }));
        assert(await page.locator("[data-story-next]").evaluate(el => { const r = el.getBoundingClientRect(); return r.right <= innerWidth && r.bottom <= innerHeight; }));
        await page.screenshot({ path: path.join(output, `${variant}-en-1280-chapter-${chapter}.png`) });
      }
    }
    const beforeKeys = await page.locator(".continuous-story").getAttribute("data-step");
    await page.locator(".study-picker summary").focus();
    await page.keyboard.press("Space");
    assert.equal(await page.locator(".study-picker").getAttribute("open"), "");
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".study-picker").getAttribute("open"), null);
    assert.equal(await page.locator(".continuous-story").getAttribute("data-step"), beforeKeys, "The picker does not trigger scene shortcuts");
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: width === 1280 ? 720 : 980 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const variant of "abcdefg") {
        await page.locator(".study-picker summary").click();
        await page.locator(`[data-backdrop-choice="${variant}"]`).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await page.locator(".study-backdrop").getAttribute("aria-hidden"), "true");
        assert(await page.locator(".study-picker summary").evaluate(el => el.getBoundingClientRect().right <= innerWidth));
        await page.screenshot({ path: path.join(output, `${variant}-${width}-reduced.png`) });
      }
    }
    await page.goto(base + "/background-studies.html", { waitUntil: "networkidle" });
    assert.equal(await page.locator("[data-study-card]").count(), 7);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.screenshot({ path: path.join(output, "overview.png"), fullPage: true });
    assert.deepEqual(issues, []);
    console.log("PASS seven deterministic studies, desktop/mobile/reduced motion, no console or HTTP errors");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
