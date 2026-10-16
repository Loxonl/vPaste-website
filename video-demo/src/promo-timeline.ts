export const promoFps = 30;
export const promoDuration = 40;
// Seconds; the ordering follows the live website, including all seven demos.
export const scenes = [
  {from: 0, to: 4, chapter: 0, label: '每次复制，都清晰可见', title: '剪贴捷径，\n一键即达。', detail: '你的可视化剪贴板管理器'},
  {from: 4, to: 7, chapter: 0, label: '从任意应用，一键呼出', title: '快捷呼出。\n直接粘贴。', detail: '选取内容，回到你的工作流'},
  {from: 7, to: 9.5, chapter: 1, label: '可视化剪贴历史', title: '复制了什么，一眼就知道。', detail: '持续记录 · 时间排序 · 保留来源'},
  {from: 9.5, to: 11.5, chapter: 1, label: '保留原有格式', title: '格式，按你需要。', detail: '标题、列表与表格 · 也能粘贴为纯文本'},
  {from: 11.5, to: 13.5, chapter: 1, label: '分类、标签与收藏', title: '常用内容，随手归位。', detail: '按类型筛选，用标签和收藏整理'},
  {from: 13.5, to: 16, chapter: 1, label: '搜索历史记录', title: '记得一点，就能找到。', detail: '正文 · 网页标题 · 文件路径 · 来源应用'},
  {from: 16, to: 18, chapter: 1, label: '粘贴前先预览', title: '先看清，再粘贴。', detail: '按下 Space，展开完整内容'},
  {from: 18, to: 20, chapter: 1, label: '粘贴队列', title: '依次复制。顺序填入。', detail: 'Ctrl / ⌘ + V，逐项完成表单'},
  {from: 20, to: 22, chapter: 1, label: '跨应用拖拽', title: '拖过去，就到位。', detail: '把图片、文本与文件，拖入支持的应用'},
  {from: 22, to: 28, chapter: 2, label: '五种内容，各有其位', title: '不止文字。', detail: '不同内容，自有合适的卡片'},
  {from: 28, to: 31, chapter: 3, label: '按你的习惯工作', title: '调成你\n顺手的样子。', detail: '主题 · 语言 · 快捷键 · 历史管理'},
  {from: 31, to: 35, chapter: 4, label: '本机存储，数据自主', title: '记录留在本机。', detail: '剪贴历史不上传服务器'},
  {from: 35, to: 40, chapter: 5, label: '开源，也让承诺可核验', title: '从代码到安全策略，\n全程公开。', detail: 'GPL-3.0 开源 · Windows + macOS'},
] as const;
