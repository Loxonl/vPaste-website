const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../test-results/window-fidelity");
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  const failures = [];
  const errors = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  try {
    for (const [width, height, language] of [[1280, 720, "zh"], [1440, 980, "en"]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      page.on("pageerror", e => errors.push(e.message));
      page.on("response", r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
      await page.goto(`${base}/${language}/`, { waitUntil: "networkidle" });
      const headerFits = () => page.locator(".site-nav > .brand").evaluate(brand => {
        const box = brand.getBoundingClientRect();
        const image = brand.querySelector("img").getBoundingClientRect();
        const text = brand.querySelector("span").getBoundingClientRect();
        const small = innerWidth < 1100 || innerHeight < 720;
        return Math.abs(image.left - box.left - (box.right - text.right)) < 1 &&
          Math.abs((image.top + image.bottom) / 2 - (box.top + box.bottom) / 2) < 1 &&
          image.width >= (small ? 36 : 40) &&
          parseFloat(getComputedStyle(brand.querySelector("span")).fontSize) >= (small ? 24 : 26);
      });
      check(await headerFits(), `${language}: masthead logo/wordmark should be larger and centered`);
      await page.screenshot({ path: path.join(output, `header-${language}.png`) });
      await page.evaluate(() => { window.originalCards = [...document.querySelectorAll(".app-content .vp-clip-card")]; });
      await page.locator('[data-chapter-link="2"]').click(); await settle(page);
      await page.locator('[data-feature-jump="3"]').click(); await settle(page);
      await page.waitForTimeout(2100);
      check(await page.evaluate(() => {
        const app = document.querySelector(".app-content");
        const field = app.querySelector(".demo-search-field");
        const button = app.querySelector(".vp-app-icon-button").getBoundingClientRect();
        const input = field.getBoundingClientRect();
        const tabs = app.querySelector(".vp-app-tabs").getBoundingClientRect();
        const scale = input.width / field.offsetWidth;
        return Math.abs((input.left - button.right) / scale - 7) < 1 &&
          tabs.left > input.right && field.offsetWidth === 276 &&
          parseFloat(getComputedStyle(field).borderRadius) === 16;
      }), `${language}: search must follow its button with the client's 7px gap and pill shape`);
      await page.screenshot({ path: path.join(output, `search-${language}.png`) });
      await page.locator('[data-feature-jump="4"]').click(); await settle(page);
      await page.waitForTimeout(1700);
      check(await page.locator(".demo-preview-window").evaluate(popup => {
        const box = popup.getBoundingClientRect();
        const app = document.querySelector(".app-actor").getBoundingClientRect();
        const caption = document.querySelector('[data-feature-example="4"] figcaption').getBoundingClientRect();
        const image = popup.querySelector(".demo-preview-image img");
        const photo = image.getBoundingClientRect();
        return !popup.querySelector(".demo-window-title, .demo-preview-image small") &&
          popup.querySelector(".demo-preview-pin")?.offsetWidth === 30 &&
          getComputedStyle(popup.querySelector(".demo-preview-content")).padding === "8px" &&
          Math.abs(photo.width / photo.height - image.naturalWidth / image.naturalHeight) < .01 &&
          box.width / box.height < 1.8 && box.bottom < app.top && box.top - caption.bottom >= 8;
      }), `${language}: preview must match the title-free, pinned client window and clear the caption`);
      await page.screenshot({ path: path.join(output, `preview-image-${language}.png`) });
      await page.waitForTimeout(4400);
      check(await page.locator(".demo-preview-link").evaluate(link => {
        const url = link.querySelector(".demo-url");
        return getComputedStyle(link).display === "block" && url.offsetHeight === 34 &&
          parseFloat(getComputedStyle(url).borderRadius) >= 16 && !!link.querySelector(".demo-preview-document");
      }), `${language}: link preview needs the real capsule URL and separate document pane`);
      await page.screenshot({ path: path.join(output, `preview-link-${language}.png`) });
      await page.locator('[data-feature-jump="0"]').click(); await settle(page);
      check(await page.evaluate(() => {
        const box = document.querySelector(".demo-search-layout");
        return (!box || box.offsetWidth === 28) &&
          [...document.querySelectorAll(".app-content .vp-clip-card")].every((card, i) => card === window.originalCards[i]);
      }), `${language}: leaving search/preview must restore the original toolbar and cards`);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(300);
      check(await page.locator(".demo-search-field, .demo-search-layout, .demo-preview-window").count() === 0,
        `${language}: animated controls must be removed when motion is disabled`);
      check(await page.locator(".app-content .vp-app-bar > .vp-app-icon-button").count() === 2,
        `${language}: responsive cleanup must restore both original toolbar buttons`);
      await page.setViewportSize({ width: 375, height: 812 });
      check(await headerFits(), `${language}: mobile masthead should remain centered`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${language}: no mobile overflow`);
      await page.screenshot({ path: path.join(output, `mobile-${language}.png`) });
      await page.close();
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log("PASS centered brand / native search geometry / pinned image and link preview / original-card identity / responsive cleanup");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
