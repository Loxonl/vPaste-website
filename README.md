# vPaste website

最终官网采用「电光白」配色、C 版图标背景和 E 版页面结构，保留连续的产品窗口动效。网站仍是可直接部署至 GitHub Pages 的静态文件，没有线上 Node 服务、远程字体或前端框架依赖

## 修改与生成

- `src/page.html`：最终页面结构与真实产品示意组件
- `site-copy.js`：中英文文案的唯一来源
- `site.js`：语言、平台识别与按需图片加载
- `motion-concepts.js`、`product-demos.js`：连续转场与功能演示
- `site-theme.css`、`site-background.css`、`site-background.js`：最终品牌配色、布局和图标背景
- `index.html`、`en/index.html`、`zh/index.html`：生成后的完整静态页面，不直接编辑

安装开发工具后生成页面：

```sh
npm ci
# Windows 使用已安装的 Microsoft Edge；其他平台首次安装 Chromium
npx playwright install chromium
npm run build
```

修改结构或文案后需要重新执行 `npm run build`，并将三份生成页面一起提交。默认入口会按浏览器语言/用户偏好展示；`/en/` 与 `/zh/` 是固定语言入口，包含各自的标题、描述、canonical、hreflang 和结构化数据。关闭 JavaScript 后也能阅读完整内容

## 预览和验证

在仓库根目录启动一个仅监听本机的静态服务器，保持终端运行：

```sh
python -m http.server 8765 --bind 127.0.0.1
```

另开终端执行：

```sh
npm test
```

可通过 `SITE_URL` 指向其他本地测试端口。测试覆盖最终配色、17 个完整动画停靠点、七个功能演示、五种内容格式、中文/英文、375/768/1280/1440 宽度、减少动态效果、无 JavaScript、按需加载和平台识别。截图与资源清单输出至忽略的 `test-results/`

Windows 上使用 Edge；其他系统使用 Playwright Chromium。Mac 平台识别测试是 Chromium 模拟，不等于已完成 macOS Safari 或真实触控板测试

搜索与预览演示按客户端 `054def6` 的 `src/clipboard/Clipboard.module.css`、`Preview.tsx`、`Preview.module.css` 和 `src/ui/tokens.css` 核对：搜索按钮后间隔 7px、输入框 276×32px，展开时推动标签；预览为无标题栏的独立窗口，含右上角固定按钮、图片内容区或链接地址栏与网页内容区。官网按舞台空间缩放展示，链接文档使用公开的示意内容，不访问用户的历史记录。`tests/product-window-fidelity.cjs` 验证几何关系、窗口结构及响应式清理

## 图片与性能

```sh
npm run assets:optimize
# 预览服务器运行时，从实际最终首页生成分享封面
npm run assets:cover
```

保留原始 PNG 作为素材来源，官网使用小尺寸 WebP；设置/搜索截图按当前语言在需要时加载。分享封面为 1200×630 的实页截图，不在首屏请求。没有引入新的 AI 图片或字体下载

小于 1100px 宽或 720px 高的窗口，以及系统选择减少动态效果时，自动使用自然滚动阅读，避免将整个动效舞台缩到难以阅读

## 字号规范

宣传文字统一由 `site-theme.css` 的字号角色管理，按屏幕上实际显示的大小验收，而不是动画画布缩放前的 CSS 数值

| 角色 | 基准字号 | 用途 |
| --- | --- | --- |
| 正文 | 16px / 1rem | 主要介绍、功能描述、内容格式说明 |
| 标签与紧凑说明 | 14px / 0.875rem | 下载/源码按钮、七项功能列表、平台与格式切换、设置明细、隐私短句 |
| 辅助说明 | 12px / 0.75rem | 章节引导、支持平台、状态、页脚与迁移示意标签 |

主要正文行高 1.65，紧凑标签与说明行高 1.5；下载/源码、功能列表、平台和格式切换按钮至少 44px 高。动画舞台缩小时对宣传文字和点击高度进行反向补偿，真实应用卡片和设置截图保持原有比例。字号使用 rem，兼容浏览器默认字体大小；小屏幕、减少动态效果和浏览器放大导致可用宽度不足时使用自然阅读布局

参考 [USWDS 排版指南](https://designsystem.digital.gov/components/typography/) 对正文至少 16px 实际字号的建议，借鉴 [Material Design 字号角色](https://api.flutter.dev/flutter/material/TextTheme-class.html) 的 16/14/12 分级，并参考 [WCAG 2.2 文字缩放说明](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) 的 200% 缩放要求。14px 标签和 12px 辅助说明是本站的角色选择，不是 WCAG 规定的最低字号

## 历史实验

`background-studies.*`、`brand-palettes.*`、`palette-studies.html`、`visual-experiments/` 保留用于历史设计参考，不参与最终首页运行。旧的实验查询参数不会切换最终首页设计

`npm test` 只运行最终版的当前验收测试，其余早期实验脚本不是当前布局的验收标准

## 发布边界

此次优化不修改仓库可见性、项目下载/源码链接或开源声明，也不自动发布。发布时保持 `CNAME` 为 `vpaste.app`，包含根目录、`en/`、`zh/`、`assets/`、样式/脚本以及 `robots.txt` 和 `sitemap.xml`
