(() => {
  "use strict";
  // The selected artwork is in the HTML; only its chapter poses need JavaScript.
  window.createBackgroundStudy = () => {
    const backdrop = document.querySelector(".study-backdrop");
    const nodes = [...backdrop.querySelectorAll("[data-bg-motion]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let state = { progress: 0, chapter: 0 };
    let animation;
    const go = ({ progress, chapter, duration = 0 }) => {
      state = { progress, chapter };
      animation?.kill();
      const poses = [
        { x: -progress * 1920, y: Math.sin(progress * Math.PI * 2) * 32 },
        { x: progress * 80, y: progress * 130, rotation: progress * -12, svgOrigin: "1340 60" },
      ];
      if (window.gsap) {
        animation = gsap.timeline({ defaults: { duration: reduced.matches ? 0 : duration, ease: "sine.inOut" } });
        nodes.forEach((node, i) => animation.to(node, poses[i], 0));
      }
      backdrop.querySelectorAll("[data-bg-chapter]").forEach((node, i) => { node.style.opacity = i === chapter ? ".2" : ".075"; });
      backdrop.dataset.progress = String(progress);
    };
    reduced.addEventListener("change", () => go(state));
    document.addEventListener("visibilitychange", () => { if (document.hidden) animation?.progress(1); });
    go(state);
    return { go, settle: () => go(state) };
  };
})();
