# Background studies A–G

Open `background-studies.html` for the comparison desk, or `/?backdrop=a` through `/?backdrop=g` for full interactive versions. The picker keeps the existing app nodes, copy, scene index, and product demo running while replacing only the background and presentation chrome. The unparameterized site retains the previously approved appearance. These are previews, not a newly selected production direction.

## Independent branches

| Study | Family | Background motion | Navigation |
| --- | --- | --- | --- |
| A | Eccentric orbits | Offset elliptical rings, registration ticks and a satellite arc rotate at different speeds | Existing header and wayfinder |
| B | Paper in motion | Broad folded planes translate at different depths and angles | Existing header and wayfinder |
| C | The glyph gallery | Existing lines plus oversized chapter symbols moving horizontally along the bottom | Existing header and wayfinder |
| D | Memory raster | Existing lines plus sparse dot/block fields and a scanning window | Existing header and wayfinder |
| E | Cobalt cutouts | Cropped paperclip, cut edges and moving corner tabs | Asymmetric cobalt masthead and full-width bottom rail |
| F | The paper archive | Warm folder folds, margin rules and a large blind-stamped VP | Bare editorial utilities, vertical left chapter index, archival closing colophon |
| G | Nocturne instrument | Low-light dial, seeded tick lengths, registration crosses and rotating pointer | Floating centered console and independent bottom dock |

The central app geometry, real screenshots, marketing content and 17 content stops are shared. E–G adapt surrounding text/surface colors for their palettes, but the client window and its overlays retain their light appearance. All letters are unrelated to the older A/B product-layout concept URLs.

## Seeds and decisions

Seven independent 128-digit seeds were sampled with Node's `crypto.randomInt(10)` and frozen in `background-studies.js`. Each is split into 32 four-digit decisions. Decision 0 selects a structural family without replacement from the requested scope's pool: `[orbits, folds]`, `[glyphs, raster]`, `[archive, nocturne, cutout]`. This guarantees different structures rather than hoping independent random draws will diverge.

All 32 groups are mixed into every subsequent decision using a deterministic integer hash, so sparse designs still use the whole seed. These decisions control relevant geometry (ring spacing, folded edge position, glyph offset/size/angle, raster occupancy and density, margin-rule length, dial tick length) and movement (rotation range, translation extent and scan travel). The explicit art-direction palettes and contrast constraints are curated, not random RGB values. Digits are never resampled on reload; a chosen design is reproducible. The overview exposes each full seed.

| Study | Seed |
| --- | --- |
| A | `50329323848079968747828528331752768454128631455707263440304231126611785939065556912753394251793025588391824732020249258692005203` |
| B | `90438657522341452750958227909728989997469600695544314610080942823928255816878356005240430687410245500319807665119253446111812615` |
| C | `72522374415698564986764039109175775362558060185520166889326183585323754639733375696758390039863613407718927478202773874106329198` |
| D | `30811100386447916601761755548457597553080260420906175332140564132723046683961288075533121363663458708584031162354135552058558794` |
| E | `57323610584315591906948100917009595076779516704422170363822708320507423448063704786486056760914983173072596758498200605684672167` |
| F | `62105577252695614113179277864572213425075066425611374181864958982385529889625665167521317843027897011019649402050169695944821582` |
| G | `92431739334145462150736893723803507161981286456100103276261236637084851504238989858648234426589139612366852993530368195258463767` |

## Runtime constraints

- Local SVG/DOM only; no generated bitmap downloads, new libraries, remote fonts, WebGL, particle ticker, or endless background loops
- Only the selected study's SVG is mounted on the product page
- Background tweens use transforms and the same finite 1.35/0.85-second scene durations as the subject, including direct chapter jumps
- Reduced-motion readers get static artwork; compact/read-mode pages retain a normal document and static backdrop
- Decorative elements are `aria-hidden` and never intercept text selection or clicks
- The picker supports keyboard activation and Escape, and isolates its wheel/keyboard gestures from content navigation
- The overview uses lightweight illustrative thumbnails, not seven iframe copies of the app

## Verification

`node tests/background-studies.cjs` checks all seven themes, unique families, seed lengths, in-place switching, stable app/card/copy identity, scene-linked motion, controls, the final footer, small/reduced-motion layouts, overview links and console/HTTP errors. Screenshots are saved under `visual-experiments/background-studies/` for visual inspection. Existing product smoke and scene tests remain applicable without a `backdrop` parameter.
