// Capture the unmodified desktop renderer with public demonstration data.
// Run with the client Vite server at http://127.0.0.1:1437.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const assets = path.resolve(__dirname, '..');
const dataUrl = file => {
  const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(path.join(assets, file)).toString('base64')}`;
};
const icons = ['word.svg', 'wechat.png', 'chrome.png', 'explorer.png', 'figma.png', 'excel.svg'].map(file => dataUrl(`apps/${file}`));
const photo = dataUrl('format-stack.png');
const logo = dataUrl('vpaste-logo.png');
const imageBuffer = fs.readFileSync(path.join(assets, 'format-stack.png'));
const imageSize = { width: imageBuffer.readUInt32BE(16), height: imageBuffer.readUInt32BE(20), isGif: false };

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const language of ['zh', 'en']) {
      const page = await browser.newPage({ viewport: { width: 1448, height: 302 }, deviceScaleFactor: 2, reducedMotion: 'reduce', colorScheme: 'light' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(({ language, icons, photo, logo, imageSize }) => {
        const zh = language === 'zh';
        const description = zh ? '剪贴捷径，一键即达' : 'Your clipboard, one shortcut away';
        const table = zh
          ? '<table border="1" cellpadding="5" style="border-collapse:collapse"><tr><th>内容</th><th>类型</th></tr><tr><td><b>vPaste 文本</b></td><td>纯文本</td></tr><tr><td><a href="https://vpaste.app">vpaste.app</a></td><td>链接</td></tr><tr><td style="color:#2563EB">#2563EB</td><td>颜色</td></tr></table>'
          : '<table border="1" cellpadding="5" style="border-collapse:collapse"><tr><th>Content</th><th>Type</th></tr><tr><td><b>vPaste text</b></td><td>Plain text</td></tr><tr><td><a href="https://vpaste.app">vpaste.app</a></td><td>Link</td></tr><tr><td style="color:#2563EB">#2563EB</td><td>Color</td></tr></table>';
        const now = Date.now();
        const entries = [
          { itemType: 'Text', content: `vPaste\n${description}`, richHtml: `<h2>vPaste</h2><p>${description}</p>`, titleColor: '#0842d5', appSource: 'WINWORD.EXE' },
          { itemType: 'Image', content: photo, previewContent: photo, titleColor: '#00bd68', appSource: 'WeChat.exe' },
          { itemType: 'Link', content: `https://vpaste.app|||${logo}|||vPaste|||icon`, titleColor: '#e84032', appSource: 'chrome.exe' },
          { itemType: 'File', content: '["C:/Demo/vPaste Intro.pdf"]', titleColor: '#a57100', appSource: 'explorer.exe' },
          { itemType: 'Color', content: '#F24E1E', titleColor: '#9c3028', appSource: 'Figma.exe' },
          { itemType: 'Text', content: 'vPaste text / link / color', richHtml: table, titleColor: '#107c41', appSource: 'EXCEL.EXE' },
        ].map((entry, i) => ({ id: 6-i, hash: `readme-demo-${i}`, previewContent: '', textContent: '', richHtml: '', label: 0, tags: [], time: now-[5000,240000,7200000,21600000,36000000,86400000][i], appIconPath: icons[i], ...entry }));
        const types = ['Text', 'Image', 'Link', 'Color', 'File'];
        const names = zh ? ['📝 文本', '🖼️ 图片', '🔗 链接', '🎨 颜色', '📁 文件'] : ['📝 Text', '🖼️ Images', '🔗 Links', '🎨 Colors', '📁 Files'];
        let callback = 0;
        window.__TAURI_INTERNALS__ = {
          invoke: async (command, args = {}) => {
            if (command === 'get_config') return JSON.stringify({ multilingual: zh ? 'Chinese' : 'English', theme_mode: 'light', onboarding_completed: true, link_auto_preview: false, retain_last_position: false, retain_search_history: false });
            if (command === 'search') return JSON.stringify({ list: entries, consumed: entries.length, hasMore: false, nextId: 0, nextTime: 0 });
            if (command === 'get_custom_tabs') return types.map((type, i) => ({ id: `demo-${type}`, name: names[i], filter: { itemType: type, appSource: '', appSources: [], favorite: 'any', relativeAmount: '', relativeUnit: 'day' } }));
            if (command === 'list_item_tags') return [{ id: 1, name: zh ? '项目' : 'Project' }];
            if (['list_language_packs', 'refresh_link_previews'].includes(command)) return [];
            if (command === 'get_developer_mode') return false;
            if (command === 'get_paste_queue_state') return { active: false, revision: 0 };
            if (command === 'check_paste_accessibility_permission') return { granted: true, needs_settings: false };
            if (command === 'get_update_state') return { status: 'disabled', currentVersion: '1.6.0', downloadedBytes: 0, portable: false, feedEnabled: false, releaseUrl: '' };
            if (command === 'history_image_metadata') return imageSize;
            if (['history_image_card_preview_asset_path', 'history_file_preview_asset_path', 'history_file_data_url'].includes(command)) return args.path;
            if (command === 'file_preview_info') return { kind: 'single-icon', paths: ['C:/Demo/vPaste Intro.pdf'], exists: true, missing_paths: [], display_path: 'C:/Demo/vPaste Intro.pdf', secondary_text: '', extension: 'pdf', preview_path: '' };
            if (command === 'plugin:event|listen') return ++callback;
            if (command === 'plugin:window|scale_factor') return 1;
            if (command === 'plugin:window|inner_size') return { width: 1448, height: 302 };
            return null;
          },
          transformCallback: () => ++callback, unregisterCallback: () => {}, convertFileSrc: value => value,
          metadata: { currentWindow: { label: 'clipboard' }, currentWebview: { label: 'clipboard' } },
        };
        window.__TAURI_EVENT_PLUGIN_INTERNALS__ = { unregisterListener: () => {} };
        localStorage.setItem('vpaste.themeMode', 'light');
      }, { language, icons, photo, logo, imageSize });
      await page.goto('http://127.0.0.1:1437/clipboard', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.querySelectorAll('[class*="clipboard-card"][draggable]').length === 6);
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
      await page.waitForTimeout(400);
      const metrics = await page.evaluate(() => {
        const measure = el => { const r=el.getBoundingClientRect(); const css=getComputedStyle(el); return {x:r.x,y:r.y,width:r.width,height:r.height,fontSize:css.fontSize}; };
        return {
          cards: [...document.querySelectorAll('[class*="clipboard-card"][draggable]')].map(measure),
          tabs: [...document.querySelectorAll('button[class*="tab-item"]')].map(el => ({label:el.textContent,...measure(el)})),
          buttons: [...document.querySelectorAll('button[aria-label]')].map(el => ({label:el.getAttribute('aria-label'),...measure(el)})),
          images: [...document.images].map(img => ({width:img.naturalWidth,height:img.naturalHeight,complete:img.complete})),
        };
      });
      assert.equal(metrics.cards.length, 6);
      for (const card of metrics.cards) { assert.equal(card.width, 220); assert.equal(card.height, 230); assert.ok(card.x >= 0 && card.x + card.width <= 1448); assert.ok(card.y >= 0 && card.y + card.height <= 302); }
      assert.deepEqual(errors, []);
      await page.screenshot({ path: path.join(__dirname, `native-window-${language}.png`), animations: 'disabled', caret: 'hide' });
      fs.writeFileSync(path.join(__dirname, `native-metrics-${language}.json`), JSON.stringify(metrics, null, 2));
      console.log(JSON.stringify({language,cards:metrics.cards,tabs:metrics.tabs,buttons:metrics.buttons}));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
