# vPaste 宣传视频

后续编辑统一使用 `E:/Coding/vPaste/vPaste-website`，先读 [媒体工程交接](../MEDIA-HANDOFF.md) 和 [AGENTS.md](AGENTS.md)。C 盘只保留对话工作树骨架，其媒体副本已归档到 E 盘；当前对话也应在 E 盘读写。

用户于 **2026-10-05** 确认中文、英文两支 1440p 视频为最终发布版，并于 **2026-10-08** 要求增加品牌首帧、缩短片尾。唯一发布入口是 **[final/README.md](final/README.md)**；不要从旧文件名中的 `final`、`refined-v3` 或修改时间推断最终版本。

| 最终文件 | 用途 |
| --- | --- |
| [vpaste-40s-1440p-zh.mp4](final/vpaste-40s-1440p-zh.mp4) | 中文发布版，含品牌首帧 |
| [vpaste-40s-1440p-en.mp4](final/vpaste-40s-1440p-en.mp4) | 英文发布版，含品牌首帧 |
| [vpaste-cover-1440p.png](final/vpaste-cover-1440p.png) | 两版共用封面，取自 0 秒 / 第 0 帧 |

两支视频均为 2560×1440、16:9、30 fps、40 秒，H.264 + AAC。第一秒完整静止展示 Logo、vPaste 和 vpaste.app，随后向上滑出并接入原开场；功能演示整体后移 1.2 秒，片尾缩短为 1.3 秒。最新文件大小、校验值与检查记录位于最终目录。未上传到 GitHub 或 YouTube。

## 工程与复现

- [1440-DELIVERY.md](1440-DELIVERY.md)：英文脚本、排版自查、导出参数和验收记录。
- [REVISED-STORYBOARD.md](REVISED-STORYBOARD.md)：最终分镜、时间轴、按键与封面说明。
- [AGENTS.md](AGENTS.md)：供后续 AI 对话读取的版本规则。
- `src/revised-index.tsx`：当前工程入口；`src/RevisedPromo.tsx`：画面与动效。
- `src/revised-timeline.ts`、`src/revised-copy.ts`：时间轴和双语文案。
- `src/revised-keypresses.json`：统一的按键与音效事件。
- `src/revised-timing.json`：新增品牌开屏、过渡与演示偏移；画面和音效共用。

在 `video-demo/` 中运行；已安装依赖时可跳过 `npm ci`：

```powershell
npm ci
npm run check:1440
# 检查两种语言的关键帧后再导出
npm run render:1440
```

`src/generated/website.ts` 是已确认并纳入 Git 的卡片样式快照。普通视频修改保留该快照；只有明确需要从最新官网刷新视觉素材时才运行 `npm run prepare:revised`，并重新复核双语。

新生成的视频、封面和关键帧进入 `out/revised-1440/zh/` 与 `out/revised-1440/en/`，属于工作输出，不会覆盖 `final/`。`npm run studio:revised` 可预览编辑；1440p 合成为 `Vpaste40s-1440-zh` 与 `Vpaste40s-1440-en`。使用 Remotion 配套的无头浏览器；检查封面需要 PATH 中的 FFmpeg。中文字体与原工程一致，换环境后需要复查换行。

## 历史归档与保留范围

旧 1080p 成片、预览片、检查截图和旧说明已移到 [archive/2026-10-05/](archive/2026-10-05/README.md)。增加品牌开屏前的两支 1440p 成片与改动前源码保存在 [archive/2026-10-08/](archive/2026-10-08/README.md)，没有删除；[归档索引](archive/README.md) 说明其用途。`out/` 留作后续临时导出目录。

为保留可编辑工程，`src/`、`scripts/`、`public/promo/` 与依赖保持原位。`src/index.ts` 以及 `render`、`render:promo`、`render:variants`、`render:revision3` 等命令属于早期实验；`render:revised` 为旧 1080p 输出，均不是本次最终发布入口。

成片、生成素材、依赖和历史归档为本地文件，受 Git 忽略规则管理；仅提交文档不会备份这些媒体。长期备份应包含 `final/` 和可编辑工程及其素材。
