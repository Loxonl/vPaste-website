/* Product interactions act on the existing window; only previews and receiving apps are separate. */
window.createProductDemos = ({ actor, app, icon, tr, translate }) => {
  const cards = [...app.querySelectorAll(".vp-clip-card")];
  const tabs = [...app.querySelectorAll(".vp-app-tab")];
  const bar = app.querySelector(".vp-app-bar");
  const rail = app.querySelector(".vp-card-rail");
  const search = document.createElement("div");
  search.className = "demo-search-field";
  search.innerHTML = '<span>vPaste</span><i></i>';
  bar.append(search);
  const continuation = document.createElement("div");
  continuation.className = "history-continuation";
  continuation.innerHTML = `<b aria-hidden="true">···</b>${tr("demo.older")}`;
  app.append(continuation);
  // Public, fictional form data; the independent queue follows the client's list layout.
  const formFields = [["email", "hello@example.com"], ["address1", "18 Market Street"], ["address2", "Suite 240"], ["postal", "94105"]];
  const overlays = document.createElement("div");
  overlays.className = "product-overlays";
  overlays.innerHTML = `
    <div class="demo-format-note">${icon("text-cursor-input")}${tr("demo.keepFormat")}<kbd>Shift + Enter</kbd>${tr("demo.plainText")}</div>
    <div class="demo-tab-indicator" aria-hidden="true"></div>
    <div class="demo-keypress"><kbd>Space</kbd>${tr("demo.spacePreview")}</div>
    <div class="demo-preview-window" aria-hidden="true">
      <div class="demo-window-title">${icon("scan-eye")}${tr("product.previewTitle")}<span>×</span></div>
      <div class="demo-preview-image"><img src="/assets/format-stack.webp" alt="" loading="lazy" /><small>1200 × 800</small></div>
      <div class="demo-preview-link"><div class="demo-url">github.com/Loxonl/vPaste-desktop</div><div class="demo-readme"><img src="/assets/vpaste-logo.webp" width="45" height="45" alt="" /><h3>vPaste</h3>${tr("product.textDescription", "p")}<div>Windows / macOS <span>GPL-3.0</span></div><hr />${tr("demo.readme", "p")}</div></div>
    </div>
    <div class="demo-receiver" aria-hidden="true">
      <div class="demo-window-title">${icon("file")}${tr("demo.workNote")}<span>− &nbsp; □ &nbsp; ×</span></div>
      <div class="demo-note"><h3 data-i18n="demo.projectNote"></h3><div class="demo-dropzone">${icon("image")}${tr("demo.dropHere")}<img src="/assets/format-stack-small.webp" alt="" loading="lazy" /></div></div>
    </div>
    <div class="demo-queue-window" aria-hidden="true">
      <div class="demo-queue-header"><span>×</span><div>${tr("usecases.queue", "strong")}<small><b data-queue-count>0</b> / 100</small></div><span class="demo-queue-tools">${icon("arrow-right-left")}<b>···</b></span></div>
      <div class="demo-queue-list">${formFields.map(([, value]) => `<div class="demo-queue-row"><span class="demo-queue-grip">⠿</span>${icon("type")}<div><strong>${value}</strong><small>${tr("demo.queueNext", "span", "demo-queue-next")}${tr("product.text", "span", "demo-queue-type")}</small></div></div>`).join("")}<div class="demo-queue-empty">${icon("check")}${tr("demo.queueEmpty")}</div></div>
      <div class="demo-queue-workflow" data-phase="copy"><kbd>Ctrl / ⌘ + <b>C</b></kbd>${tr("demo.queueCopy", "span", "demo-copy-label")}${tr("demo.queuePaste", "span", "demo-paste-label")}</div>
    </div>
    <div class="demo-form" aria-hidden="true"><div class="demo-window-title">${icon("file")}${tr("demo.formTitle")}<span>− &nbsp; □ &nbsp; ×</span></div><div class="demo-form-fields">${formFields.map(([key, value]) => `<div class="demo-form-field">${tr("demo." + key, "small")}<div><span class="demo-form-value">${value}</span><i></i></div></div>`).join("")}</div></div>
    <img class="demo-drag-ghost" src="/assets/format-stack-small.webp" alt="" loading="lazy" />
    <span class="demo-pointer" aria-hidden="true">${icon("mouse-pointer-2")}</span>`;
  actor.append(overlays);
  translate(actor);
  let context = null;
  let loop = null;
  let active = -1;
  const restore = () => {
    context?.revert();
    context = null;
    loop = null;
    active = -1;
    delete actor.dataset.demo;
    tabs.forEach(tab => tab.classList.remove("demo-tab-active"));
    cards.forEach(card => card.classList.remove("demo-selected"));
  };
  const enter = index => {
    restore();
    active = index;
    actor.dataset.demo = ["history", "formatting", "categories", "search", "preview", "queue", "drag"][index];
    const gsap = window.gsap;
    context = gsap.context(() => {
      const pointer = overlays.querySelector(".demo-pointer");
      const popup = overlays.querySelector(".demo-preview-window");
      const key = overlays.querySelector(".demo-keypress kbd");
      const receiver = overlays.querySelector(".demo-receiver");
      const select = selected => cards.forEach((card, i) => card.classList.toggle("demo-selected", i === selected));
      loop = gsap.timeline({ repeat: -1, repeatDelay: .7, defaults: { ease: "sine.inOut" } });
      if (index === 0) {
        loop.to(rail, { x: -45, duration: 2.2 }, .6).to(rail, { x: 0, duration: 2.2 }, 4.2);
      } else if (index === 1) {
        cards.forEach((card, i) => {
          const at = .2 + i * .16;
          loop.to(card, { y: -14, scale: 1.035, duration: .32 }, at)
            .to(card, { y: 0, scale: 1, duration: .38 }, at + .32);
        });
      } else if (index === 2) {
        const indicator = overlays.querySelector(".demo-tab-indicator");
        gsap.set(indicator, { x: tabs[0].offsetLeft + 10, scaleX: tabs[0].offsetWidth - 20, transformOrigin: "0 50%" });
        // These are the real type tabs and original records, not a second filter mockup.
        [[2, [0, 5]], [3, [1]], [4, [2]], [1, [0, 2]]].forEach(([tabIndex, visible], phase) => {
          const at = phase * 2.6;
          const tab = tabs[tabIndex];
          loop.call(() => tabs.forEach((item, i) => item.classList.toggle("demo-tab-active", i === tabIndex)), [], at);
          loop.to(indicator, { x: tab.offsetLeft + 10, scaleX: tab.offsetWidth - 20, duration: .5 }, at);
          cards.forEach((card, i) => {
            const order = visible.indexOf(i);
            loop.to(card, { x: order < 0 ? 0 : 16 + order * 182 - card.offsetLeft, y: order < 0 ? 14 : 0, opacity: order < 0 ? 0 : 1, duration: .6 }, at + .25);
          });
        });
        loop.to({}, { duration: 1.5 });
      } else if (index === 3) {
        select(0);
        gsap.set(search, { scaleX: 0, transformOrigin: "0 50%" });
        gsap.set(search.querySelector("span"), { clipPath: "inset(0 100% 0 0)" });
        loop.to(search, { scaleX: 1, duration: .5 }, .1);
        loop.to(search.querySelector("span"), { clipPath: "inset(0 0% 0 0)", duration: .65, ease: "steps(6)" }, .6);
        cards.forEach((card, i) => {
          const order = [0, 2, 5].indexOf(i);
          loop.to(card, { x: order < 0 ? 0 : 16 + order * 182 - card.offsetLeft, opacity: order < 0 ? 0 : 1, y: order < 0 ? 14 : 0, duration: .65 }, 1.1);
        });
        loop.to({}, { duration: 3.8 }).to(search.querySelector("span"), { clipPath: "inset(0 100% 0 0)", duration: .25 });
        loop.to(cards, { x: 0, y: 0, opacity: 1, duration: .6 });
      } else if (index === 4) {
        const image = overlays.querySelector(".demo-preview-image");
        const link = overlays.querySelector(".demo-preview-link");
        gsap.set(popup, { scale: .88, y: 25, autoAlpha: 0, transformOrigin: "30% 100%" });
        [[1, image, link], [2, link, image]].forEach(([selected, show, hide], phase) => {
          const at = phase * 4.4;
          loop.call(() => select(selected), [], at);
          loop.set(show, { display: "block" }, at).set(hide, { display: "none" }, at);
          loop.to(key, { y: 3, backgroundColor: "#c8dfef", duration: .13 }, at + .5).to(key, { y: 0, backgroundColor: "#ffffff", duration: .2 }, at + .7);
          loop.to(popup, { scale: 1, y: 0, autoAlpha: 1, duration: .55 }, at + .65);
          loop.to(popup, { scale: .93, y: 18, autoAlpha: 0, duration: .4 }, at + 3.7);
        });
      } else if (index === 5) {
        const rows = [...overlays.querySelectorAll(".demo-queue-row")];
        const fields = [...overlays.querySelectorAll(".demo-form-field")];
        const values = overlays.querySelectorAll(".demo-form-value");
        const count = overlays.querySelector("[data-queue-count]");
        const empty = overlays.querySelector(".demo-queue-empty");
        const workflow = overlays.querySelector(".demo-queue-workflow");
        const pasteKey = workflow.querySelector("kbd");
        const nextRow = index => rows.forEach((row, i) => row.classList.toggle("is-next", i === index));
        gsap.set(rows, { autoAlpha: 0, y: 12 });
        gsap.set(values, { autoAlpha: 0, y: 5 });
        gsap.set(empty, { autoAlpha: 0 });
        loop.set(rows, { autoAlpha: 0, x: 0, y: 12 }, 0).set(values, { autoAlpha: 0, y: 5 }, 0).set(empty, { autoAlpha: 0 }, 0);
        loop.set(count, { textContent: "0" }, 0).set(pasteKey.querySelector("b"), { textContent: "C" }, 0);
        loop.call(() => { workflow.dataset.phase = "copy"; nextRow(0); fields.forEach(field => field.classList.remove("is-current")); }, [], 0);
        rows.forEach((row, i) => {
          const at = .3 + i * .45;
          loop.to(pasteKey, { y: 3, backgroundColor: "#dcebf4", duration: .12 }, at);
          loop.to(pasteKey, { y: 0, backgroundColor: "#ffffff", duration: .2 }, at + .12);
          loop.to(row, { autoAlpha: 1, y: 0, duration: .3 }, at);
          loop.set(count, { textContent: String(i + 1) }, at + .3);
        });
        loop.set(pasteKey.querySelector("b"), { textContent: "V" }, 2.7);
        loop.call(() => { workflow.dataset.phase = "paste"; }, [], 2.7);
        rows.forEach((row, i) => {
          const at = 3 + i * 1.35;
          loop.call(() => fields.forEach((field, n) => field.classList.toggle("is-current", n === i)), [], at);
          loop.to(pasteKey, { y: 3, backgroundColor: "#dcebf4", duration: .14 }, at + .1);
          loop.to(pasteKey, { y: 0, backgroundColor: "#ffffff", duration: .2 }, at + .26);
          loop.to(values[i], { autoAlpha: 1, y: 0, duration: .4 }, at + .25);
          loop.to(row, { x: 20, autoAlpha: 0, duration: .3 }, at + .4);
          loop.to(rows.slice(i + 1), { y: -(i + 1) * row.offsetHeight, duration: .35 }, at + .55);
          loop.set(count, { textContent: String(rows.length - i - 1) }, at + .65);
          loop.call(() => nextRow(i + 1), [], at + .65);
        });
        loop.to(empty, { autoAlpha: 1, duration: .3 }, 7.9);
        loop.call(() => fields.forEach(field => field.classList.remove("is-current")), [], 8.2);
        loop.to({}, { duration: 1.3 });
      } else if (index === 6) {
        select(1);
        const ghost = overlays.querySelector(".demo-drag-ghost");
        const dropped = overlays.querySelector(".demo-dropzone img");
        gsap.set(ghost, { x: 205, y: 74, autoAlpha: 0 });
        gsap.set(pointer, { x: 265, y: 130 });
        gsap.set(dropped, { autoAlpha: 0, scale: .95 });
        loop.to(pointer, { x: 245, y: 112, duration: .5 }, .2);
        loop.set(ghost, { autoAlpha: .9 }, .75);
        loop.to(ghost, { x: 615, y: -205, scale: .8, duration: 1.4 }, .8);
        loop.to(pointer, { x: 665, y: -160, duration: 1.4 }, .8);
        loop.to(receiver.querySelector(".demo-dropzone"), { borderColor: "#2670c5", backgroundColor: "#e9f2fb", duration: .4 }, 1.8);
        loop.to(ghost, { autoAlpha: 0, duration: .15 }, 2.2);
        loop.to(dropped, { autoAlpha: 1, scale: 1, duration: .4 }, 2.25);
        loop.to(pointer, { x: 805, y: -90, duration: .65 }, 2.6).to({}, { duration: 1.8 });
      }
    }, actor);
    return loop;
  };
  return {
    enter,
    stop: restore,
    pause: paused => loop?.paused(paused),
    replayPreview: () => { if (active === 4) loop?.restart(); },
    destroy: () => { restore(); overlays.remove(); search.remove(); continuation.remove(); },
  };
};

