// Generate static, crawlable pages from one template and the shared copy dictionary.
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const copy = require("../site-copy.js");
const root = path.resolve(__dirname, "..");

(async () => {
  const browser = await chromium.launch({ ...(process.platform === "win32" ? { channel: "msedge" } : {}), headless: true });
  try {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.route("**/*", route => route.abort());
    const template = fs.readFileSync(path.join(root, "src/page.html"), "utf8");
    for (const [language, route] of [["en", ""], ["en", "en"], ["zh", "zh"]]) {
      await page.setContent(template, { waitUntil: "domcontentloaded" });
      const html = await page.evaluate(({ dictionary, language, route }) => {
        const canonical = `https://vpaste.app/${route ? route + "/" : ""}`;
        document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
        document.documentElement.dataset.language = language;
        for (const [attribute, target] of [["data-i18n", null], ["data-i18n-alt", "alt"], ["data-i18n-aria", "aria-label"]]) {
          document.querySelectorAll(`[${attribute}]`).forEach(element => {
            const value = dictionary[element.getAttribute(attribute)];
            if (!value) throw new Error(`Missing copy: ${element.getAttribute(attribute)}`);
            if (target) element.setAttribute(target, value); else element.textContent = value;
          });
        }
        document.title = dictionary["meta.title"];
        const meta = (name, content, property = false) => {
          const attribute = property ? "property" : "name";
          let node = document.head.querySelector(`meta[${attribute}="${name}"]`);
          if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, name); document.head.append(node); }
          node.content = content;
        };
        meta("description", dictionary["meta.description"]);
        meta("og:title", dictionary["meta.title"], true);
        meta("og:description", dictionary["meta.description"], true);
        meta("og:url", canonical, true);
        meta("og:site_name", "vPaste", true);
        meta("og:locale", language === "zh" ? "zh_CN" : "en_US", true);
        meta("og:locale:alternate", language === "zh" ? "en_US" : "zh_CN", true);
        meta("og:image", "https://vpaste.app/assets/share-cover.jpg", true);
        meta("og:image:width", "1200", true);
        meta("og:image:height", "630", true);
        meta("og:image:alt", dictionary["alt.main"], true);
        meta("twitter:image", "https://vpaste.app/assets/share-cover.jpg");
        const link = (rel, href, language) => {
          const node = document.createElement("link"); node.rel = rel; node.href = href;
          if (language) node.hreflang = language;
          document.head.append(node);
        };
        link("canonical", canonical);
        link("alternate", "https://vpaste.app/en/", "en");
        link("alternate", "https://vpaste.app/zh/", "zh-CN");
        link("alternate", "https://vpaste.app/", "x-default");
        const schema = document.createElement("script");
        schema.type = "application/ld+json";
        schema.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "vPaste", url: canonical, operatingSystem: "Windows, macOS", applicationCategory: "UtilitiesApplication", description: dictionary["meta.description"], inLanguage: document.documentElement.lang, image: "https://vpaste.app/assets/share-cover.jpg" });
        document.head.append(schema);
        document.querySelector('link[rel="icon"]').href = "/assets/favicon.png";
        document.querySelectorAll("[data-language-button]").forEach(link => {
          link.removeAttribute("aria-pressed");
          if (link.dataset.languageButton === language) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
        // Reading/mobile mode keeps the same product UI, without the desktop's shared actor.
        const desktopWindow = document.createElement("div");
        desktopWindow.className = "desktop-reading-window";
        const product = document.querySelector(".story-product").cloneNode(true);
        product.classList.remove("story-product");
        product.classList.add("reading-product");
        desktopWindow.append(product);
        document.querySelector(".shortcut-desktop").append(desktopWindow);
        const localCards = document.createElement("div");
        localCards.className = "local-reading-cards";
        localCards.setAttribute("aria-hidden", "true");
        document.querySelectorAll(".story-product .vp-clip-card").forEach(card => localCards.append(card.cloneNode(true)));
        document.querySelector(".data-visual").prepend(localCards);
        document.querySelectorAll("img[src]").forEach(image => {
          const src = image.getAttribute("src");
          if (src === "/assets/format-stack.png") {
            image.src = "/assets/format-stack-small.webp";
            image.srcset = "/assets/format-stack-small.webp 480w, /assets/format-stack.webp 960w";
            image.sizes = "180px";
            image.width = 480; image.height = 320;
          }
          if (src === "/assets/vpaste-logo.png") image.src = "/assets/vpaste-logo.webp";
          if (/\/assets\/apps\/(chrome|wechat|explorer|figma)\.png$/.test(src)) image.src = src.replace(/\.png$/, ".webp");
          image.decoding = "async";
        });
        document.querySelectorAll("img[data-product-image]").forEach(image => {
          image.src = `/assets/product/${image.dataset.productImage}-${language}.webp`;
          image.loading = "lazy";
          const fallback = document.createElement("noscript");
          const fallbackImage = image.cloneNode();
          fallbackImage.removeAttribute("data-product-image");
          fallback.append(fallbackImage);
          image.after(fallback);
          image.removeAttribute("src");
          image.classList.add("deferred-image");
        });
        return "<!doctype html>\n" + document.documentElement.outerHTML;
      }, { dictionary: copy[language], language, route });
      const directory = path.join(root, route);
      fs.mkdirSync(directory, { recursive: true });
      fs.writeFileSync(path.join(directory, "index.html"), html.replace(/>\s*</g, ">\n<") + "\n");
      console.log(`Built /${route ? route + "/" : ""} (${language})`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
