# vPaste 媒体工程交接

迁移日期：2026-10-16。视频、横幅、Social preview 的后续编辑统一使用 **`E:/Coding/vPaste/vPaste-website`**。C 盘的 `C:/Users/lxlx5/.codex/worktrees/9510/vPaste-website` 保留作历史副本；聊天仍绑定旧工作树时，也应显式在 E 盘读写。

## 当前最终文件

| 内容 | 发布/上传文件 | 状态 |
| --- | --- | --- |
| 中文视频 | `video-demo/final/vpaste-40s-1440p-zh.mp4` | 40 秒，2560×1440，30 fps |
| 英文视频 | `video-demo/final/vpaste-40s-1440p-en.mp4` | 同上，含英文产品界面 |
| 视频封面 | `video-demo/final/vpaste-cover-1440p.png` | 取自 0 秒，Logo、名称和网址 |
| 中文 README 横幅 | `assets/readme-banner-zh.png` | 1800×600，修订 4 |
| 英文 README 横幅 | `assets/readme-banner-en.png` | 同上 |
| GitHub Social preview | `assets/github-social-preview.png` | 1280×640，独立于 README 横幅 |

视频的权威清单、大小和校验值在 `video-demo/final/manifest.json` 与 `SHA256SUMS.txt`；横幅说明在 `assets/readme-banners.md`。只根据这些清单选择最终文件，不根据旧文件名中的 final、v3 或修改时间判断。

## 继承的视觉与脚本要求

- 视频基于用户确认的 40 秒双语 1440p 版本。2026-10-08 加入品牌开屏：0–1 秒完整静止，1–2 秒向上退出，原演示从下方衔接；功能演示与声音整体偏移 1.2 秒。片尾 38.7–40 秒，39.3 秒后静止。首尾只展示 Logo、vPaste 和高亮网址 vpaste.app。
- 使用原始 Logo `assets/vpaste-logo-master.svg`，保持等比；主窗口正向展示，完整内容不裁切。标题放主体上方；交互按键与音效保持一致。
- 保留 Emoji 分类、真实设置和粘贴队列按钮。保留格式展示两张文本卡；分类按从前到后点击；搜索完成输入后才出现结果；Space 按键后才打开居中预览。队列与拖拽需要足够观看时间，Windows/macOS 本地存储与迁移展示完整。
- README 横幅最新选择是“真实客户端标签栏和按钮 + 官网宣传卡片”，不是全原生截图，也不是生成式重绘 UI。Logo、名称、单行简述保留；外部 slogan 与网址移除。卡片保持 168:184 比例，三列表格完整可见。参考原生截图、宣传卡片渲染与制作脚本均在 `assets/readme-source/`。

## 视频编辑入口

1. 先读 `video-demo/AGENTS.md`、`README.md`、`REVISED-STORYBOARD.md` 与 `1440-DELIVERY.md`。
2. `video-demo/src/revised-index.tsx` 是当前入口；`RevisedPromo.tsx` 控制画面；`revised-timeline.ts` 控制分镜；`revised-copy.ts` 控制双语文案；`revised-keypresses.json` 和 `revised-timing.json` 控制交互与统一偏移。
3. `video-demo/src/generated/website.ts` 是已确认的卡片/CSS 快照，现纳入 Git。普通文案、时间与动效修改保留该快照。`prepare:revised` 会从最新官网刷新它，只有明确需要同步官网视觉时才执行并复核双语。
4. 在 `video-demo/` 运行 `npm ci`（依赖缺失时）、`npm run check:1440`，检查双语关键帧后再 `npm run render:1440`。需要可执行的 FFmpeg；渲染输出进入忽略的 `out/`。当前入口使用 Remotion 配套的无头浏览器，避免系统 Edge 更新造成启动失败；首次使用可能下载该浏览器。不同浏览器版本的文字边缘栅格化可能略有差异，原有最终 MP4 本次保持字节一致。
5. 用户确认更新最终文件后再替换 `final/` 成片并更新 manifest、校验值与说明。当前迁移保留原始成片，不重新压制。

横幅复现：在仓库根目录运行 `node assets/readme-source/render-promo-cards.cjs`，再运行 `node assets/readme-source/build-banners.cjs`；需要时用 `PLAYWRIGHT_MODULE`、`SHARP_MODULE` 指向根目录安装的依赖。原生工具栏和独立的 `header-*.png` 均为已保存的输入，不依赖历史归档。

## Git 与官网发布边界

- 视频源码、依赖锁、脚本、已确认的卡片快照、最终清单与制作说明纳入 Git。
- MP4、视频封面、音频/生成素材、渲染输出、缓存、依赖与历史归档留在 E 盘本地，由忽略规则排除。Git checkout 不能替代这些本地媒体文件的备份。
- GitHub Pages 当前发布来源是 `main` 根目录。`_config.yml` 排除 `video-demo/`、`assets/readme-source/`、`assets/archive/` 和本文件；官网页面不新增视频展示或下载入口。
- 迁移只整合媒体内容与上述配置，不覆盖主线已更新的官网、下载链接或版本清单，也不提交无关的背景实验改动。

## 迁移备份与继续对话

E 盘原有旧工程备份在 `E:/Coding/vPaste/_local-media-backups/2026-10-16/previous-e-video-demo/`。同目录的 `primary-before.json` 保存迁移前关键文件校验值；`migration-verification.json` 保存迁移校验结果。原 C 盘文件仍保留。

当前对话可以继续，所有媒体读写使用上面的 E 盘目录。新开对话时也可直接使用这句话：

> 请在 E:/Coding/vPaste/vPaste-website 继续维护 vPaste 宣传视频及横幅。先阅读 MEDIA-HANDOFF.md 和 video-demo/AGENTS.md，以清单中的最终文件与已确认脚本为基线，再按我的新要求迭代。
