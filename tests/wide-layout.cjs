const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const base = process.env.SITE_URL || "http://127.0.0.1:8765";

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 3840, height: 1740 }, locale: "en-US", reducedMotion: "no-preference" });
    await page.goto(base + "/#use-cases", { waitUntil: "networkidle" });
    await page.locator('[data-feature-jump="1"]').click();
    await page.waitForFunction(() => {
      const story = document.querySelector(".continuous-story");
      return story.dataset.step === "3" && story.dataset.transitioning === "false";
    });

    const leaked = await page.evaluate(() => {
      const worldRight = document.querySelector(".story-world").getBoundingClientRect().right;
      // Inert disables hit testing but does not hide painted content. Enable hit
      // testing briefly so a leaked heading can be detected without pixel timing.
      document.querySelectorAll('.chapter-copy[aria-hidden="true"]').forEach(panel => {
        panel.inert = false;
        panel.style.pointerEvents = "none";
        [...panel.children].forEach(child => { child.style.pointerEvents = "auto"; });
      });
      for (let x = Math.ceil(worldRight + 20); x < innerWidth - 10; x += 20) {
        for (let y = 110; y < innerHeight - 100; y += 20) {
          const panel = document.elementFromPoint(x, y)?.closest('.chapter-copy[aria-hidden="true"]');
          if (panel) return { x, y, panel: panel.className };
        }
      }
      return null;
    });
    assert.equal(leaked, null, `An inactive chapter is exposed in the wide-screen gutter: ${JSON.stringify(leaked)}`);
    console.log("PASS inactive chapters stay outside the visible wide-screen canvas");
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