window.createLocalHistoryLoop = ({ root, actor, cards }) => {
  let loop;
  const originalPoses = cards.map(card => Object.fromEntries(["x", "y", "scaleX", "scaleY", "opacity", "visibility"].map(key => [key, gsap.getProperty(card, key)])));
  const context = gsap.context(() => {
    const windows = root.querySelector(".local-device--windows .local-device-icon");
    const mac = root.querySelector(".local-device--mac .local-device-icon");
    const bundle = root.querySelector(".migration-bundle");
    const marks = root.querySelectorAll(".local-save-mark");
    const destination = windows.getBoundingClientRect();
    const actorScale = actor.getBoundingClientRect().width / actor.offsetWidth;
    const pipeline = root.querySelector(".local-pipeline");
    const pipelineRect = pipeline.getBoundingClientRect();
    const worldScale = pipelineRect.width / pipeline.offsetWidth;
    const macRect = mac.getBoundingClientRect();
    const bundleStart = (destination.left + destination.width / 2 - pipelineRect.left) / worldScale;
    const bundleEnd = (macRect.left + macRect.width / 2 - pipelineRect.left) / worldScale;
    loop = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: "sine.inOut" } });
    gsap.set(bundle, { x: bundleStart, xPercent: -50, autoAlpha: 0 });
    gsap.set(marks, { scale: .6, autoAlpha: 0 });
    loop.set(marks, { scale: .6, autoAlpha: 0 }, 0);
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const x = (destination.left + destination.width / 2 - rect.left - rect.width / 2) / actorScale;
      const y = (destination.top + destination.height / 2 - rect.top - rect.height / 2) / actorScale;
      const at = .3 + i * .2;
      loop.to(card, { x, y, scale: .06, duration: 1, ease: "power2.inOut" }, at);
      loop.to(card, { autoAlpha: 0, duration: .18 }, at + .85);
    });
    loop.to(windows, { scale: 1.1, duration: .35 }, 1.1).to(windows, { scale: 1, duration: .4 }, 2.3);
    loop.to(marks[0], { scale: 1, autoAlpha: 1, duration: .4 }, 2.4);
    // Saving copies does not remove the original history from the window.
    loop.set(cards, { x: 0, y: 0, scale: 1 }, 2.8).to(cards, { autoAlpha: 1, duration: .65, stagger: .08 }, 2.8);
    loop.to(bundle, { autoAlpha: 1, duration: .2 }, 3.6);
    loop.to(bundle, { x: bundleEnd, duration: 1.6 }, 3.9);
    loop.to(marks[1], { scale: 1, autoAlpha: 1, duration: .4 }, 5.3);
    loop.to(bundle, { x: bundleStart, duration: 1.6 }, 6.7);
    loop.to(bundle, { autoAlpha: 0, duration: .3 }, 8.4);
  }, root);
  return {
    pause: paused => loop.paused(paused),
    stop: () => {
      context.revert();
      // Later reset keyframes also touch these shared cards: restore their exact entry poses.
      cards.forEach((card, i) => gsap.set(card, originalPoses[i]));
    },
  };
};
