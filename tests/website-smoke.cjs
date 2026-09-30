// Local static/reduced-motion, content and accessibility smoke checks.
const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const translations = require("../site-copy.js");
const issues = [];

async function layout(page) {
  assert.deepEqual(await page.evaluate(() => {
    const errors = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) errors.push("horizontal overflow");
    const ids = [...document.querySelectorAll("[id]")].map(el => el.id);
    if (ids.length !== new Set(ids).size) errors.push("duplicate IDs");
    for (const a of document.querySelectorAll('a[href^="#"]')) if (!document.querySelector(a.hash)) errors.push(a.hash);
    for (const img of document.images) if (img.currentSrc && img.complete && !img.naturalWidth) errors.push("broken " + img.src);
    for (const button of document.querySelectorAll("button")) if (!button.textContent.trim() && !button.getAttribute("aria-label")) errors.push("unnamed button");
    return errors;
  }), []);
  const keys = await page.locator("[data-i18n], [data-i18n-alt], [data-i18n-aria]").evaluateAll(nodes => nodes.flatMap(node => [node.dataset.i18n, node.dataset.i18nAlt, node.dataset.i18nAria].filter(Boolean)));
  for (const key of keys) {
    assert(translations.en[key], "Missing English " + key);
    assert(translations.zh[key], "Missing Chinese " + key);
  }
}

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    for (const variant of ["a", "b"]) {
      for (const width of [375, 768, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 980 }, reducedMotion: "reduce", locale: "zh-CN" });
        page.on("pageerror", error => issues.push(error.message));
        page.on("response", response => { if (response.status() >= 400) issues.push(response.status() + " " + response.url()); });
        await page.goto(base + "/?concept=" + variant, { waitUntil: "networkidle" });
        assert.equal(await page.locator(".app-actor").count(), 1);
        assert.equal(await page.locator(".app-content .vp-clip-card").count(), 6);
        assert.equal(await page.locator("h1").count(), 1);
        assert.equal(await page.locator(".story-motion").count(), 0);
        assert.equal(await page.locator("html").getAttribute("data-concept"), "a");
        assert.equal(await page.locator(".feature-example").count(), 7);
        assert.equal(await page.locator("footer").count(), 1);
        assert.equal(await page.locator(".concept-switch, .detail-features, [data-i18n='demo.capture']").count(), 0);
        for (const language of ["zh", "en"]) {
          await page.locator('[data-language-button="' + language + '"]').click();
          assert.equal(await page.locator("#search, .capture-slot").count(), 0);
          await page.locator(".settings-sheet").scrollIntoViewIfNeeded();
          await page.waitForFunction(language => document.querySelector(".settings-sheet img").getAttribute("src") === "/assets/product/settings-theme-" + language + ".webp", language);
          assert.equal(await page.locator(".format-notes-track article").count(), 5);
          for (let i = 0; i < 7; i++) {
            assert(await page.locator(".feature-example h3").nth(i).innerText());
            assert(await page.locator(".feature-example figcaption p").nth(i).innerText());
            assert(await page.locator(".feature-art").nth(i).isVisible());
          }
          assert.equal(await page.locator("#workflow .settings-catalog article").count(), 4);
          await page.locator('[data-platform-button="macos"]').click();
          assert.equal(await page.locator("html").getAttribute("data-platform"), "macos");
          await page.locator('[data-platform-button="windows"]').click();
          assert.equal(await page.locator("[data-menu-button], .site-header [data-section-link]").count(), 0);
          assert(await page.locator(".nav-github").isVisible());
          assert.equal(await page.locator(".nav-github").getAttribute("aria-label"), "GitHub");
          assert(await page.locator(".nav-github svg").evaluate(svg => svg.getBoundingClientRect().width >= 16), "The compact GitHub icon must not collapse inside its padding");
          await layout(page);
          console.log("PASS", variant, width, language, "content, screenshots, seven illustrations, platform, navigation");
        }
        await page.close();
      }
    }
    const fallback = await browser.newPage({ viewport: { width: 1440, height: 980 } });
    await fallback.route("**/assets/vendor/gsap-*.min.js", route => route.abort());
    await fallback.goto(base, { waitUntil: "networkidle" });
    assert.equal(await fallback.evaluate(() => !!window.gsap), false);
    assert.equal(await fallback.locator(".story-motion").count(), 0);
    assert.equal(await fallback.locator(".chapter-copy").count(), 7);
    await layout(fallback);
    await fallback.close();
    const reader = await browser.newPage({ viewport: { width: 1440, height: 980 } });
    await reader.goto(base + "/?view=read", { waitUntil: "networkidle" });
    assert.equal(await reader.locator(".story-motion").count(), 0);
    assert.equal(await reader.locator(".chapter-copy").count(), 7);
    await reader.mouse.wheel(0, 700);
    await reader.waitForTimeout(500);
    assert(await reader.evaluate(() => scrollY > 0));
    await layout(reader);
    await reader.close();
    assert.deepEqual(issues, []);
    console.log("PASS reduced motion, legacy reading mode and unavailable animation library; zero page/HTTP errors");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
