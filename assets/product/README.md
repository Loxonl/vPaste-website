# Official vPaste UI captures

Source: the unmodified frontend in `vPaste-clean-public`, version 1.6.0, commit `54e954c` (September 24, 2026).

- `search-{zh,en}.png`: official `/clipboard` renderer with its search field expanded and `vPaste` entered. A test bridge returns three synthetic records: a slogan, the public website URL, and a small platform/license table. The renderer produces the search highlight and card layout.
- `settings-theme-{zh,en}.png`: official `/__settings-preview` development route, General section, light appearance, theme menu expanded. The page uses the client's real settings components and public preview data.
- `settings-{zh,en}.png`: the same settings view before opening the menu, retained as capture source material.

These are renderer captures, not screenshots of a native desktop session. No real clipboard database, user history, credentials, or personal paths were loaded. Website ornament and framing are outside the captured image; UI pixels have not been retouched.

To reproduce, start the public client Vite server at `http://127.0.0.1:1426` and run `node tests/capture-product.cjs` from the website directory. Set `PRODUCT_URL` for another client preview URL and `PLAYWRIGHT_MODULE` for a nonstandard Playwright installation. The script requires the Chromium `msedge` channel.
