(() => {
  "use strict";
  const translations = window.vpasteCopy;
  if (!translations) return; // Keep the static document readable if the copy script fails to load.
  const root = document.documentElement;
  const languageLinks = [...document.querySelectorAll("[data-language-button]")];
  const platformButtons = [...document.querySelectorAll("[data-platform-button]")];
  const translate = (scope) => {
    const dictionary = translations[root.dataset.language];
    for (const [attribute, target] of [["data-i18n", null], ["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"]]) {
      scope.querySelectorAll(`[${attribute}]`).forEach(element => {
        const value = dictionary[element.getAttribute(attribute)];
        if (value) { if (target) element.setAttribute(target, value); else element.textContent = value; }
      });
    }
  };
  const productSource = image => `/assets/product/${image.dataset.productImage}-${root.dataset.language}.webp`;
  const loadProductImages = (scope) => scope.querySelectorAll("img[data-product-image]").forEach(image => { image.src = productSource(image); });
  const updateProductImages = () => document.querySelectorAll("img[data-product-image][src]").forEach(image => { image.src = productSource(image); });
  const setLanguage = (language) => {
    root.lang = language === "zh" ? "zh-CN" : "en";
    root.dataset.language = language;
    const dictionary = translations[language];
    document.title = dictionary["meta.title"];
    document.querySelector('meta[name="description"]').content = dictionary["meta.description"];
    document.querySelector('meta[property="og:title"]').content = dictionary["meta.title"];
    document.querySelector('meta[property="og:description"]').content = dictionary["meta.description"];
    document.querySelector('meta[property="og:locale"]').content = language === "zh" ? "zh_CN" : "en_US";
    document.querySelector('meta[property="og:locale:alternate"]').content = language === "zh" ? "en_US" : "zh_CN";
    const canonical = "https://vpaste.app" + location.pathname.replace(/index\.html$/, "");
    document.querySelector('link[rel="canonical"]').href = canonical;
    document.querySelector('meta[property="og:url"]').content = canonical;
    document.querySelector('meta[property="og:image:alt"]').content = dictionary["alt.main"];
    const schema = document.querySelector('script[type="application/ld+json"]');
    const application = JSON.parse(schema.textContent);
    schema.textContent = JSON.stringify({ ...application, url: canonical, inLanguage: root.lang, description: dictionary["meta.description"] });
    translate(document);
    languageLinks.forEach(link => {
      if (link.dataset.languageButton === language) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
      link.href = `/${link.dataset.languageButton}/${location.search}${location.hash}`;
    });
    updateProductImages();
    document.dispatchEvent(new Event("vpaste:language"));
  };
  languageLinks.forEach(link => link.addEventListener("click", event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const language = link.dataset.languageButton;
    history.replaceState(null, "", `/${language}/${location.search}${location.hash}`);
    try { localStorage.setItem("vpaste.website.language.v2", language); } catch { /* Storage is optional. */ }
    setLanguage(language);
  }));
  let preferred = root.dataset.language;
  if (location.pathname === "/" || location.pathname === "/index.html") {
    let stored = null;
    try { stored = localStorage.getItem("vpaste.website.language.v2"); } catch { /* Storage is optional. */ }
    preferred = translations[stored] ? stored : navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  }
  setLanguage(preferred);

  const setPlatform = (platform, animate = true) => {
    const next = platform === "macos" ? "macos" : "windows";
    root.dataset.platform = next;
    document.querySelectorAll("[data-platform-shortcut]").forEach(element => { element.textContent = next === "macos" ? "Option + V" : "Alt + V"; });
    platformButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.platformButton === next)));
    const desktop = document.querySelector("[data-platform-desktop]");
    if (animate && window.gsap && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(desktop, { scale: .992, autoAlpha: .76 }, { scale: 1, autoAlpha: 1, duration: .42, ease: "power2.out", overwrite: "auto", clearProps: "transform,opacity,visibility" });
    }
  };
  const reported = navigator.userAgentData?.platform || navigator.platform || "";
  const ua = navigator.userAgent || "";
  const touchMac = navigator.maxTouchPoints > 1 && (/mac/i.test(reported) || /ipad|iphone|ipod/i.test(ua));
  const platform = /windows|win32|win64/i.test(reported + ua) ? "windows" : !touchMac && /macos|macintosh|macintel|mac os x/i.test(reported + ua) ? "macos" : "windows";
  platformButtons.forEach(button => button.addEventListener("click", () => setPlatform(button.dataset.platformButton)));
  setPlatform(platform, false);

  // Desktop captures load on scene entry; reading-mode captures load near the viewport.
  const imageObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting && !document.body.classList.contains("story-motion")) loadProductImages(entry.target);
  }), { rootMargin: "250px" });
  document.querySelectorAll(".settings-sheet, .feature-art:has([data-product-image])").forEach(element => imageObserver.observe(element));
  document.querySelectorAll("[data-feature-jump]").forEach(button => button.addEventListener("click", () => {
    if (!document.body.classList.contains("story-motion")) {
      document.getElementById(button.getAttribute("aria-controls")).scrollIntoView({ behavior: "auto", block: "center" });
    }
  }));
  window.vpasteSite = { translate, loadProductImages };
  root.dataset.enhanced = "true";
})();
