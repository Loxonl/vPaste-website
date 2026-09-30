// Re-encode the existing artwork without generating or redrawing its contents.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require(process.env.SHARP_MODULE || "sharp");
const root = path.resolve(__dirname, "../assets");
(async () => {
  const convert = async (source, target, width, quality) => {
    const output = path.join(root, target);
    await sharp(path.join(root, source)).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output);
    console.log(target, fs.statSync(output).size);
  };
  await convert("format-stack.png", "format-stack-small.webp", 480, 80);
  await convert("format-stack.png", "format-stack.webp", 960, 84);
  await convert("vpaste-logo.png", "vpaste-logo.webp", 256, 90);
  await sharp(path.join(root, "vpaste-logo.png")).resize(32, 32).png().toFile(path.join(root, "favicon.png"));
  for (const app of ["chrome", "wechat", "explorer", "figma"]) await convert(`apps/${app}.png`, `apps/${app}.webp`, 96, 90);
  for (const language of ["en", "zh"]) {
    await convert(`product/settings-theme-${language}.png`, `product/settings-theme-${language}.webp`, 1230, 92);
    await convert(`product/search-${language}.png`, `product/search-${language}.webp`, 1560, 92);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
