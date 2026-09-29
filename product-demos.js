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
  cards.forEach((card, index) => {
    const badge = document.createElement("span");
    badge.className = "demo-queue-badge";
    badge.textContent = String(index === 0 ? 1 : index === 2 ? 2 : 3);
    card.append(badge);
  });
  const overlays = document.createElement("div");
  overlays.className = "product-overlays";
  overlays.innerHTML = `
    <div class="demo-format-note">${icon("text-cursor-input")}${tr("demo.keepFormat")}<kbd>Ctrl / ⌘ + Shift + V</kbd>${tr("demo.plainText")}</div>
    <div class="demo-spotlight" aria-hidden="true"></div>
    <div class="demo-keypress"><kbd>Space</kbd>${tr("demo.spacePreview")}</div>
    <div class="demo-preview-window" aria-hidden="true">
      <div class="demo-window-title">${icon("scan-eye")}${tr("product.previewTitle")}<span>×</span></div>
      <div class="demo-preview-image"><img src="assets/format-stack.png" alt="" loading="lazy" /><small>1200 × 800</small></div>
      <div class="demo-preview-link"><div class="demo-url">github.com/Loxonl/vPaste-desktop</div><div class="demo-readme"><img src="assets/vpaste-logo.png" width="45" height="45" alt="" /><h3>vPaste</h3>${tr("product.textDescription", "p")}<div>Windows / macOS <span>GPL-3.0</span></div><hr />${tr("demo.readme", "p")}</div></div>
    </div>
    <div class="demo-receiver" aria-hidden="true">
      <div class="demo-window-title">${icon("file")}${tr("demo.workNote")}<span>− &nbsp; □ &nbsp; ×</span></div>
      <div class="demo-note"><h3 data-i18n="demo.projectNote"></h3><div class="demo-paste-rows"><p>vPaste</p><p>github.com/Loxonl/vPaste-desktop</p><p>vPaste Intro.pdf</p></div><div class="demo-dropzone">${icon("image")}${tr("demo.dropHere")}<img src="assets/format-stack.png" alt="" loading="lazy" /></div></div>
    </div>
    <div class="demo-queue-status">${icon("list-ordered")}${tr("usecases.queue")}<b>3</b><kbd>Ctrl / ⌘ + V</kbd></div>
    <img class="demo-drag-ghost" src="assets/format-stack.png" alt="" loading="lazy" />
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
    cards.forEach(card => card.classList.remove("demo-selected", "demo-queued"));
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
      const rows = [...overlays.querySelectorAll(".demo-paste-rows p")];
      const receiver = overlays.querySelector(".demo-receiver");
      const select = selected => cards.forEach((card, i) => card.classList.toggle("demo-selected", i === selected));
      loop = gsap.timeline({ repeat: -1, repeatDelay: .7, defaults: { ease: "sine.inOut" } });
      if (index === 0) {
        loop.to(rail, { x: -45, duration: 2.2 }, .6).to(rail, { x: 0, duration: 2.2 }, 4.2);
      } else if (index === 1) {
        select(5);
        loop.to(cards[5], { y: -16, scale: 1.06, duration: .75 }, .3).to(cards[5], { y: 0, scale: 1, duration: .75 }, 3.8);
      } else if (index === 2) {
        const spotlight = overlays.querySelector(".demo-spotlight");
        // These are the real type tabs and original records, not a second filter mockup.
        [[2, [0, 5]], [3, [1]], [4, [2]]].forEach(([tabIndex, visible], phase) => {
          const at = phase * 2.6;
          const tab = tabs[tabIndex];
          loop.call(() => tabs.forEach((item, i) => item.classList.toggle("demo-tab-active", i === tabIndex)), [], at);
          loop.to(spotlight, { x: tab.offsetLeft - 4, width: tab.offsetWidth + 8, duration: .5 }, at);
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
        [0, 2, 3].forEach(i => cards[i].classList.add("demo-queued"));
        const count = overlays.querySelector(".demo-queue-status b");
        const pasteKey = overlays.querySelector(".demo-queue-status kbd");
        gsap.set(rows, { autoAlpha: 0, y: 10 });
        loop.set(count, { textContent: "3" }, 0);
        [0, 2, 3].forEach((cardIndex, i) => {
          const at = .5 + i * 1.6;
          loop.call(() => select(cardIndex), [], at);
          loop.to(pasteKey, { y: 3, backgroundColor: "#c8dfef", duration: .14 }, at + .25);
          loop.to(pasteKey, { y: 0, backgroundColor: "#ffffff", duration: .2 }, at + .42);
          loop.to(rows[i], { autoAlpha: 1, y: 0, duration: .45 }, at + .4);
          loop.set(count, { textContent: String(2 - i) }, at + .7);
          loop.to(cards[cardIndex].querySelector(".demo-queue-badge"), { scale: 0, duration: .25 }, at + .7);
        });
        loop.to({}, { duration: 1.8 });
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
    destroy: () => { restore(); overlays.remove(); search.remove(); continuation.remove(); cards.forEach(card => card.querySelector(".demo-queue-badge").remove()); },
  };
};

window.createLocalHistoryLoop = (root) => {
  let loop;
  const context = gsap.context(() => {
    const packets = root.querySelectorAll(".local-record");
    const bundle = root.querySelector(".migration-bundle");
    const saved = root.querySelectorAll(".stored-record");
    loop = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: "sine.inOut" } });
    gsap.set(packets, { x: -65, y: -75, autoAlpha: 0 });
    gsap.set(bundle, { x: 0, autoAlpha: 0 });
    gsap.set(saved, { scaleX: 0, transformOrigin: "0 50%" });
    packets.forEach((packet, i) => {
      loop.fromTo(packet, { x: -65, y: -75, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: .65 }, i * .9);
      loop.to(packet, { y: 65, autoAlpha: 0, duration: .45 }, i * .9 + .65);
      loop.to(saved[i], { scaleX: 1, duration: .35 }, i * .9 + .8);
    });
    loop.to(bundle, { autoAlpha: 1, duration: .2 }, 3.6);
    loop.to(bundle, { x: 360, duration: 1.6 }, 3.9);
    loop.to(root.querySelector(".local-device--mac"), { borderColor: "#386c8c", duration: .3 }, 5.3);
    loop.to({}, { duration: 1.1 });
    loop.to(bundle, { x: 0, duration: 1.6 }, 6.7);
    loop.to(bundle, { autoAlpha: 0, duration: .3 }, 8.4);
  }, root);
  return { pause: paused => loop.paused(paused), stop: () => context.revert() };
};
