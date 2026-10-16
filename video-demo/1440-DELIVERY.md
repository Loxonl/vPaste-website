# 1440p 中文与英文交付

**2026-10-08：按用户要求增加首帧品牌开屏。** 基于 2026-10-05 确认版，原演示整体后移 1.2 秒、片尾缩短 1.2 秒；总长不变。最终入口为 [final/](final/README.md)，下文的 `out/` 为重新生成时的工作输出目录。

以 refined-v3 为基础，两版均为 2560×1440、16:9、30 fps、40 秒（1200 帧）。分镜、卡片位置、按键事件、音效和配乐保持同一套时序。使用浏览器把原有 1920×1080 设计坐标按 4/3 倍重新栅格化，文字与 SVG 在目标尺寸渲染，不放大已有 MP4。

## 英文文案自查

标题沿用官网术语，并改写为适合短视频阅读的句子；不把手动迁移写成自动同步。分类、卡片正文与时间、富文本表格、按键提示、队列和示例地址、拖拽文档均已本地化；设置页使用仓库的 `settings-theme-en.webp` 原图。示例地址、邮编使用一组一致的英文演示数据。

| 成片时间 | 英文标题 | 英文说明 |
| --- | --- | --- |
| 1.2–4 | Your clipboard, one shortcut away | vPaste · Clipboard manager for Windows and macOS |
| 4–6.2 | Your history at a glance | Every copy saved, with its content, time and source |
| 6.2–10.2 | Five types of clipboard content | Text · Images · Links · Files · Colors |
| 10.2–13.5 | Keep the original formatting | Preserve headings and tables, or paste as plain text |
| 13.5–16.5 | Filter, tag and favorite | Filter by type. Organize with tags and favorites |
| 16.5–19.7 | Search your clipboard history | Find text, page titles, file paths or source apps |
| 19.7–23.7 | Preview before you paste | See full-size images and complete content |
| 23.7–27.7 | Paste queue | Copy in sequence. Paste into each field in order |
| 27.7–30.7 | Drag and drop across apps | Drag text, images and files into supported apps |
| 30.7–32.7 | Make it yours | Themes, language, shortcuts and history settings |
| 32.7–38.7 | Local history, cross-platform transfer | Stored on your device · Manually transfer between Windows and macOS |
| 38.7–40 | vPaste | vpaste.app |

新增 0–1 秒完整品牌开屏，1–2 秒向上滑出并衔接产品开场。上表中的 1.2 秒为原演示开始计时点，过渡期间与品牌画面重叠。

在同一浏览器字体下测量了全部英文标题、说明、分类标签、双卡标签、迁移说明和表单值。标题均保持单行：最长标题占设计宽度 1444px，可用宽度为 1760px。Favorites 分配更宽的标签空间；卡片时间简写为 Just now、4 min ago 等。英文表格保持 10.5px 的设计字号，将列宽改为 38% / 24% / 38%，横向单元格内边距改为 2px，避免单词、网址和彩色数值被拆开或底部裁切。表格高约 119px，卡片正文高 136px。

排版测量记录：[final/checks/english-layout-audit.json](final/checks/english-layout-audit.json)。英文文案及布局沿用先前验收版，本轮重新检查双语开屏、过渡及后移后的功能关键帧；具体帧数见最终媒体检查记录。原版 48 张关键帧位于 `archive/2026-10-05/outputs/revised-1440/`。

## 导出

```powershell
npm run prepare:revised
npm run check:1440
npm run render:1440
```

使用 H.264 / x264、CRF 22、slow 预设、AAC 160 kbps，直接从工程渲染发布版。两种语言通过同一组件生成。

- 最终中文：[final/vpaste-40s-1440p-zh.mp4](final/vpaste-40s-1440p-zh.mp4)。
- 最终英文：[final/vpaste-40s-1440p-en.mp4](final/vpaste-40s-1440p-en.mp4)。
- 最终共用封面：[final/vpaste-cover-1440p.png](final/vpaste-cover-1440p.png)。

以上命令重新生成时，仍输出到 `out/revised-1440/zh/` 与 `out/revised-1440/en/`，各含视频与 `vpaste-cover.png`。工作输出不自动替换最终版。

封面保持 Logo、vPaste 和高亮网址 vpaste.app。取 **0 秒 / 第 0 帧** 为封面，前 1 秒保持完整静止；片尾 39.3–40 秒再次静止展示同一画面。1–2 秒采用平滑的向上过渡。

两版的最新验收结果见 [中文检查记录](final/checks/validation-zh.json) 和 [英文检查记录](final/checks/validation-en.json)，包含完整解码与编码后首帧检查。文件大小及 SHA-256 以 [final/manifest.json](final/manifest.json) 为准。视频轨固定 40 秒，AAC 尾部填充使容器时长约为 40.04 秒。
