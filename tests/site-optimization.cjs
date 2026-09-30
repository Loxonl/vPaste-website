const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const copy = require("../site-copy.js");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../test-results/optimization");
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};
const chapter = async (page, n) => { await page.locator(`[data-chapter-link="${n}"]`).click(); await settle(page); };

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  const errors = [];
  const watch = page => {
    page.on("pageerror", e => errors.push(e.message));
    page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  };
  try {
    // Search engines and visitors receive complete localized HTML without scripts.
    for (const language of ["en", "zh"]) {
      const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
      watch(page);
      await page.goto(`${base}/${language}/`, { waitUntil: "networkidle" });
      assert.equal(await page.title(), copy[language]["meta.title"]);
      assert.equal(await page.locator(".app-content .vp-clip-card").count(), 6);
      assert.equal(await page.locator(".feature-example").count(), 7);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), `https://vpaste.app/${language}/`);
      assert.equal(await page.locator('link[rel="alternate"][hreflang]').count(), 3);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute("content"), "https://vpaste.app/assets/share-cover.jpg");
      const schema = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
      assert.equal(schema["@type"], "SoftwareApplication");
      assert.equal(schema.description, copy[language]["meta.description"]);
      assert.equal(schema.aggregateRating, undefined, "Do not invent review ratings");
      await page.locator(".settings-sheet").scrollIntoViewIfNeeded();
      await page.locator(".settings-sheet noscript img").evaluate(img => img.decode());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator(".feature-select").isVisible(), false, "No nonfunctional demo buttons without JavaScript");
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, locale: "en-US" });
    watch(page);
    await page.goto(base + "/zh/", { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-language"), "zh", "Explicit routes override browser preference");
    const resources = await page.evaluate(() => performance.getEntriesByType("resource").map(r => ({ url: r.name.replace(location.origin, ""), bytes: r.encodedBodySize })));
    assert(!resources.some(r => /settings-theme|search-(en|zh)|artwork/.test(r.url)), "Later chapter images do not load on the first screen");
    assert(!resources.some(r => /format-stack\.png|vpaste-logo\.png|brand-palettes|background-studies/.test(r.url)));
    assert(resources.reduce((sum, r) => sum + r.bytes, 0) < 500 * 1024, "First scene resources stay below 500 KiB, without relying on compression");
    for (const language of ["zh", "en"]) {
      await page.locator(`[data-language-button="${language}"]`).click();
      for (const n of [0, 1, 2, 3, 4, 5, 6]) {
        await chapter(page, n);
        const reading = await page.evaluate(() => {
          const world = document.querySelector(".story-world");
          const scale = world.getBoundingClientRect().width / world.offsetWidth;
          const active = document.querySelector('.chapter-copy[aria-hidden="false"]');
          const selectors = ".story-description, .settings-catalog p, .privacy-features li";
          return [...active.querySelectorAll(selectors)].map(el => ({ text: el.textContent, px: parseFloat(getComputedStyle(el).fontSize) * scale, minimum: el.matches(".story-description") ? 16 : 14, bottom: el.getBoundingClientRect().bottom }));
        });
        assert(reading.every(r => r.px >= r.minimum - .1), JSON.stringify({ language, n, reading }));
        assert(reading.every(r => r.bottom <= 658), "Copy must stay above the bottom rail: " + JSON.stringify({ language, n, reading }));
        const controls = await page.evaluate(() => {
          const world = document.querySelector(".story-world");
          const scale = world.getBoundingClientRect().width / world.offsetWidth;
          const active = document.querySelector('.chapter-copy[aria-hidden="false"]');
          return [...active.querySelectorAll(".button, .feature-select button, .format-select button, .platform-switch button")].map(el => ({ text: el.textContent, px: parseFloat(getComputedStyle(el).fontSize) * scale, height: el.getBoundingClientRect().height, bottom: el.getBoundingClientRect().bottom }));
        });
        assert(controls.every(r => r.px >= 13.9 && r.height >= 43.9 && r.bottom <= 658), "Readable labels and click targets: " + JSON.stringify({ language, n, controls }));
        if (n === 4) {
          assert.equal(await page.locator(".settings-sheet img").getAttribute("src"), `/assets/product/settings-theme-${language}.webp`);
          await page.locator(".settings-sheet img").evaluate(img => img.decode());
        }
        await page.screenshot({ path: path.join(output, `${language}-${n}.png`) });
      }
      await chapter(page, 2);
      for (let n = 0; n < 7; n++) {
        await page.locator(`[data-feature-jump="${n}"]`).click(); await settle(page);
        const fits = await page.locator(`[data-feature-example="${n}"] figcaption`).evaluate(caption => {
          const box = caption.closest(".feature-gallery").getBoundingClientRect();
          const world = document.querySelector(".story-world");
          const scale = world.getBoundingClientRect().width / world.offsetWidth;
          const px = parseFloat(getComputedStyle(caption.querySelector("p")).fontSize) * scale;
          return px >= 15.9 && caption.getBoundingClientRect().bottom <= box.bottom + 1;
        });
        assert(fits, `${language} feature ${n} caption is not clipped`);
        if (n >= 4) {
          const clear = await page.evaluate(n => {
            const caption = document.querySelector(`[data-feature-example="${n}"] figcaption`).getBoundingClientRect();
            const window = document.querySelector(n === 4 ? ".demo-preview-window" : n === 5 ? ".demo-queue-window" : ".demo-receiver").getBoundingClientRect();
            return window.top - caption.bottom >= 8;
          }, n);
          assert(clear, `${language} feature ${n} text clears the demo window`);
        }
      }
      await chapter(page, 3);
      for (let n = 0; n < 5; n++) {
        await page.locator("[data-format-jump]").nth(n).click(); await settle(page);
        const fits = await page.locator("[data-format-note]").nth(n).evaluate(note => {
          const world = document.querySelector(".story-world");
          const scale = world.getBoundingClientRect().width / world.offsetWidth;
          const box = note.closest(".format-notes-viewport").getBoundingClientRect();
          return [...note.querySelectorAll("p, li")].every(el => {
            const minimum = el.matches("p") ? 16 : 14;
            return parseFloat(getComputedStyle(el).fontSize) * scale >= minimum - .1 && el.getBoundingClientRect().bottom <= box.bottom + 1;
          });
        });
        assert(fits, `${language} format ${n} description and traits remain readable and unclipped`);
      }
    }
    await chapter(page, 2);
    await page.locator('[data-feature-jump="0"]').click(); await settle(page);
    await page.locator('[data-feature-jump="0"]').focus();
    await page.keyboard.press("PageDown"); await settle(page);
    assert.equal(await page.locator(".continuous-story").getAttribute("data-step"), "3", "PageDown works after focusing a feature button");
    await page.locator('[data-feature-jump="1"]').focus();
    await page.keyboard.press("Space"); await settle(page);
    assert.equal(await page.locator(".continuous-story").getAttribute("data-step"), "3", "Space keeps the button's native activation behavior");
    await page.locator('[data-language-button="zh"]').click();
    assert.equal(await page.locator(".continuous-story").getAttribute("data-step"), "3", "Language changes retain the current scene");
    assert.equal(new URL(page.url()).pathname, "/zh/");
    await page.setViewportSize({ width: 980, height: 620 });
    await page.waitForFunction(() => !document.querySelector(".story-motion"));
    await page.locator(".settings-sheet").scrollIntoViewIfNeeded();
    await page.locator(".settings-sheet img").evaluate(img => img.decode());
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.close();
    // Detection is simulated in Chromium; this does not claim native Safari testing.
    for (const [platform, touch, expected] of [["Win32", 0, "windows"], ["MacIntel", 0, "macos"], ["MacIntel", 5, "windows"], ["Linux x86_64", 0, "windows"]]) {
      const p = await browser.newPage({ viewport: { width: 1280, height: 720 }, userAgent: platform.includes("Mac") ? "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" : `Mozilla/5.0 (${platform})` });
      watch(p);
      await p.addInitScript(({ platform, touch }) => {
        Object.defineProperty(navigator, "platform", { get: () => platform });
        Object.defineProperty(navigator, "maxTouchPoints", { get: () => touch });
        Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
      }, { platform, touch });
      await p.goto(base + "/en/", { waitUntil: "networkidle" });
      assert.equal(await p.locator("html").getAttribute("data-platform"), expected);
      assert((await p.locator("[data-platform-shortcut]").allTextContents()).every(text => text === (expected === "macos" ? "Option + V" : "Alt + V")));
      assert.equal(await p.locator(".demo-format-note kbd").textContent(), "Shift + Enter", "Plain-text paste uses the same shortcut on Windows and Mac");
      await p.close();
    }
    for (const script of ["site-copy.js", "site.js", "story-icons.js", "site-background.js", "product-demos.js", "motion-concepts.js"]) {
      const fallback = await browser.newPage({ viewport: { width: 1280, height: 720 } });
      watch(fallback);
      await fallback.route(`**/${script}`, route => route.abort());
      await fallback.goto(base + "/zh/", { waitUntil: "networkidle" });
      assert.equal(await fallback.locator(".story-motion").count(), 0, `${script} failure must not lock the scene`);
      assert.equal(await fallback.locator(".app-content .vp-clip-card").count(), 6);
      await fallback.mouse.wheel(0, 500);
      await fallback.waitForTimeout(100);
      assert(await fallback.evaluate(() => scrollY > 0), `${script} failure keeps native scrolling`);
      if (script === "motion-concepts.js") {
        await fallback.locator('[data-feature-jump="5"]').click();
        assert(await fallback.locator('[data-feature-example="5"]').evaluate(el => el.getBoundingClientRect().top < innerHeight));
      }
      await fallback.close();
    }
    const share = fs.readFileSync(path.resolve(__dirname, "../assets/share-cover.jpg"));
    assert(share.length < 100 * 1024, "Social cover stays compact");
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, "resources.json"), JSON.stringify(resources, null, 2));
    console.log(`PASS static localized SEO, no-JS, lazy loading, readable laptop copy, keyboard, platform shortcuts; ${resources.reduce((sum, r) => sum + r.bytes, 0)} resource bytes`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
