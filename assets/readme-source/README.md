# README banner production sources

These files are source captures and verification material. Publish only `../readme-banner-zh.png` and `../readme-banner-en.png`. Current revision 4 combines the real toolbar with the website's promotional cards, as requested by the user.

The client source is `E:/Coding/vPaste/vPaste-clean-public`, commit `4bad66bee908a87e6735f1b24c5ea19492b44388`. No frontend source or styles are modified for capture. All clipboard data comes from the in-memory demonstration fixture in `capture-native.cjs`.

1. Start the desktop client's Vite server on `127.0.0.1:1437`, using `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 1437 --strictPort` from the client repository.
2. Run `node assets/readme-source/capture-native.cjs` from the website repository. Set `PLAYWRIGHT_MODULE` to the installed Playwright module directory if it is not resolvable normally. This uses the installed Edge browser. It saves both native PNGs and DOM measurements, asserting all six cards retain the actual 220×230 dimensions and are fully visible.
3. Run `node assets/readme-source/render-promo-cards.cjs`. This renders the six website cards from the approved snapshot in `video-demo/src/generated/website.ts`, including the final video's table formatting. It uses the same `PLAYWRIGHT_MODULE` override as step 2. The row is rendered at device scale 2 and all cards are uniformly scaled from 168×184 to 243.6×266.8 CSS px; the three-column table must fit.
4. Run `node assets/readme-source/build-banners.cjs`. Set `SHARP_MODULE` to the installed Sharp module directory if necessary. This preserves the approved `header-{zh,en}.png` source, keeps the native toolbar's first 56 output pixels, and replaces the lower 294 pixels with the promotional card render. Pixel checks compare each section with its appropriate source. Archived banner versions are not required for rebuilding.
5. Inspect both complete banners and README-sized previews. Keep the toolbar genuine and the cards in the website's promotional style. There is no image-generated reconstruction of either UI section.

The native captures already exist; steps 1–2 are needed only when refreshing the toolbar. Rendering the promotional cards and assembling the banners require no running client server.

The captures are 1448×302 CSS pixels at device scale 2. Native window height 302 is from `CLIPBOARD_WINDOW_HEIGHT` in the client. Width fits six 220 px cards, five 16 px gaps and two 24 px side paddings exactly. No zoom, CSS override, DOM replacement or image generation is used to alter the application UI.

The raw native captures contain synthetic public examples, a two-column table and a link to the public product site. Those native cards are no longer used in the final banner; the website row restores the promotional GitHub card and three-column table. Capture loads no personal clipboard records or native database.

Source SHA-256 values at capture:

| Client source file | SHA-256 |
| --- | --- |
| `src/clipboard/Clipboard.module.css` | `2a4773cfe3d6d21a68d7f90dcf6ae5a357b1bc4e9ba164f1dda56cf940c49a40` |
| `src/clipboard/ClipboardHeader.tsx` | `1ee918ef710f8b2b084d4367bc30c61913ebae694815154492e801473c805ff4` |
| `src/clipboard/ClipboardCard.tsx` | `47941c6e0e4948cbae30d0a90787027dfed8914ad0fb2c1bc8323dc726994791` |
| `src/clipboard/ClipboardCardPreview.tsx` | `0f15b7e1e9716735abf9cbbb91cc1847f3a4d2c2c9dea3b843547749101f2630` |
| `src/ui/tokens.css` | `1b10982a9c51c764b844a26ef7488f571c80cc2f547af988dbfbacc6ea8f2684` |
