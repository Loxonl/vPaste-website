const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../test-results/selected-a");
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false", { timeout: 5000 });
};
const step = page => page.locator(".continuous-story").getAttribute("data-step").then(Number);
const idle = async page => assert.equal(await page.locator(".continuous-story").getAttribute("data-transitioning"), "false");
const screenshot = (page, name) => page.screenshot({ path: path.join(output, name + ".png") });
async function chapter(page, index) {
  await page.locator(`[data-chapter-link="${index}"]`).click();
  await settle(page);
  await idle(page);
}
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const artworkBytes = ["local-history", "desktop-windows", "desktop-macos"].reduce((total, name) => total + fs.statSync(path.resolve(__dirname, `../assets/artwork/${name}.webp`)).size, 0);
  assert(artworkBytes < 80 * 1024, "All generated delivery images together must stay below 80 KiB");
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  const errors = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "/?concept=b", { waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-concept"), "a", "Old B links now use the selected A direction");
    assert.equal(await page.locator(".concept-switch, #product-details, .final-cta, .site-footer, [data-i18n='demo.capture']").count(), 0);
    assert.equal(await page.locator("footer").count(), 0);
    assert.equal(await page.locator("#open-source footer").count(), 0);
    assert.equal(await page.locator(".chapter-copy").count(), 7);
    assert.equal(await page.locator("#search, .capture-slot, .feature-slot").count(), 0);
    assert.equal(await page.locator("[data-reading-mode]").count(), 0);
    assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").filter(entry => entry.name.includes("/assets/artwork/")).length), 0, "Editorial artwork must not load on the first scene");
    assert.equal(await page.locator('[data-i18n="usecases.title"]').count(), 1);
    assert(await page.locator(".app-content .vp-clip-card").first().evaluate(el => {
      const ratio = el.offsetWidth / el.offsetHeight;
      return ratio > .88 && ratio < .96;
    }), "Keep the client's card proportions");
    assert.deepEqual(await page.locator("[data-format-note]").evaluateAll(items => items.map(el => el.dataset.formatNote)), ["text", "image", "link", "file", "color"]);
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight), false);
    await page.evaluate(() => { window.testActor = document.querySelector(".app-actor"); window.testCards = [...document.querySelectorAll(".app-content .vp-clip-card")]; });
    await screenshot(page, "intro");
    // Drag using the mouse, not a programmatically created Range.
    const heading = await page.locator(".intro-heading h1").boundingBox();
    await page.mouse.move(heading.x + 5, heading.y + 25);
    await page.mouse.down();
    await page.mouse.move(heading.x + heading.width - 15, heading.y + 25, { steps: 18 });
    await page.mouse.up();
    assert((await page.evaluate(() => getSelection().toString())).trim().length > 0, "Visible headlines must support mouse text selection");
    await page.evaluate(() => getSelection().removeAllRanges());
    await page.mouse.wheel(0, 25);
    await page.waitForTimeout(300);
    assert.equal(await step(page), 0, "A sub-threshold gesture does not expose a partial scene");
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(1050);
    assert.equal(await page.locator(".continuous-story").getAttribute("data-transitioning"), "true", "Chapter movement is deliberately slower than one second");
    await settle(page);
    await idle(page);
    assert.equal(await step(page), 1, "A single wheel notch completes the desktop transition");
    assert(await page.evaluate(() => {
      const app = document.querySelector(".app-actor").getBoundingClientRect();
      const desktop = document.querySelector(".desktop-holder").getBoundingClientRect();
      return Math.abs(app.bottom - desktop.bottom) < 2 && Math.abs(app.left - desktop.left) < 2 && Math.abs(app.right - desktop.right) < 2;
    }));
    await screenshot(page, "desktop");
    for (const platform of ["windows", "macos"]) {
      await page.locator(`[data-platform-button="${platform}"]`).click();
      await page.locator(`.desktop-platform--${platform} img`).evaluate(img => img.decode());
      await page.waitForTimeout(500);
      await screenshot(page, "desktop-" + platform);
    }
    // One long trackpad gesture extends beyond the animation, but must advance once.
    await page.evaluate(async () => {
      for (let i = 0; i < 55; i++) {
        window.dispatchEvent(new WheelEvent("wheel", { deltaY: 15, cancelable: true }));
        await new Promise(resolve => setTimeout(resolve, 40));
      }
    });
    await settle(page);
    assert.equal(await step(page), 2, "Momentum cannot skip use cases");
    for (let i = 0; i < 7; i++) {
      await page.locator(`[data-feature-jump="${i}"]`).click();
      await settle(page);
      await idle(page);
      assert.equal(await step(page), i + 2);
      assert.equal(await page.locator(`[data-feature-jump="${i}"]`).getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator(".continuous-story").getAttribute("data-demo"), String(i));
      assert.equal(await page.locator(".app-actor .vp-app-window").count(), 1, "Demos use the original app, not nested windows");
      await page.waitForTimeout(1800);
      if (i === 2) {
        const caption = await page.locator(`[data-feature-example="${i}"] figcaption p`).boundingBox();
        await page.mouse.move(caption.x + 2, caption.y + 12);
        await page.mouse.down();
        await page.mouse.move(caption.x + caption.width - 2, caption.y + 12, { steps: 12 });
        await page.mouse.up();
        assert((await page.evaluate(() => getSelection().toString())).trim().length > 0, "Feature descriptions must also be selectable");
        await page.evaluate(() => getSelection().removeAllRanges());
      }
      assert(await page.locator(`[data-feature-example="${i}"]`).evaluate(el => {
        const rect = el.getBoundingClientRect();
        return Math.abs(rect.left - el.closest(".feature-gallery").getBoundingClientRect().left) < 2 && rect.top >= 80 && rect.bottom < innerHeight;
      }));
      if (i === 0) assert(await page.locator(".history-continuation").isVisible());
      if (i === 2) assert(await page.evaluate(() => {
        const tab = document.querySelector(".demo-tab-active").getBoundingClientRect();
        const focus = document.querySelector(".demo-tab-indicator").getBoundingClientRect();
        return Math.abs((tab.left + tab.right) / 2 - (focus.left + focus.right) / 2) < 2;
      }), "The underline follows the actual toolbar tab");
      if (i === 3) {
        assert(await page.locator(".demo-search-field").isVisible());
        await page.waitForFunction(() => document.querySelector(".demo-search-field span").textContent === "vPaste" &&
          [...document.querySelectorAll(".app-content .vp-clip-card")].filter(c => Number(getComputedStyle(c).opacity) > .9).length === 3);
        assert.equal(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.filter(c => Number(getComputedStyle(c).opacity) > .9).length), 3);
      }
      if (i === 4) {
        assert(await page.locator(".demo-preview-window").evaluate(el => el.getBoundingClientRect().bottom < document.querySelector(".app-actor").getBoundingClientRect().top));
        await page.locator(".story-status").click();
        await page.keyboard.press("Space");
        assert.equal(await step(page), 6, "Space replays the preview instead of leaving this feature");
        await page.waitForTimeout(5800);
        assert.equal(await page.locator(".demo-preview-link").evaluate(el => getComputedStyle(el).display), "block");
      }
      if (i === 5) assert(await page.locator(".demo-queue-window, .demo-form").evaluateAll(windows => windows.every(el => el.getBoundingClientRect().bottom < document.querySelector(".app-actor").getBoundingClientRect().top)));
      if (i === 6) assert(await page.locator(".demo-receiver").evaluate(el => el.getBoundingClientRect().bottom < document.querySelector(".app-actor").getBoundingClientRect().top));
      await page.locator("[data-demo-pause]").click();
      assert.equal(await page.locator("[data-demo-pause]").getAttribute("aria-pressed"), "true");
      await page.locator("[data-demo-pause]").click();
      await screenshot(page, "feature-" + i);
    }
    await page.mouse.wheel(0, -90);
    await settle(page);
    assert.equal(await step(page), 7, "Reverse scrolling also settles at a complete use case");
    await chapter(page, 3);
    for (let i = 0; i < 5; i++) {
      await page.locator(`[data-format-jump="${i}"]`).click();
      await settle(page);
      assert.equal(await step(page), i + 9);
      assert.notEqual(await page.locator(".app-content .vp-clip-card").nth(i).evaluate(el => getComputedStyle(el).transform), "matrix(1, 0, 0, 1, 0, 0)");
      if (i === 0) await screenshot(page, "format-text");
    }
    for (const language of ["zh", "en"]) {
      await page.locator(`[data-language-button="${language}"]`).click();
      for (const size of [[1440, 980], [1280, 720]]) {
        await page.setViewportSize({ width: size[0], height: size[1] });
        await page.waitForTimeout(350);
        for (const [index, name] of [[4, "settings"], [5, "local-data"], [6, "closing"]]) {
          await chapter(page, index);
          if (index === 4) {
            assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.every(card => gsap.getProperty(card, "scaleX") === 1)), "Settings keeps the original cards at their normal size, including after a storage loop");
            assert.equal(await page.locator(".settings-sheet img").count(), 1);
            assert.equal(await page.locator("#workflow .settings-catalog article").count(), 4);
            assert.equal(await page.locator("#workflow .settings-catalog li").count(), 0);
            assert(await page.evaluate(() => {
              const picture = document.querySelector(".settings-sheet").getBoundingClientRect();
              const content = document.querySelector(".settings-details").getBoundingClientRect();
              const actor = document.querySelector(".app-actor").getBoundingClientRect();
              const gear = document.querySelector('.app-content [data-product-control="settings"]').getBoundingClientRect();
              return picture.width > 400 && picture.left > content.right && picture.bottom < innerHeight && content.bottom < innerHeight - 55 &&
                Math.abs(picture.right - (gear.left + gear.width / 2)) < 3 && Math.abs(picture.bottom - (gear.top + gear.height / 2)) < 3 &&
                (actor.left > content.right || actor.top > content.bottom);
            }), "Settings image and full descriptions remain together without overlap");
          }
          if (index === 5) {
            assert.equal(await page.locator(".local-artwork").count(), 0);
            assert(await page.locator(".local-device--windows").isVisible());
            assert(await page.locator(".local-device--mac").isVisible());
            await page.waitForTimeout(4400);
          }
          await screenshot(page, `${name}-${language}-${size[0]}`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        }
        assert.equal(await page.locator(".closing-footer").count(), 0);
        assert(await page.locator(".app-actor").evaluate(el => {
          const box = el.getBoundingClientRect();
          const facts = document.querySelector(".closing-facts").getBoundingClientRect();
          return gsap.getProperty(el, "scaleX") >= .6 && gsap.getProperty(el, "rotation") === -3.5 &&
            box.right < innerWidth && box.bottom + 8 < facts.top && facts.bottom < innerHeight - 62;
        }), "The enlarged tilted app and project facts fit above the navigation rail");
      }
    }
    assert.equal(await step(page), 16);
    await page.mouse.wheel(0, 200);
    await settle(page);
    assert.equal(await step(page), 16, "The final scene is the end, not another scrolling footer");
    await page.locator("[data-story-prev]").click();
    await settle(page);
    assert.equal(await step(page), 15);
    await page.locator(".story-status").click();
    await page.keyboard.press("Home");
    await settle(page);
    assert.equal(await step(page), 0);
    await page.keyboard.press("End");
    await page.waitForTimeout(100);
    assert.equal(await page.locator(".continuous-story").getAttribute("data-chapter"), "6", "Distant navigation goes directly to its chapter, without flashing intermediate scenes");
    await page.locator('[data-chapter-link="6"]').click();
    await settle(page);
    assert.equal(await step(page), 16);
    assert(await page.evaluate(() => document.querySelector(".app-actor") === window.testActor && [...document.querySelectorAll(".app-content .vp-clip-card")].every((card, i) => card === window.testCards[i])));
    assert.equal(await page.locator(".app-actor").evaluate(el => getComputedStyle(el).opacity), "1");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".story-motion, [inert]").count(), 0);
    assert.equal(await page.locator("#use-cases .feature-gallery").count(), 1);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(300);
    await page.mouse.wheel(0, 90);
    await settle(page);
    await idle(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(300);
    assert.equal(await page.locator(".story-motion, [inert]").count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert(await page.evaluate(() => {
      const image = document.querySelector(".local-pipeline").getBoundingClientRect();
      const caption = document.querySelector(".data-actions").getBoundingClientRect();
      return image.bottom < caption.top;
    }), "Mobile artwork and its captions must not overlap");
    await page.locator("#privacy").scrollIntoViewIfNeeded();
    await screenshot(page, "mobile-data");
    await page.locator("#open-source").scrollIntoViewIfNeeded();
    await screenshot(page, "mobile-closing");
    assert.deepEqual(errors, []);
    await page.close();
    console.log("PASS threshold / complete transitions / momentum guard / 7 use cases / 5 formats / reverse / keyboard / final scene / identity / responsive teardown / both languages");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
