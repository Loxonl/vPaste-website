(() => {
  "use strict";
  // Do not lock scrolling if one of the enhancement scripts could not be loaded.
  if (!window.vpasteSite || !window.vpasteIcon || !window.createBackgroundStudy || !window.createProductDemos || !window.createLocalHistoryLoop) return;
  document.documentElement.dataset.concept = "a";
  const icon = window.vpasteIcon;
  const story = document.querySelector(".continuous-story");
  const app = story.querySelector(".story-product");
  const desktop = story.querySelector("[data-platform-desktop]");
  const platforms = story.querySelector(".platform-switch");
  const sectionIds = ["top", "experience", "use-cases", "formats", "workflow", "privacy", "open-source"];
  const formats = ["text", "image", "link", "file", "color"];
  const features = ["history", "snippets", "organize", "search", "preview", "queue", "drag"];
  const tr = (key, tag = "span", cls = "") => `<${tag} class="${cls}" data-i18n="${key}"></${tag}>`;
  const backgroundStudy = window.createBackgroundStudy();
  const loadArtwork = (image, lazy = false) => {
    if (!image || image.hasAttribute("src")) return;
    image.loading = lazy ? "lazy" : "eager";
    image.src = image.dataset.artworkSrc;
  };
  const prepareArtwork = (chapter) => {
    if (chapter === 4) window.vpasteSite.loadProductImages(story.querySelector(".settings-sheet"));
    if (chapter === 1) loadArtwork(desktop.querySelector(`.desktop-platform--${document.documentElement.dataset.platform} img`));
  };
  platforms.addEventListener("click", () => {
    if (Number(story.dataset.chapter) === 1) prepareArtwork(1);
  });

  const labels = () => {
    const zh = document.documentElement.dataset.language === "zh";
    const chapterNames = ["hero.kicker", "shortcut.title", "usecases.title", "formats.title", "workflow.title", "privacy.title", "source.title"];
    story.querySelectorAll("[data-chapter-link]").forEach((link, i) => {
      const label = story.querySelector(`[data-i18n="${chapterNames[i]}"]`).textContent;
      link.setAttribute("aria-label", label);
      link.title = label;
    });
    story.querySelector(".format-select").setAttribute("aria-label", zh ? "内容格式" : "Content formats");
    story.querySelector(".feature-select").setAttribute("aria-label", zh ? "功能演示" : "Feature demonstrations");
    for (const [selector, text] of [["[data-story-prev]", zh ? "上一幕" : "Previous scene"], ["[data-story-next]", zh ? "下一幕" : "Next scene"]]) {
      const control = story.querySelector(selector);
      control.setAttribute("aria-label", text);
      control.title = text;
    }
  };
  labels();
  document.addEventListener("vpaste:language", labels);
  let jumpTo = null;
  const featureStart = 2.3;
  const featureStep = .34;
  const formatStart = 5.08;
  const chapterTimes = [0, 1.3, featureStart, formatStart + .26, 8.75, 10, 11.3];
  const duration = 11.3;
  document.addEventListener("click", (event) => {
    const formatButton = event.target.closest("[data-format-jump]");
    if (formatButton && jumpTo) jumpTo(formatStart + .26 + Number(formatButton.dataset.formatJump) * .5);
    const featureButton = event.target.closest("[data-feature-jump]");
    if (featureButton) {
      const index = Number(featureButton.dataset.featureJump);
      if (jumpTo) jumpTo(featureStart + index * featureStep);
    }
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || !jumpTo) return;
    const index = sectionIds.indexOf(anchor.hash.slice(1));
    if (index < 0) return;
    event.preventDefault();
    if (jumpTo(chapterTimes[index])) history.replaceState(null, "", location.pathname + location.search + anchor.hash);
  });

  // Without animation support, this new document is still complete and readable.
  if (!window.gsap || new URLSearchParams(location.search).get("view") === "read") {
    return;
  }
  const { gsap } = window;
  const media = gsap.matchMedia();
  media.add("(min-width: 1100px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)", () => {
    document.body.classList.add("story-motion");
    document.documentElement.classList.add("story-paged");
    scrollTo({ top: 0, behavior: "instant" });
    const world = story.querySelector(".story-world");
    const actor = story.querySelector(".app-actor");
    const board = story.querySelector(".desktop-holder");
    const sheet = story.querySelector(".settings-sheet");
    const dataVisual = story.querySelector(".data-visual");
    const panels = [...story.querySelectorAll(".chapter-copy")];
    const cards = [...app.querySelectorAll(".vp-clip-card")];
    const notes = story.querySelector(".format-notes-track");
    const gallery = story.querySelector(".feature-gallery");
    const featureTrack = gallery.querySelector(".feature-track");
    world.append(sheet);
    const demos = window.createProductDemos({ actor, app, icon, tr, translate: window.vpasteSite.translate });
    const gear = app.querySelectorAll(".vp-app-icon-button")[1];
    const rotation = 3.5;
    const poses = [
      { x: 570, y: 385, scale: .71, rotation: -rotation },
      { x: 575, y: 449.98, scale: 765 / 1120, rotation: 0 },
      { x: 440, y: 430, scale: .8, rotation: 0 },
      { x: 155, y: 160, scale: .84, rotation: 0 },
      { x: 680, y: 645, scale: .56, rotation: 0 },
      { x: 95, y: 210, scale: .67, rotation: 0 },
      { x: 825, y: 375, scale: .45, rotation: -rotation },
    ];
    const layoutWorld = () => {
      const scale = Math.min(story.clientWidth / 1440, (innerHeight - 140) / 820);
      world.style.setProperty("--world-scale", scale);
      world.style.setProperty("--world-top", Math.max(0, (innerHeight - 140 - 820 * scale) / 2) + "px");
    };
    layoutWorld();
    const timeline = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } });
    gsap.set(actor, { ...poses[0], transformOrigin: "0 0" });
    gsap.set(board, { x: 507.5, y: 87.32, scale: 0, transformOrigin: "50% 80%" });
    const settingsOrigin = {
      x: poses[4].x + (gear.offsetLeft + gear.offsetWidth / 2) * poses[4].scale - 610,
      y: poses[4].y + (gear.offsetTop + gear.offsetHeight / 2) * poses[4].scale - 610 * 1080 / 1230,
    };
    gsap.set(sheet, { ...settingsOrigin, scale: 0, transformOrigin: "100% 100%" });
    gsap.set(dataVisual, { y: 35, scale: .94, transformOrigin: "50% 50%" });
    gsap.set(panels.slice(1), { xPercent: 110 });
    gsap.set(cards, { transformOrigin: "50% 50%" });
    const transition = (index, at, travel = .7) => {
      timeline.to(actor, { ...poses[index], duration: travel }, at);
      timeline.to(panels[index - 1], { xPercent: -110, duration: travel }, at);
      timeline.to(panels[index], { xPercent: 0, yPercent: 0, duration: travel }, at);
    };
    timeline.addLabel("whole-app", 0);
    transition(1, .55);
    timeline.to(board, { scale: .85, duration: .7 }, .55).addLabel("desktop", 1.3);
    transition(2, 1.55);
    timeline.to(board, { y: -650, rotation: -6, duration: .7 }, 1.55).addLabel("history", featureStart);
    features.forEach((key, index) => {
      const at = featureStart + index * featureStep;
      if (index) timeline.to(featureTrack, { x: -index * 840, duration: .26 }, at - .28);
      if (index === 4) timeline.to(actor, { x: 450, y: 620, scale: .65, duration: .28 }, at - .3);
      if (index === 5) timeline.to(actor, { x: 450, y: 600, scale: .78, duration: .28 }, at - .3);
      timeline.addLabel("feature-" + key, at);
    });
    transition(3, 4.55);
    timeline.addLabel("formats", formatStart + .26);
    formats.forEach((type, index) => {
      const card = cards[index];
      const at = formatStart + index * .5;
      // Translate the ORIGINAL card out of its slot. No clone or cross-fade is used.
      const pose = poses[3];
      const target = { x: 830, y: 470 };
      const x = (target.x - pose.x) / pose.scale - card.offsetLeft;
      const y = (target.y - pose.y) / pose.scale - card.offsetTop;
      timeline.set(card, { zIndex: 12 }, at);
      timeline.to(card, { x, y, scale: 1.3, rotation: -rotation, duration: .2 }, at);
      timeline.to(card, { x: 0, y: 0, scale: 1, rotation: 0, duration: .2 }, at + .33);
      timeline.set(card, { zIndex: 0 }, at + .53);
      if (index) timeline.to(notes, { y: -index * 300, duration: .19 }, at);
      timeline.addLabel("format-" + formats[index], at + .26);
    });
    transition(4, 7.65, .5);
    timeline.to(gear, { scale: 1.25, color: "#2670c5", duration: .14 }, 8.15);
    timeline.to(gear, { scale: 1, color: "#65757a", duration: .16 }, 8.29);
    timeline.to(sheet, { scale: 1, duration: .43 }, 8.29).addLabel("settings", 8.75);
    transition(5, 9.2);
    timeline.to(sheet, { scale: 0, duration: .5 }, 9.2);
    timeline.to(dataVisual, { y: 0, scale: 1, duration: .7 }, 9.2);
    timeline.addLabel("local", 10);
    transition(6, 10.5);
    timeline.addLabel("closing", 11.3);
    timeline.to(story.querySelector(".world-lines"), { x: -1050, duration, ease: "none" }, 0);
    timeline.to({}, { duration: .01 }, duration - .01);
    let active = -1;
    const updateState = () => {
      const time = timeline.time();
      let next = 0;
      [ .96, 1.96, 4.96, 8.05, 9.61, 10.91 ].forEach((threshold) => { if (time >= threshold) next++; });
      story.dataset.chapter = String(next);
      if (active !== next) {
        active = next;
        prepareArtwork(next);
        panels.forEach((panel, i) => { panel.inert = i !== next; panel.setAttribute("aria-hidden", String(i !== next)); });
        sheet.inert = next !== 4;
        sheet.setAttribute("aria-hidden", String(next !== 4));
        story.querySelectorAll("[data-chapter-link]").forEach((link, i) => {
          if (i === next) link.setAttribute("aria-current", "step"); else link.removeAttribute("aria-current");
        });
      }
      const selected = Math.max(0, Math.min(4, Math.floor((time - formatStart) / .5)));
      story.querySelectorAll("[data-format-jump]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === selected)));
      const feature = Math.max(0, Math.min(6, Math.floor((time - featureStart + .08) / featureStep)));
      gallery.inert = next !== 2;
      gallery.setAttribute("aria-hidden", String(next !== 2));
      story.querySelectorAll("[data-feature-jump]").forEach((button, i) => button.setAttribute("aria-pressed", String(i === feature)));
      gallery.querySelectorAll(".feature-example").forEach((example, i) => example.setAttribute("aria-hidden", String(next !== 2 || i !== feature)));
      document.querySelector(".scroll-progress span").style.transform = `scaleX(${time / duration})`;
    };
    timeline.eventCallback("onUpdate", updateState);
    // Wheel movement expresses intent. A paused timeline only rests at complete scenes.
    const stops = [0, 1.3, ...features.map((_, i) => featureStart + i * featureStep),
      ...formats.map((_, i) => formatStart + .26 + i * .5), 8.75, 10, 11.3];
    let step = 0;
    let transitionTween = null;
    let lastWheel = 0;
    let accumulated = 0;
    let gestureConsumed = false;
    let wheelDirection = 0;
    const previous = story.querySelector("[data-story-prev]");
    const next = story.querySelector("[data-story-next]");
    const pauseButton = story.querySelector("[data-demo-pause]");
    let localLoop = null;
    let paused = false;
    const pauseLoops = () => {
      demos.pause(paused || document.hidden);
      localLoop?.pause(paused || document.hidden);
      pauseButton.querySelector("span").dataset.i18n = paused ? "demo.resume" : "demo.pause";
      window.vpasteSite.translate(pauseButton);
      pauseButton.setAttribute("aria-pressed", String(paused));
    };
    const stopLoops = () => { demos.stop(); localLoop?.stop(); localLoop = null; pauseButton.hidden = true; delete story.dataset.demo; };
    const startLoops = () => {
      if (step >= 2 && step <= 8) { demos.enter(step - 2); story.dataset.demo = String(step - 2); }
      if (step === 15) localLoop = window.createLocalHistoryLoop({ root: dataVisual, actor, cards });
      pauseButton.hidden = !(step >= 2 && step <= 8) && step !== 15;
      pauseLoops();
    };
    const togglePause = () => { paused = !paused; pauseLoops(); };
    const announce = () => {
      previous.disabled = step === 0;
      next.disabled = step === stops.length - 1;
      story.dataset.step = String(step);
      story.dataset.transitioning = String(!!transitionTween);
      const chapter = Number(story.dataset.chapter);
      const detail = chapter === 2 ? story.querySelectorAll(".feature-example h3")[step - 2]?.textContent : chapter === 3 ? story.querySelectorAll("[data-format-note] h3")[step - 9]?.textContent : null;
      story.querySelector(".story-status").textContent = detail || panels[chapter].querySelector("h1, h2").textContent;
    };
    const go = (index) => {
      index = Math.max(0, Math.min(stops.length - 1, index));
      if (index === step || transitionTween) return false;
      stopLoops();
      const sameChapter = (step >= 2 && step <= 8 && index >= 2 && index <= 8) ||
        (step >= 9 && step <= 13 && index >= 9 && index <= 13);
      const directJump = Math.abs(index - step) > 1 && !sameChapter;
      const previousChapter = Number(story.dataset.chapter);
      const targetChapter = chapterTimes.reduce((chapter, time, i) => time <= stops[index] ? i : chapter, 0);
      backgroundStudy?.go({ progress: stops[index] / duration, chapter: targetChapter, duration: sameChapter ? .85 : 1.35 });
      step = index;
      prepareArtwork(targetChapter);
      story.dataset.transitioning = "true";
      const complete = () => { transitionTween = null; startLoops(); announce(); };
      if (directJump) {
        // Navigation links travel straight to their scene, without fast-forwarding intervening chapters.
        const elements = [actor, panels[previousChapter], panels[targetChapter], ...cards, story.querySelector(".world-lines")];
        for (const [chapter, element] of [[1, board], [4, sheet], [5, dataVisual]]) {
          if (chapter === previousChapter || chapter === targetChapter) elements.push(element);
        }
        const readPose = element => Object.fromEntries(["x", "y", "xPercent", "yPercent", "scaleX", "scaleY", "rotation"].map(key => [key, gsap.getProperty(element, key)]));
        const before = elements.map(readPose);
        timeline.time(stops[step]);
        const after = elements.map(readPose);
        transitionTween = gsap.timeline({ defaults: { duration: 1.35, ease: "sine.inOut" }, onComplete: complete });
        elements.forEach((element, i) => transitionTween.fromTo(element, before[i], after[i], 0));
        return true;
      }
      transitionTween = timeline.tweenTo(stops[step], {
        duration: sameChapter ? .85 : 1.35, ease: "none",
        onComplete: complete,
      });
      return true;
    };
    jumpTo = (time) => go(stops.reduce((best, value, i) => Math.abs(value - time) < Math.abs(stops[best] - time) ? i : best, 0));
    const wheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      event.preventDefault();
      const now = performance.now();
      const direction = Math.sign(event.deltaY);
      if (now - lastWheel > 180 || (direction !== wheelDirection && !transitionTween)) {
        accumulated = 0;
        gestureConsumed = false;
      }
      lastWheel = now;
      wheelDirection = direction;
      if (transitionTween || gestureConsumed) return;
      accumulated += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (Math.abs(accumulated) >= 55) {
        gestureConsumed = true;
        accumulated = 0;
        go(step + direction);
      }
    };
    const keyboard = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.repeat ||
          event.target.closest("input, textarea, select, [contenteditable=true]") ||
          (event.code === "Space" && event.target.closest("a, button"))) return;
      let index;
      if (event.code === "Space" && step === 6 && !transitionTween) {
        event.preventDefault();
        demos.replayPreview();
        pauseLoops();
        return;
      }
      if (["ArrowDown", "PageDown"].includes(event.key) || (event.code === "Space" && !event.shiftKey)) index = step + 1;
      if (["ArrowUp", "PageUp"].includes(event.key) || (event.code === "Space" && event.shiftKey)) index = step - 1;
      if (event.key === "Home") index = 0;
      if (event.key === "End") index = stops.length - 1;
      if (index === undefined) return;
      event.preventDefault();
      if (!transitionTween) go(index);
    };
    let touchY = null;
    const touchStart = event => { touchY = event.touches.length === 1 ? event.touches[0].clientY : null; };
    const touchEnd = event => {
      if (touchY === null || transitionTween) return;
      const distance = touchY - event.changedTouches[0].clientY;
      touchY = null;
      if (Math.abs(distance) > 55) go(step + Math.sign(distance));
    };
    const back = () => go(step - 1);
    const forward = () => go(step + 1);
    const refreshLanguage = () => {
      announce();
      if (!transitionTween) { stopLoops(); startLoops(); }
    };
    previous.addEventListener("click", back);
    next.addEventListener("click", forward);
    pauseButton.addEventListener("click", togglePause);
    document.addEventListener("visibilitychange", pauseLoops);
    window.addEventListener("wheel", wheel, { passive: false });
    document.addEventListener("keydown", keyboard);
    story.addEventListener("touchstart", touchStart, { passive: true });
    story.addEventListener("touchend", touchEnd, { passive: true });
    window.addEventListener("resize", layoutWorld);
    document.addEventListener("vpaste:language", refreshLanguage);
    const initialChapter = sectionIds.indexOf(location.hash.slice(1));
    if (initialChapter > 0) {
      step = stops.indexOf(chapterTimes[initialChapter]);
      timeline.time(stops[step]);
    }
    updateState();
    backgroundStudy?.go({ progress: timeline.time() / duration, chapter: Number(story.dataset.chapter) });
    startLoops();
    announce();
    return () => {
      jumpTo = null;
      backgroundStudy?.settle();
      transitionTween?.kill();
      stopLoops();
      demos.destroy();
      window.removeEventListener("wheel", wheel);
      document.removeEventListener("keydown", keyboard);
      story.removeEventListener("touchstart", touchStart);
      story.removeEventListener("touchend", touchEnd);
      window.removeEventListener("resize", layoutWorld);
      document.removeEventListener("vpaste:language", refreshLanguage);
      previous.removeEventListener("click", back);
      next.removeEventListener("click", forward);
      pauseButton.removeEventListener("click", togglePause);
      document.removeEventListener("visibilitychange", pauseLoops);
      document.documentElement.classList.remove("story-paged");
      delete story.dataset.step;
      delete story.dataset.transitioning;
      panels.forEach((panel) => { panel.inert = false; panel.removeAttribute("aria-hidden"); });
      panels[4].querySelector(".chapter-heading").after(sheet);
      sheet.inert = false;
      sheet.removeAttribute("aria-hidden");
      gallery.inert = false;
      gallery.removeAttribute("aria-hidden");
      gallery.querySelectorAll(".feature-example").forEach(example => example.removeAttribute("aria-hidden"));
      story.querySelectorAll("[data-feature-jump], [data-format-jump]").forEach(button => button.removeAttribute("aria-pressed"));
      document.body.classList.remove("story-motion");
      document.querySelector(".scroll-progress span").style.removeProperty("transform");
    };
  });
})();
