const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";
const step = page => page.locator(".continuous-story").getAttribute("data-step").then(Number);
const settle = async page => {
  await page.waitForTimeout(80);
  await page.waitForFunction(() => document.querySelector(".continuous-story").dataset.transitioning === "false");
};

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  const errors = [];
  const failures = [];
  const check = async (name, run, options = {}) => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, ...options });
    page.on("pageerror", error => errors.push(error.message));
    try {
      await page.goto(base + "/zh/", { waitUntil: "networkidle" });
      await run(page);
      console.log("PASS " + name);
    } catch (error) {
      failures.push(name + ": " + error.message);
      console.error("FAIL " + failures.at(-1));
    } finally {
      await page.close();
    }
  };
  try {
    await check("Slow, small mouse notches accumulate", async page => {
      for (let i = 0; i < 4; i++) {
        await page.mouse.wheel(0, 30);
        await page.waitForTimeout(320);
      }
      await settle(page);
      assert.equal(await step(page), 1);
    });
    await check("Line-mode wheel notches accumulate", async page => {
      await page.evaluate(async () => {
        for (let i = 0; i < 4; i++) {
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 3, deltaMode: 1, cancelable: true }));
          await new Promise(resolve => setTimeout(resolve, 320));
        }
      });
      await settle(page);
      assert.equal(await step(page), 1);
    });
    for (const deltas of [[100], [30], [80, 100, 120]]) {
      await check(`Continuous ${deltas.join("/")}px mouse notches can advance after a complete transition`, async page => {
        for (let i = 0; i < 45; i++) {
          await page.mouse.wheel(0, deltas[i % deltas.length]);
          await page.waitForTimeout(70);
        }
        await settle(page);
        assert(await step(page) >= 2, "Continued mouse input must not stay locked to the first scene");
      });
    }
    await check("One long fine-grained trackpad gesture advances once", async page => {
      await page.evaluate(async () => {
        for (let i = 0; i < 55; i++) {
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 15, cancelable: true }));
          await new Promise(resolve => setTimeout(resolve, 40));
        }
      });
      await settle(page);
      assert.equal(await step(page), 1);
      await page.waitForTimeout(250);
      await page.mouse.wheel(0, 100);
      await settle(page);
      assert.equal(await step(page), 2, "A new gesture still works after momentum ends");
    });
    await check("High-frequency trackpad input does not become repeated mouse notches", async page => {
      await page.evaluate(async () => {
        for (let i = 0; i < 130; i++) {
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, cancelable: true }));
          await new Promise(resolve => setTimeout(resolve, 16));
        }
      });
      await settle(page);
      assert.equal(await step(page), 1);
    });
    await check("A large, decaying momentum tail cannot skip scenes", async page => {
      await page.evaluate(async () => {
        for (let i = 0; i < 75; i++) {
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 120 * Math.exp(-i / 12), cancelable: true }));
          await new Promise(resolve => setTimeout(resolve, 40));
        }
      });
      await settle(page);
      assert.equal(await step(page), 1);
      await page.mouse.wheel(0, -100);
      await settle(page);
      assert.equal(await step(page), 0, "Reversing direction is a fresh intent");
    });
    await check("An isolated small movement, zoom and horizontal input do not navigate", async page => {
      await page.mouse.wheel(0, 25);
      await page.mouse.wheel(120, 20);
      await page.evaluate(() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, ctrlKey: true, cancelable: true })));
      await page.waitForTimeout(350);
      assert.equal(await step(page), 0);
      await page.waitForTimeout(1000);
      await page.mouse.wheel(0, 30);
      await page.waitForTimeout(350);
      assert.equal(await step(page), 0, "Stale partial input must expire");
    });
    await check("Slow detail scrolling still advances one complete item", async page => {
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(300);
      assert.equal(await page.locator(".continuous-story").getAttribute("data-transitioning"), "true");
      await settle(page);
      assert.equal(await step(page), 3);
      assert.equal(await page.locator('[data-feature-jump="1"]').getAttribute("aria-pressed"), "true");
    });
    await check("Fast mouse notches retarget an in-flight feature transition", async page => {
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.evaluate(() => { window.originalApp = document.querySelector(".app-actor"); });
      for (let i = 0; i < 8; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(45);
      }
      await settle(page);
      const target = await step(page);
      assert(target >= 6 && target <= 8, "A fast burst can skip several features instead of waiting through each animation");
      assert.equal(await page.locator(`[data-feature-jump="${target - 2}"]`).getAttribute("aria-pressed"), "true");
      assert(await page.evaluate(() => document.querySelector(".app-actor") === window.originalApp), "Fast scrolling retains the original product window");
    });
    await check("Continued mouse scrolling can accelerate after entering the feature group", async page => {
      await page.locator('[data-chapter-link="1"]').click();
      await settle(page);
      for (let i = 0; i < 28; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(70);
      }
      await settle(page);
      assert(await step(page) >= 4 && await step(page) <= 8, "No artificial pause is required before accelerating inside the group");
    });
    await check("A large detail gesture skips items and stays inside the feature group", async page => {
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.mouse.wheel(0, 640);
      await settle(page);
      assert.equal(await step(page), 6, "One fast gesture can move from feature one to feature five");
      await page.evaluate(async () => {
        for (let i = 0; i < 40; i++) {
          window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100, cancelable: true }));
          await new Promise(resolve => setTimeout(resolve, 16));
        }
      });
      await settle(page);
      assert.equal(await step(page), 8, "Momentum stops at the last feature");
      await page.waitForTimeout(250);
      await page.mouse.wheel(0, 100);
      await settle(page);
      assert.equal(await step(page), 9, "A fresh gesture can continue into the next chapter");
    });
    await check("Fast format scrolling settles on one complete card without leaving the group", async page => {
      await page.locator('[data-chapter-link="3"]').click();
      await settle(page);
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(600);
      assert.equal(await page.locator(".continuous-story").getAttribute("data-transitioning"), "false", "Fast skipping finishes sooner than a normal detail transition");
      assert.equal(await step(page), 13);
      assert.equal(await page.locator('[data-format-jump="4"]').getAttribute("aria-pressed"), "true");
      assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.every((card, i) =>
        Math.abs(gsap.getProperty(card, "scaleX") - (i === 4 ? 1.3 : 1)) < .01)), "Only the selected format card remains extracted");
      await page.waitForTimeout(250);
      await page.mouse.wheel(0, -640);
      await settle(page);
      assert.equal(await step(page), 9, "Fast reverse scrolling also settles inside the format group");
      assert(await page.locator(".app-content .vp-clip-card").evaluateAll(cards => cards.every((card, i) =>
        Math.abs(gsap.getProperty(card, "scaleX") - (i === 0 ? 1.3 : 1)) < .01)), "Reversing restores the other cards to their slots");
    });
    await check("Reversing a fast gesture redirects the current animation", async page => {
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(80);
      await page.mouse.wheel(0, -320);
      await settle(page);
      assert.equal(await step(page), 2, "Reverse input returns toward the visible item, not the old future target");
      await page.keyboard.press("ArrowDown");
      await settle(page);
      assert.equal(await step(page), 3, "Keyboard controls remain single-step after fast scrolling");
    });
    await check("Small reverse deltas use the visible item rather than the future target", async page => {
      await page.locator('[data-chapter-link="2"]').click();
      await settle(page);
      await page.mouse.wheel(0, 800);
      await page.waitForTimeout(50);
      await page.mouse.wheel(0, -30);
      await page.waitForTimeout(20);
      await page.mouse.wheel(0, -30);
      await settle(page);
      assert(await step(page) < 5, "Accumulating a small reverse gesture must not continue toward the old sixth or seventh feature");
    });
    await check("Page-mode input, keyboard navigation and responsive cleanup still work", async page => {
      await page.evaluate(() => window.dispatchEvent(new WheelEvent("wheel", { deltaY: 1, deltaMode: 2, cancelable: true })));
      await settle(page);
      assert.equal(await step(page), 1);
      await page.keyboard.press("Home");
      await settle(page);
      assert.equal(await step(page), 0);
      await page.setViewportSize({ width: 768, height: 980 });
      await page.waitForFunction(() => !document.documentElement.classList.contains("story-paged"));
      await page.mouse.wheel(0, 500);
      await page.waitForFunction(() => scrollY > 0);
      await page.setViewportSize({ width: 1440, height: 980 });
      await page.waitForFunction(() => document.documentElement.classList.contains("story-paged"));
      assert.equal(await step(page), 0);
      await page.mouse.wheel(0, 100);
      await settle(page);
      assert.equal(await step(page), 1);
    });
    await check("Reduced-motion visitors retain native scrolling", async page => {
      assert.equal(await page.locator("html.story-paged").count(), 0);
      await page.mouse.wheel(0, 500);
      await page.waitForFunction(() => scrollY > 0);
    }, { reducedMotion: "reduce" });
    assert.deepEqual(errors, [], "No browser runtime errors");
    assert.deepEqual(failures, [], "Wheel navigation regressions");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
