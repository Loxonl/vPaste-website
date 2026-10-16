export type RevisedLanguage = 'zh' | 'en';

export const revisedCopy = {
  zh: {
    types: ['文本', '图片', '链接', '文件', '颜色'],
    tabs: ['全部', '收藏', '文本', '图片', '链接', '颜色', '文件', '项目'],
    formatLabels: ['文本与标题', '表格与链接'],
    summon: '呼出窗口', search: '输入关键词', preview: '打开预览', paste: '依次粘贴',
    queue: '粘贴队列', next: '下一项', text: '文本', queueDone: '队列已粘贴完成',
    form: '收件信息', fields: ['电子邮箱', '收件地址', '邮政编码'],
    values: ['hello@example.com', '上海市 · 示例路 18 号', '200000'],
    document: '项目笔记', drop: '将图片拖入文档', migration: '↔ 手动迁移完整历史',
  },
  en: {
    types: ['Text', 'Images', 'Links', 'Files', 'Colors'],
    tabs: ['All', 'Favorites', 'Text', 'Images', 'Links', 'Colors', 'Files', 'Project'],
    formatLabels: ['Text & headings', 'Tables & links'],
    summon: 'Open vPaste', search: 'Type to search', preview: 'Open preview', paste: 'Paste in order',
    queue: 'Paste queue', next: 'Next up', text: 'Text', queueDone: 'All items pasted',
    form: 'Shipping details', fields: ['Email', 'Address', 'Postal code'],
    values: ['hello@example.com', '18 Market Street, San Francisco', '94105'],
    document: 'Project notes', drop: 'Drop an image into your document', migration: '↔ Manual history transfer',
  },
} as const;
