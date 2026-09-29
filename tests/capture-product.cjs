// Capture the real public client renderer with synthetic, public-safe data.
// Start vPaste-clean-public's Vite server and set PRODUCT_URL if not on port 1426.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const fs = require("node:fs");
const path = require("node:path");
const base = process.env.PRODUCT_URL || "http://127.0.0.1:1426";
const output = path.resolve(__dirname, "../assets/product");

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const language of ["zh", "en"]) {
      const settings = await browser.newPage({ viewport: { width: 820, height: 720 }, deviceScaleFactor: 1.5, reducedMotion: "reduce" });
      await settings.goto(`${base}/__settings-preview?theme=light&lang=${language === "zh" ? "zh-CN" : "en-US"}`, { waitUntil: "networkidle" });
      await settings.getByTestId("settings-root").waitFor();
      await settings.screenshot({ path: path.join(output, `settings-${language}.png`), animations: "disabled" });
      await settings.getByRole("combobox").nth(1).click();
      await settings.getByRole("listbox").waitFor();
      await settings.screenshot({ path: path.join(output, `settings-theme-${language}.png`), animations: "disabled" });
      await settings.close();

      const page = await browser.newPage({ viewport: { width: 1040, height: 352 }, deviceScaleFactor: 1.5, reducedMotion: "reduce", colorScheme: "light" });
      const icons = Object.fromEntries(["word", "chrome", "excel"].map((app) => {
        const extension = app === "chrome" ? "png" : "svg";
        const data = fs.readFileSync(path.resolve(__dirname, `../assets/apps/${app}.${extension}`)).toString("base64");
        return [app, `data:image/${extension === "svg" ? "svg+xml" : "png"};base64,${data}`];
      }));
      await page.addInitScript(({ language, icons }) => {
        let callback = 0;
        const description = language === "zh" ? "剪贴捷径，一键即达" : "Your clipboard, one shortcut away";
        const data = [
          { itemType: "Text", content: `vPaste\n${description}`, richHtml: `<h2>vPaste</h2><p>${description}</p>`, appSource: "WINWORD.EXE", appIconPath: icons.word, titleColor: "#0842d5" },
          { itemType: "Link", content: "https://vpaste.app", textContent: "vPaste", appSource: "chrome.exe", appIconPath: icons.chrome, titleColor: "#e84032" },
          { itemType: "Text", content: "vPaste\nWindows + macOS\nGPL-3.0", richHtml: "<table><tr><th>vPaste</th><th>Platform</th></tr><tr><td>Desktop</td><td>Windows / macOS</td></tr><tr><td>License</td><td>GPL-3.0</td></tr></table>", appSource: "EXCEL.EXE", appIconPath: icons.excel, titleColor: "#107c41" },
        ].map((item, index) => ({ id: 3 - index, hash: `website-example-${index}`, previewContent: "", textContent: "", richHtml: "", label: 0, tags: [], time: Date.now() - (index + 1) * 60000, ...item }));
        Object.assign(window, { __TAURI_INTERNALS__: {
          invoke: async (command) => {
            if (command === "search") return JSON.stringify({ list: data, consumed: data.length, hasMore: false, nextId: 0, nextTime: 0 });
            if (command === "get_config") return JSON.stringify({ multilingual: language === "zh" ? "Chinese" : "English", theme_mode: "light", onboarding_completed: true, link_auto_preview: false });
            if (["list_language_packs", "list_item_tags", "get_custom_tabs", "refresh_link_previews"].includes(command)) return [];
            if (command === "get_developer_mode") return false;
            if (command === "get_paste_queue_state") return { active: false, revision: 0 };
            if (command === "check_paste_accessibility_permission") return { granted: true, needs_settings: false };
            if (command === "get_update_state") return { status: "disabled", currentVersion: "1.6.0", downloadedBytes: 0, portable: false, feedEnabled: false, releaseUrl: "" };
            if (command === "plugin:event|listen") return ++callback;
            return null;
          },
          transformCallback: () => ++callback, unregisterCallback: () => {}, convertFileSrc: (value) => value,
          metadata: { currentWindow: { label: "clipboard" }, currentWebview: { label: "clipboard" } },
        } });
      }, { language, icons });
      await page.goto(`${base}/clipboard`, { waitUntil: "networkidle" });
      const searchName = language === "zh" ? "搜索" : "Search";
      await page.getByRole("button", { name: searchName, exact: true }).click();
      await page.getByRole("textbox", { name: searchName }).fill("vPaste");
      await page.waitForFunction(() => document.querySelectorAll('[class*="clipboard-card"]').length >= 3);
      await page.getByText(language === "zh" ? "加载中" : "Loading", { exact: true }).waitFor({ state: "hidden" });
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(output, `search-${language}.png`), animations: "disabled", caret: "hide" });
      await page.close();
      console.log(`Captured official ${language} search and settings UI`);
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
