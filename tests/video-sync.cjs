// Product-fidelity regressions from the approved video; no video files are changed.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const output = path.resolve(__dirname, "../test-results/video-sync");
const settle = async page => {
  await page.waitForTimeout(100);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};
const jump = async (page, selector) => { await page.locator(selector).click(); await settle(page); };
// Seek the live demo timeline, not a separate test implementation of its state machine.
const seek = (page, selector, time) => page.evaluate(({ selector, time }) => {
  const target = document.querySelector(selector);
  const loop = gsap.globalTimeline.getChildren(true, false, true).find(timeline =>
    timeline.repeat() === -1 && timeline.getChildren(true, true, false).some(tween => tween.targets().includes(target)));
  if (!loop) throw new Error("No demo timeline for " + selector);
  loop.pause().time(time, false);
}, { selector, time });

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  const errors = [];
  try {
    for (const language of ["zh", "en"]) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
      page.on("pageerror", e => errors.push(e.message));
      page.on("response", r => { if (r.status() >= 400) errors.push(r.url()); });
      await page.goto(`${base}/${language}/`, { waitUntil: "networkidle" });
      assert(await page.locator(".app-actor").evaluate(actor => gsap.getProperty(actor, "rotation") === 0 && actor.getBoundingClientRect().width > 800));
      assert.deepEqual(await page.locator(".story-product [data-product-control]").evaluateAll(nodes => nodes.map(n => n.dataset.productControl)), ["search", "queue", "settings"]);
      assert.deepEqual(await page.locator(".story-product .vp-tab-emoji").allTextContents(), ["📝", "🖼️", "🔗", "🎨", "📁"]);
      assert(await page.locator(".story-product .vp-rich-card").evaluate(card => {
        const table = card.querySelector("table").getBoundingClientRect(), box = card.getBoundingClientRect();
        return table.right <= box.right && table.bottom <= box.bottom &&
          [...card.querySelectorAll("td, th")].every(cell => cell.scrollWidth <= cell.clientWidth + 1);
      }), `${language}: complete table with no overflowing words`);
      assert(await page.locator(".story-product .vp-rich-card").evaluate(card => {
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
        let text;
        while ((text = walker.nextNode())) {
          if (!text.textContent.trim()) continue;
          const range = document.createRange();
          range.selectNodeContents(text);
          if (range.getClientRects().length > 1) return false;
        }
        return true;
      }), `${language}: table text stays on one line within each cell`);
      await page.screenshot({ path: path.join(output, `hero-${language}.png`) });
      await jump(page, '[data-chapter-link="1"]');
      assert.equal(await page.locator('[data-i18n="shortcut.press"], [data-i18n="shortcut.canvasLabel"]').count(), 0);
      assert(await page.locator(".chapter-copy--desktop h2").evaluate(el => el.textContent.includes("\n")));
      assert(await page.locator(".chapter-copy--desktop h2").evaluate(el => Math.abs(el.clientHeight / parseFloat(getComputedStyle(el).lineHeight) - 2) < .02), "Recall title uses exactly two lines");
      assert(await page.evaluate(() => {
        const target = document.querySelector(".app-content");
        const loop = gsap.globalTimeline.getChildren(true, false, true).find(t =>
          t.repeat() === -1 && t.getChildren(true, true, false).some(tween => tween.targets().includes(target)));
        return Math.abs(loop.duration() + loop.repeatDelay() - 3) < .001;
      }), "Recall repeats every three seconds, including its pause");
      await seek(page, ".app-content", .42);
      assert(await page.locator(".app-content").evaluate(el => gsap.getProperty(el, "y") === 0), "Key press precedes hiding");
      await seek(page, ".app-content", 1.2);
      assert(await page.locator(".app-content").evaluate(el => gsap.getProperty(el, "y") > 270), "Window hides below the screen edge");
      await page.screenshot({ path: path.join(output, `hidden-${language}.png`) });
      await seek(page, ".app-content", 2.4);
      assert(await page.locator(".app-content").evaluate(el => gsap.getProperty(el, "y") === 0), "Window returns from below");
      await page.locator('[data-platform-button="macos"]').click();
      assert.equal(await page.locator(".desktop-shortcut-mark kbd").textContent(), "Option + V");
      await page.screenshot({ path: path.join(output, `macos-${language}.png`) });
      await page.locator('[data-platform-button="windows"]').click();
      await jump(page, '[data-chapter-link="2"]');
      assert(await page.locator(".app-content").evaluate(el => gsap.getProperty(el, "y") === 0), "Recall cleanup restores the shared app");
      await jump(page, '[data-feature-jump="2"]');
      for (const [phase, tab, count] of [[0, 1, 2], [1, 2, 2], [2, 3, 1], [3, 7, 3]]) {
        await seek(page, ".demo-tab-indicator", phase * 2.9 + 1.4);
        assert.equal(await page.locator(".app-actor").getAttribute("data-demo-tab"), String(tab));
        assert.equal(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.filter(c => +getComputedStyle(c).opacity > .9).length), count);
      }
      await page.screenshot({ path: path.join(output, `project-${language}.png`) });
      await jump(page, '[data-feature-jump="3"]');
      await seek(page, ".demo-search-field", 1.32);
      assert.equal(await page.locator(".demo-search-field span").textContent(), "", "Typing key lights before its character appears");
      await seek(page, ".demo-search-field", 4.3);
      assert.equal(await page.locator(".demo-search-field span").textContent(), "vPaste");
      assert.equal(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.filter(c => +getComputedStyle(c).opacity > .9).length), 3);
      await page.screenshot({ path: path.join(output, `search-${language}.png`) });
      await jump(page, '[data-feature-jump="4"]');
      await seek(page, ".demo-preview-window", .59);
      assert(await page.locator(".demo-preview-window").evaluate(el => +getComputedStyle(el).opacity === 0), "Space press precedes preview");
      await seek(page, ".demo-preview-window", 2);
      await page.screenshot({ path: path.join(output, `preview-${language}.png`) });
      await jump(page, '[data-feature-jump="5"]');
      await seek(page, ".demo-queue-row", 2.5);
      assert.equal(await page.locator("[data-queue-count]").textContent(), "4");
      for (let i = 0; i < 4; i++) {
        await seek(page, ".demo-queue-row", 3 + i * 1.35 + 1);
        assert.equal(await page.locator("[data-queue-count]").textContent(), String(3 - i));
        assert.equal(await page.locator(".demo-form-value").evaluateAll(fields => fields.filter(f => +getComputedStyle(f).opacity > .9).length), i + 1);
      }
      await page.screenshot({ path: path.join(output, `queue-${language}.png`) });
      await jump(page, '[data-feature-jump="6"]');
      await seek(page, ".demo-drag-ghost", 1.8);
      assert(await page.locator(".demo-dropzone img").evaluate(el => +getComputedStyle(el).opacity === 0), "No drop result during travel");
      await seek(page, ".demo-drag-ghost", 3);
      assert(await page.locator(".demo-dropzone img").evaluate(el => +getComputedStyle(el).opacity > .9));
      await page.screenshot({ path: path.join(output, `drag-${language}.png`) });
      await jump(page, '[data-chapter-link="5"]');
      await page.locator('[data-demo-pause]').click();
      assert.equal(await page.locator(".local-device-icon .platform-icon").count(), 2);
      assert((await page.locator('[data-i18n="privacy.feature4"]').textContent()).match(/手动|Manually/));
      await page.screenshot({ path: path.join(output, `local-${language}.png`) });
      for (const width of [320, 390, 768]) {
        await page.setViewportSize({ width, height: 844 });
        await page.waitForTimeout(200);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await page.locator(".product-overlays").count(), 0);
        assert(await page.locator(".local-reading-cards .vp-rich-card").evaluate(card => card.querySelector("table").getBoundingClientRect().bottom <= card.getBoundingClientRect().bottom));
        await page.locator(".scene-preview").scrollIntoViewIfNeeded();
        assert(await page.locator(".reading-preview-popup .demo-preview-pin").isVisible());
        await page.screenshot({ path: path.join(output, `mobile-preview-${width}-${language}.png`) });
        await page.locator(".data-visual").scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `mobile-local-${width}-${language}.png`) });
      }
      await page.close();
    }
    assert.deepEqual(errors, []);
    console.log("PASS video sync: native toolbar, emoji tabs, fitted bilingual tables, installed-app recall, ordered filters, keyboard-before-result, four-field queue, full drag, manual transfer, responsive cleanup");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
