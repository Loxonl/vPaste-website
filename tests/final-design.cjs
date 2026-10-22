const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.SITE_URL || "http://127.0.0.1:8765";

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, locale: "zh-CN" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => { if (response.status() >= 400) errors.push(response.status() + " " + response.url()); });
    for (const query of ["", "?palette=1", "?palette=2", "?palette=3", "?backdrop=c", "?backdrop=e", "?backdrop=g&palette=2"]) {
      await page.goto(base + "/" + query, { waitUntil: "networkidle" });
      assert.equal(await page.locator("html").getAttribute("data-palette"), "1");
      assert.equal(await page.locator("html").getAttribute("data-backdrop"), "ce");
      assert.equal(await page.locator(".study-picker, .palette-picker").count(), 0, "Final website has no experiment selector");
      assert.equal(await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(250, 252, 255)");
      assert.equal(await page.locator(".story-wayfinder").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(7, 91, 232)");
      assert.equal(await page.locator(".app-content .vp-clip-card").count(), 6);
      assert.equal(await page.locator(".bg-glyph").count(), 7);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator("footer").count(), 0);
      assert.equal(await page.evaluate(() => performance.getEntriesByType("resource").some(r => r.name.includes("brand-palettes.js"))), false);
    }
    assert.deepEqual(await page.locator(".site-nav > .brand").evaluate(el => {
      const style = getComputedStyle(el);
      return [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius];
    }), ["0px", "0px", "18px", "0px"], "The corner-attached brand keeps its original shape");
    assert(await page.locator(".button, .language-switch, .language-switch a, .feature-select button, .format-select button, .platform-switch, .platform-switch button, .story-wayfinder a, .story-wayfinder button").evaluateAll(nodes =>
      nodes.every(el => getComputedStyle(el).borderTopLeftRadius === "999px")), "Website controls use the approved pill and circular corners");
    assert.equal(await page.locator(".story-wayfinder").evaluate(el => getComputedStyle(el).borderRadius), "24px");
    assert.equal(await page.locator(".story-product .vp-app-window").evaluate(el => getComputedStyle(el).borderRadius), "13px", "Native product window corners stay unchanged");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => !document.querySelector(".story-motion"));
    assert.equal(await page.locator(".chapter-copy").count(), 7);
    assert.equal(await page.locator("body").evaluate(el => getComputedStyle(el).backgroundColor), "rgb(250, 252, 255)");
    assert.deepEqual(errors, []);
    const staticPage = await browser.newPage({ javaScriptEnabled: false });
    await staticPage.goto(base);
    assert.equal(await staticPage.locator("html").evaluate(el => getComputedStyle(el).getPropertyValue("--paper").trim()), "#fafcff", "Final color tokens are available before JavaScript");
    console.log("PASS final Electric white design, frozen legacy links, no experiment controls, static colors and reduced motion");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
