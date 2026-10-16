# vPaste README banners — current final assets

Updated: 2026-10-09. Revision 4: real toolbar + website promotional cards. Use only the two files below as README headers.

Workspace migrated on 2026-10-16 to `E:/Coding/vPaste/vPaste-website`; see [MEDIA-HANDOFF.md](../MEDIA-HANDOFF.md). Approved image bytes are unchanged. The brand header is now saved as independent `readme-source/header-{zh,en}.png` inputs, so rebuilding does not require ignored archives.

| Language | File | Dimensions | Bytes |
| --- | --- | --- | --- |
| 中文 | [readme-banner-zh.png](readme-banner-zh.png) | 1800×600 | 504,202 |
| English | [readme-banner-en.png](readme-banner-en.png) | 1800×600 | 468,805 |

Both are opaque RGB PNGs, 3:1. The user requested keeping the real tab bar and buttons from revision 3 while restoring the website's promotional card presentation. This supersedes the earlier instruction to use native rendering for the entire window.

## Current composition

- The approved logo/name/description header is unchanged. The logo uses the original repository SVG.
- The tab bar is retained from the actual desktop renderer capture: emoji labels, type size, search, add-tab, paste queue and settings buttons stay unchanged.
- Below it, the six cards use the website's approved HTML/CSS/asset snapshot in `video-demo/src/generated/website.ts`, also used by the final promotional videos.
- Cards retain the website's 168:184 width/height ratio, uniformly scaled by 1.45. They are rendered directly in Chromium; image generation is not used to redraw them.
- Restored promotional details include the centered text card, clean image background, GitHub link preview, PDF card, color card and complete three-column formatted table.
- The table uses the previously approved video refinements: 10.5 px base font, wrapping and fixed columns, with language-specific column widths. All three columns fit in both languages.
- Window placement remains x=60, y=208, 1680×350. Its native toolbar occupies the first 56 output pixels; the promotional card area occupies the remaining 294 pixels.
- No separate slogan or website callout is added. Text and URLs inside the sample clipboard cards remain demonstration content.

This is intentionally a promotional composition combining a real toolbar and website-rendered cards, not a complete native application screenshot.

## Sources and checks

The native toolbar source remains the unmodified desktop frontend at commit `4bad66bee908a87e6735f1b24c5ea19492b44388`. Original captures are [Chinese](readme-source/native-window-zh.png) and [English](readme-source/native-window-en.png). Native tab type size is 14.5 CSS px and toolbar height is 48 CSS px before the original proportional resize.

Website card renders are [Chinese](readme-source/promo-cards-zh.png) and [English](readme-source/promo-cards-en.png). Their source hash, card geometry and table checks are saved in the corresponding `promo-metrics-*.json` files.

[Pixel verification](readme-source/verification.json) confirms zero changed pixels in the retained native toolbar, preserved brand header and composited card interiors. Both languages were visually checked for complete cards and readable table layout.

For future revisions:
- Preserve the current native toolbar and actual SVG logo.
- Render promotional cards from the website source; never stretch their width and height independently.
- Keep the table fully visible. Do not reintroduce the native selection outline, rich-text badges or image checkerboard unless requested.

## Reproduction and archives

See [production instructions](readme-source/README.md). The capture, promotional rendering and composition scripts are retained with their sources. No video, website implementation or Social preview image was modified.

Superseded versions:
- [Revision 3](archive/readme-banners-v3-2026-10-09/): full native UI, superseded at the user's request.
- [Revision 2](archive/readme-banners-v2-2026-10-09/): generated UI with inaccurate proportions.
- [Revision 1](archive/readme-banners-v1-2026-10-08/): taller layout and inaccurate generated logo.

## README examples

Chinese:

```markdown
![vPaste — 适用于 Windows 和 macOS 的剪贴板管理器](assets/readme-banner-zh.png)
```

English:

```markdown
![vPaste — Clipboard manager for Windows & macOS](assets/readme-banner-en.png)
```

These snippets have not been inserted into a README automatically.

## SHA-256

- zh: `7893bf4a6247232cec647bd9b9bf82509626fe1137c4bbe6bbc89adb26825940`
- en: `ab8a8479929aa002750c6241d6c93b7371cb98d4a44295b6ecf87988d8f1f4e4`
