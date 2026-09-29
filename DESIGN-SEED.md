# vPaste — selected A / complete scene transitions

The user selected A (mist-blue). Both old comparison URLs now resolve to the same design and the A/B control is removed. The original long seed is retained here as design provenance, not runtime variation:

`2040DFE7815D6C4E526CBFF96D3D8E4858566C600929E904DEF7F735C73D6EDA24D9820C58B7E43826EC8786D130C3E6`

## A persistent subject, complete transitions

One original app window and six original cards remain on a fixed desktop canvas. The desktop expands behind it, matching the app's full width and bottom edge. The same cards are filtered, searched, previewed, queued, dragged, extracted and returned. The official settings page expands from the top-right gear, above the original app. The subject never cross-fades away.

The GSAP timeline is paused at 17 complete states across seven chapters:

- Whole app
- Desktop shortcut
- Seven use cases using the original main window, with independent preview and receiving-app windows where appropriate
- Five formats, in original card order: text, image, link, file, color
- Settings and four concise feature summaries
- Local history and manual cross-platform archive migration
- Open source, download and one integrated footer

Wheel movement now expresses intent instead of directly scrubbing the timeline. A 55-pixel accumulated threshold triggers a complete 1.35-second chapter transition or 0.85-second within-chapter transition. The scene timeline uses sine easing; the playhead moves linearly so the two curves do not compound into a sudden burst of movement. Line/page deltas are normalized. A 180-millisecond quiet gap distinguishes gestures; momentum from one gesture cannot skip several examples. Reversing direction after a transition starts a new gesture. Trackpad zoom remains available.

Distant chapter links interpolate the visible objects directly between their current and destination poses instead of fast-forwarding all intermediate scenes. Active text regions accept mouse selection while inactive panels remain inert.

Arrow/Page keys, Space, Home/End, previous/next controls and direct chapter/use-case/format links reach the same settled states. On the preview example, Space replays the image/webpage preview. A running transition completes before another gesture or link can begin, including repeated clicks on the destination. No ScrollTrigger or extra native-scroll footer is used. Active demonstrations have a pause control, stop off-scene, pause in a hidden tab and are removed in reduced-motion mode.

## Visual and content changes

- Decorative chapter and feature ordinals are replaced by locally bundled Lucide icons
- Queue positions and meaningful product counts remain
- Search expands the original toolbar's field and filters its existing cards into three matching records; there is no second search chapter or nested app screenshot
- The real settings image and its four-category descriptions share one scene
- The public-facing sample-data caption is removed; screenshot provenance remains in `assets/product/README.md`
- Two compact AI-generated WebP wallpapers total approximately 61 KiB and load only when their desktop platform is requested; prompts and provenance are in `assets/artwork/README.md`
- The local-data scene uses a DOM/SVG loop: records land on disk, then a manually exported archive moves between Windows and macOS; no cloud sync is implied
- Settings descriptions are condensed to one line per category; the shortcut paragraph is also shorter
- The repeated feature index is removed
- Open-source facts, download actions and the footer conclude the same canvas
- Primary app artwork remains the supplied PNG; header/footer share the brand master
- Card dimensions remain 168 × 184
- Marketing claims and English/Chinese content remain otherwise intact

Lucide SVG paths are vendored from version 0.468.0. Attribution is in `assets/lucide-LICENSE.txt`.

## Responsive and accessible fallback

Below 980 × 620 CSS pixels, with reduced motion, with the legacy `?view=read` URL, or if GSAP cannot load, the complete linear document is available. No content depends on motion. The visible reading-mode button was removed at the user's request. GSAP 3.15.0 is bundled locally to avoid an external CDN request at startup.

Resizing or enabling reduced motion reverts transforms, removes inert state, restores the feature gallery to its semantic chapter and removes gesture handlers. Browser zoom can therefore reach the same readable layout.

## Verification

Serve locally at port 8765. Set `PLAYWRIGHT_MODULE` if Playwright is outside the default module path:

```
node tests/website-smoke.cjs
node tests/scene-motion.cjs
node tests/product-demos.cjs
```

The older motion/palette/preview entry points delegate to the selected-A runner.

Coverage includes both languages, old A/B URL compatibility, 375 / 768 / 1440 widths, 1280 × 720 motion, missing animation library, legacy reading mode, reduced-motion teardown/re-entry, threshold and momentum handling, bounded transitions, mouse text selection, deferred artwork requests, reverse navigation, all seven examples, all five formats, persistent object identity, desktop full-width/bottom-edge alignment, original-toolbar search and type filtering, gear-origin settings, Space previews, queue delivery, cross-window dragging, local migration, pause/resume, off-scene loop cleanup and a single final footer. Local lab rendering measurements are diagnostic, not a claim about real-world network performance.

Screenshots: `visual-experiments/selected-a/`

