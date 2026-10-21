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
