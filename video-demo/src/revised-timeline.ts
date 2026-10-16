export const revisedFps = 30;
export const revisedDuration = 40;
export const coverTime = 0;
// Scene times are local to the original demonstration; revised-timing.json
// adds the opening offset to both visuals and sound effects.
export const revisedScenes = [
  {from: 0, to: 2.8, title: '剪贴捷径，一键即达', detail: 'vPaste · Windows / macOS 剪贴板管理器'},
  {from: 2.8, to: 5, title: '复制了什么，一眼就知道', detail: '自动保存复制历史，显示内容、时间和来源'},
  {from: 5, to: 9, title: '支持五种剪贴内容', detail: '文本 · 图片 · 链接 · 文件 · 颜色'},
  {from: 9, to: 12.3, title: '保留原有格式', detail: '保留文本、标题与表格结构，也可粘贴为纯文本'},
  {from: 12.3, to: 15.3, title: '分类、标签与收藏', detail: '按内容类型筛选，用标签和收藏整理常用内容'},
  {from: 15.3, to: 18.5, title: '搜索历史记录', detail: '搜索正文、网页标题、文件路径或来源应用'},
  {from: 18.5, to: 22.5, title: '粘贴前先预览', detail: '查看大图与完整内容'},
  {from: 22.5, to: 26.5, title: '粘贴队列', detail: '依次复制，按顺序填入多个字段'},
  {from: 26.5, to: 29.5, title: '跨应用拖拽', detail: '把文本、图片与文件直接拖入支持的应用'},
  {from: 29.5, to: 31.5, title: '按习惯设置', detail: '主题、语言、快捷键与历史管理'},
  {from: 31.5, to: 37.5, title: '本机存储，支持跨平台迁移', detail: '剪贴历史留在本机 · Windows ↔ macOS 手动迁移'},
  {from: 37.5, to: 40, title: 'vPaste', detail: ''},
] as const;

// Short, sentence-case headlines keep the same timing and single-line layout.
export const revisedEnglishScenes = [
  {title: 'Your clipboard, one shortcut away', detail: 'vPaste · Clipboard manager for Windows and macOS'},
  {title: 'Your history at a glance', detail: 'Every copy saved, with its content, time and source'},
  {title: 'Five types of clipboard content', detail: 'Text · Images · Links · Files · Colors'},
  {title: 'Keep the original formatting', detail: 'Preserve headings and tables, or paste as plain text'},
  {title: 'Filter, tag and favorite', detail: 'Filter by type. Organize with tags and favorites'},
  {title: 'Search your clipboard history', detail: 'Find text, page titles, file paths or source apps'},
  {title: 'Preview before you paste', detail: 'See full-size images and complete content'},
  {title: 'Paste queue', detail: 'Copy in sequence. Paste into each field in order'},
  {title: 'Drag and drop across apps', detail: 'Drag text, images and files into supported apps'},
  {title: 'Make it yours', detail: 'Themes, language, shortcuts and history settings'},
  {title: 'Local history, cross-platform transfer', detail: 'Stored on your device · Manually transfer between Windows and macOS'},
  {title: 'vPaste', detail: ''},
] as const satisfies readonly {title: string; detail: string}[];
