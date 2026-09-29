/* Seven seeded, local-only studies. Product markup and product timelines are shared. */
(() => {
  "use strict";
  const seeds = [
    "50329323848079968747828528331752768454128631455707263440304231126611785939065556912753394251793025588391824732020249258692005203",
    "90438657522341452750958227909728989997469600695544314610080942823928255816878356005240430687410245500319807665119253446111812615",
    "72522374415698564986764039109175775362558060185520166889326183585323754639733375696758390039863613407718927478202773874106329198",
    "30811100386447916601761755548457597553080260420906175332140564132723046683961288075533121363663458708584031162354135552058558794",
    "57323610584315591906948100917009595076779516704422170363822708320507423448063704786486056760914983173072596758498200605684672167",
    "62105577252695614113179277864572213425075066425611374181864958982385529889625665167521317843027897011019649402050169695944821582",
    "92431739334145462150736893723803507161981286456100103276261236637084851504238989858648234426589139612366852993530368195258463767",
  ];
  const families = {
    orbits: { zh: "偏心回环", en: "Eccentric orbits", note: "圆弧取代直线，刻度与偏心环随章节缓慢转位", enNote: "Offset arcs and small registration marks turn with each scene", color: "#6c90a4" },
    folds: { zh: "纸页折影", en: "Paper in motion", note: "大面积纸页与折角错位滑动，不使用轨道与粒子", enNote: "Broad paper planes and folded corners slide at different depths", color: "#889fa7" },
    glyphs: { zh: "图标长廊", en: "The glyph gallery", note: "保留线条，章节图标放大成背景，在底部横向接力", enNote: "Keep the lines; oversized chapter symbols travel below the content", color: "#6993a0" },
    raster: { zh: "点阵记忆", en: "Memory raster", note: "保留线条，用稀疏点阵、矩形像素与扫描窗构成另一层", enNote: "Keep the lines; sparse pixels and a scan window add a second layer", color: "#75978c" },
    cutout: { zh: "钴蓝剪贴台", en: "Cobalt cutouts", note: "纸夹、裁切边与钴蓝色块，配合不对称页眉和整条工具栏", enNote: "Cut edges and a cobalt paperclip, with an asymmetric masthead and full-width tool rail", color: "#3d56a7" },
    archive: { zh: "暖纸档案", en: "The paper archive", note: "暖纸、档案折页与字母压印，章节导航收进左侧页边", enNote: "Warm stock, folder folds and a large blind stamp, with navigation in the margin", color: "#925a49" },
    nocturne: { zh: "深海仪表", en: "Nocturne instrument", note: "深色底、低亮度刻度盘，顶部悬浮控制台与底部独立导航坞", enNote: "A dark precision dial, floating top console and separate navigation dock", color: "#83b7b0" },
  };
  const pools = [["orbits", "folds"], ["glyphs", "raster"], ["archive", "nocturne", "cutout"]];
  const catalog = seeds.map((seed, i) => {
    const pool = pools[i < 2 ? 0 : i < 4 ? 1 : 2];
    const kind = pool.splice(Number(seed.slice(0, 4)) % pool.length, 1)[0];
    const chunks = seed.match(/\d{4}/g).map(Number);
    // Mix the complete seed into each decision, so even a sparse composition uses all 128 digits.
    const rolls = chunks.map((_, slot) => (chunks.reduce((hash, value) => Math.imul(hash ^ value, 16777619), 2166136261 ^ slot) >>> 0) / 4294967296);
    return { id: String.fromCharCode(97 + i), seed, kind, group: i < 2 ? 0 : i < 4 ? 1 : 2, ...families[kind], r: (n, low = 0, high = 1) => low + rolls[n % rolls.length] * (high - low) };
  });
  const icons = ["monitor", "keyboard", "history", "files", "settings-2", "hard-drive", "code-xml"];
  const move = (name, content) => `<g data-bg-motion="${name}">${content}</g>`;
  const glyph = (name, x, y, size) => `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round">${window.vpasteIcon.paths[name]}</svg>`;
  const cross = (x, y, size = 5) => `<path d="M${x - size} ${y}h${2 * size}M${x} ${y - size}v${2 * size}"/>`;

  function artwork(c) {
    const { r, kind } = c;
    let art = "";
    if (kind === "orbits") {
      const rings = Array.from({ length: 5 }, (_, i) => `<ellipse cx="1140" cy="510" rx="${315 + i * 29}" ry="${350 + i * r(2, 20, 27)}" fill="none" stroke="currentColor" stroke-width="${i === 2 ? 15 : 1}" opacity="${i === 2 ? .045 : .2}"/>`).join("");
      const ticks = Array.from({ length: 32 }, (_, i) => `<g transform="rotate(${i * 11.25} 1140 510)"><path d="M1140 65v${r(i, 4, 15)}"/><circle cx="1140" cy="100" r="${i % 8 ? 1.2 : 4}" fill="currentColor" stroke="none"/></g>`).join("");
      art = move("orbit", rings) + move("satellite", '<circle cx="90" cy="825" r="210" fill="none" stroke="currentColor" stroke-width="28" opacity=".035"/><circle cx="90" cy="825" r="245" fill="none" stroke="currentColor" stroke-width="1" opacity=".2"/><circle cx="294" cy="690" r="5" fill="currentColor" opacity=".5"/>') + move("marks", `<g fill="none" stroke="currentColor" opacity=".3">${ticks}</g>`);
    } else if (kind === "folds") {
      art = move("page-back", '<path d="M680-180H1620V950H1320L680 280Z" fill="currentColor" opacity=".075"/><path d="M680-180V280L1140 280" fill="none" stroke="currentColor" opacity=".18"/>') +
        move("page-front", '<path d="M-280 770 450 610 1010 1190H-280Z" fill="currentColor" opacity=".09"/><path d="M-280 770 450 610 398 780Z" fill="white" opacity=".6"/>') +
        move("page-fold", `<path d="M${r(8, 1200, 1300)} 360 1660 110V760L1260 980Z" fill="currentColor" opacity=".065"/><path d="M1260 980 1300 570 1660 760" fill="none" stroke="currentColor" opacity=".16"/>`);
    } else if (kind === "glyphs") {
      art = move("glyph-belt", icons.map((name, i) => `<g class="bg-glyph" data-bg-chapter="${i}" transform="translate(${540 + i * 330} ${r(i + 3, 685, 735)}) rotate(${r(i + 12, -14, 14)})" opacity=".1">${glyph(name, 0, 0, r(i + 21, 215, 290))}</g>`).join("")) +
        move("glyph-echo", `<g opacity=".07">${glyph("files", 1210, -115, 330)}${glyph("keyboard", -130, 400, 210)}</g>`);
    } else if (kind === "raster") {
      const patch = (cols, rows, x, y) => Array.from({ length: cols * rows }, (_, i) => {
        const px = x + i % cols * 24, py = y + Math.floor(i / cols) * 24;
        const large = r(i + 9) > .7;
        return large ? `<rect x="${px - 3}" y="${py - 3}" width="6" height="6" rx="1" fill="currentColor" opacity="${r(i + 17, .12, .28)}"/>` : `<circle cx="${px}" cy="${py}" r="1" fill="currentColor" opacity=".35"/>`;
      }).join("");
      art = move("raster-east", patch(15, 22, 1100, 120)) + move("raster-south", patch(26, 5, -70, 790)) +
        move("raster-scan", '<rect x="1090" y="330" width="382" height="84" rx="3" fill="currentColor" opacity=".055"/><path d="M1090 352v-22h22M1450 414h22v-22" fill="none" stroke="currentColor" opacity=".5"/>');
    } else if (kind === "cutout") {
      art = move("cutout-wing", '<path d="M1240-120H1620V540L1540 620H1430V145H1240Z" fill="currentColor" opacity=".12"/><path d="M-140 730H160L235 805V1030H-140Z" fill="currentColor" opacity=".1"/>') +
        move("cutout-clip", '<path d="M1185 650v-310c0-110 170-110 170 0v345c0 180-275 180-275 0V360" fill="none" stroke="currentColor" stroke-width="19" stroke-linecap="round" opacity=".12"/>') +
        move("cutout-tab", `<g transform="rotate(${r(6, -18, -10)} 120 830)"><rect x="-230" y="810" width="710" height="160" rx="20" fill="currentColor" opacity=".09"/><path d="M-30 817h370" stroke="currentColor" stroke-width="2" opacity=".2"/></g>`);
    } else if (kind === "archive") {
      const rules = Array.from({ length: 9 }, (_, i) => `<path d="M${r(i + 13, -240, -180)} ${170 + i * 87}h${r(i + 22, 350, 420)}"/>`).join("");
      art = move("folder", `<path d="M-290-80H160L245 5V1080H-290Z" fill="currentColor" opacity=".045"/><path d="M160-80V5H245V1080" fill="none" stroke="currentColor" opacity=".18"/><g stroke="currentColor" opacity=".1">${rules}</g>`) +
        move("blind-stamp", '<text x="955" y="895" font-family="Georgia, serif" font-size="390" font-style="italic" letter-spacing="-55" fill="currentColor" opacity=".055">VP</text>') +
        move("register", `<g fill="none" stroke="currentColor" opacity=".27">${cross(1370, 205, 12)}${cross(1050, 80, 8)}<path d="M-20 880H1460"/></g>`);
    } else {
      const ticks = Array.from({ length: 72 }, (_, i) => `<path transform="rotate(${i * 5} 1160 610)" d="M1160 178v${i % 6 ? r(i, 6, 11) : 24}"/>`).join("");
      const field = Array.from({ length: 60 }, (_, i) => cross(65 + i % 12 * 122, 165 + Math.floor(i / 12) * 156, 2)).join("");
      art = move("dial", `<g fill="none" stroke="currentColor"><circle cx="1160" cy="610" r="420" stroke-width="1" opacity=".16"/><circle cx="1160" cy="610" r="355" stroke-width="72" stroke-dasharray="590 1650" opacity=".025"/><g opacity=".26">${ticks}</g></g>`) +
        move("instrument-field", `<g fill="none" stroke="currentColor" opacity=".16">${field}</g>`) +
        move("dial-cursor", '<path d="M1143 164h34l-17 22Z" fill="currentColor" opacity=".5"/><path d="M1160 196V220" stroke="currentColor" opacity=".5"/>');
    }
    return `<svg class="study-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art}</svg>`;
  }

  function poses(c, p) {
    const { kind, r } = c;
    const sway = Math.sin(p * Math.PI * 2);
    if (kind === "orbits") return [{ rotation: r(4, -18, 8) + p * 115, x: -p * 60, y: sway * 30, svgOrigin: "1140 510" }, { rotation: -p * 90, x: p * 75, svgOrigin: "90 825" }, { rotation: p * r(29, 80, 130), svgOrigin: "1140 510" }];
    if (kind === "folds") return [{ x: -p * r(26, 140, 185), y: p * 80, rotation: -p * 4, svgOrigin: "1250 0" }, { x: p * r(27, 180, 235), y: -p * 105, rotation: p * 6, svgOrigin: "180 900" }, { x: -p * 110, y: sway * r(30, 45, 90) }];
    if (kind === "glyphs") return [{ x: -p * 1920, y: sway * 32 }, { x: p * 80, y: p * 130, rotation: p * -12, svgOrigin: "1340 60" }];
    if (kind === "raster") return [{ x: -p * 48, y: -p * 70 }, { x: p * 145, y: sway * 18 }, { x: -p * 48, y: -130 + p * r(31, 380, 450) }];
    if (kind === "cutout") return [{ x: -p * r(26, 75, 115), y: p * 70 }, { rotation: -12 + p * r(28, 24, 38), y: -p * 95, svgOrigin: "1260 520" }, { x: p * r(29, 160, 210), y: -p * 55 }];
    if (kind === "archive") return [{ x: -p * 90, y: -p * 38, rotation: p * -3, svgOrigin: "120 450" }, { x: -p * 170, y: -p * 80 }, { x: p * 30, y: sway * 24 }];
    return [{ rotation: p * r(28, 90, 150), svgOrigin: "1160 610" }, { y: -p * 48, x: p * 22 }, { rotation: p * 265, svgOrigin: "1160 610" }];
  }

  window.vpasteBackgroundStudies = { catalog, artwork };
  window.createBackgroundStudy = () => {
    let selected = catalog.find(c => c.id === new URLSearchParams(location.search).get("backdrop")?.toLowerCase());
    if (!selected) return null; // The approved, unparameterized site remains unchanged.
    const backdrop = document.createElement("div");
    backdrop.className = "study-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    document.body.prepend(backdrop);
    const picker = document.createElement("details");
    picker.className = "study-picker";
    picker.innerHTML = `<summary><b data-study-letter></b><span data-study-name></span><span class="study-picker-caret">⌄</span></summary><div class="study-picker-panel"><p data-study-instruction></p><div class="study-choices">${catalog.map(c => `<button type="button" data-backdrop-choice="${c.id}"><b>${c.id.toUpperCase()}</b><span></span><small>${c.group === 0 ? "A–B" : c.group === 1 ? "C–D" : "E–G"}</small></button>`).join("")}</div><p class="study-picker-note"></p><a href="background-studies.html" data-study-overview></a></div>`;
    document.body.append(picker);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let state = { progress: 0, chapter: 0 };
    let animation = null;
    let nodes = [];
    const language = () => document.documentElement.dataset.language === "zh";
    const labels = () => {
      const zh = language();
      picker.querySelector("[data-study-letter]").textContent = selected.id.toUpperCase();
      picker.querySelector("[data-study-name]").textContent = selected[zh ? "zh" : "en"];
      picker.querySelector("[data-study-instruction]").textContent = zh ? "背景方案对比 · 保持当前章节" : "Background studies · keep your place";
      picker.querySelector(".study-picker-note").textContent = selected[zh ? "note" : "enNote"];
      picker.querySelector("[data-study-overview]").textContent = zh ? "查看全部七个方案 ↗" : "Overview of all seven studies ↗";
      picker.querySelectorAll("[data-backdrop-choice]").forEach((button, i) => {
        button.querySelector("span").textContent = catalog[i][zh ? "zh" : "en"];
        button.setAttribute("aria-pressed", String(catalog[i] === selected));
      });
    };
    const go = ({ progress, chapter, duration = 0 }) => {
      state = { progress, chapter };
      animation?.kill();
      const destinations = poses(selected, progress);
      if (window.gsap) {
        animation = gsap.timeline({ defaults: { duration: reduced.matches ? 0 : duration, ease: "sine.inOut" } });
        nodes.forEach((node, i) => animation.to(node, destinations[i], 0));
      }
      backdrop.querySelectorAll("[data-bg-chapter]").forEach((node, i) => { node.style.opacity = i === chapter ? ".2" : ".075"; });
      backdrop.dataset.progress = String(progress);
    };
    const render = () => {
      animation?.kill();
      document.documentElement.dataset.backdrop = selected.id;
      document.documentElement.dataset.backgroundFamily = selected.kind;
      backdrop.dataset.family = selected.kind;
      backdrop.dataset.seed = selected.seed;
      backdrop.style.color = selected.color;
      backdrop.innerHTML = artwork(selected);
      nodes = [...backdrop.querySelectorAll("[data-bg-motion]")];
      labels();
      go(state);
    };
    picker.addEventListener("click", event => {
      const choice = event.target.closest("[data-backdrop-choice]");
      if (!choice) return;
      selected = catalog.find(c => c.id === choice.dataset.backdropChoice);
      const url = new URL(location.href);
      url.searchParams.set("backdrop", selected.id);
      history.replaceState(null, "", url);
      picker.open = false;
      render();
      picker.querySelector("summary").focus({ preventScroll: true });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && picker.open) { picker.open = false; picker.querySelector("summary").focus(); }
    });
    document.addEventListener("click", event => { if (picker.open && !picker.contains(event.target)) picker.open = false; });
    document.addEventListener("vpaste:language", labels);
    reduced.addEventListener("change", () => go(state));
    document.addEventListener("visibilitychange", () => { if (document.hidden) animation?.progress(1); });
    // The selector is outside the scene canvas: its wheel/touch gestures must not change chapters.
    picker.addEventListener("wheel", event => event.stopPropagation(), { passive: true });
    picker.addEventListener("keydown", event => {
      event.stopPropagation();
      if (event.key === "Escape") { picker.open = false; picker.querySelector("summary").focus(); }
    });
    render();
    return { go, settle: () => go(state) };
  };
})();
