(() => {
  "use strict";

  const STORAGE_KEYS = {
    language: "vpaste.website.language.v2",
  };

  const translations = {
    en: {
      "demo.light": "Light",
      "demo.dark": "Dark",
      "demo.backTop": "Back to top",
      "demo.noResults": "No matching items in this demo",
      "demo.settings": "Settings",
      "alt.searchCapture": "vPaste search: an expanded search field and matching clipboard cards with highlighted keywords",
      "alt.settingsCapture": "vPaste General settings with the System, Light and Dark theme menu open",
      "demo.label": "Interactive demo",
      "demo.preview": "Feature preview",
      "a11y.skip": "Skip to content",
      "a11y.menu": "Open menu",
      "a11y.closeMenu": "Close menu",
      "a11y.primaryNav": "Primary navigation",
      "a11y.home": "vPaste home",
      "a11y.language": "Language",
      "a11y.demoPlatform": "Demo platform",
      "a11y.projectFacts": "Project facts",
      "a11y.privacyFlow": "Local clipboard flow",
      "nav.experience": "One shortcut",
      "nav.formats": "Formats",
      "nav.workflow": "Customize",
      "nav.privacy": "Privacy",
      "nav.source": "Open source",
      "hero.kicker": "Every copy, clearly visible",
      "hero.slogan": "Your clipboard, one shortcut away",
      "hero.lede": "vPaste automatically sorts text, images, links, colors, and files into clear visual cards. Call it up anytime to browse, search, preview, and paste again",
      "hero.platforms": "Windows + macOS",
      "hero.local": "History stored locally",
      "hero.license": "GPL-3.0 open source",
      "action.download": "Download vPaste",
      "action.repository": "View source",
      "action.releases": "Download latest release",
      "shortcut.kicker": "One shortcut from any app",
      "shortcut.title": "Call it up. Pick one. Carry on",
      "shortcut.body": "Call up your history and choose an item. Auto-paste sends it back to your app and closes the panel. Multi-display setups follow your active screen",
      "shortcut.press": "Press",
      "shortcut.canvasLabel": "Your desktop",
      "usecases.kicker": "Visual clipboard history",
      "usecases.title": "See what you copied at a glance",
      "usecases.body": "Type, time, source app, and a useful preview live on every card. Even a long history stays easy to recognize and recover",
      "usecases.aria": "Clipboard use cases",
      "usecases.history": "Recover overwritten items",
      "usecases.historyBody": "Text, images, and files stay ordered by time and ready to use again",
      "usecases.snippets": "Keep the original format",
      "usecases.snippetsBody": "Preserve headings, lists, and tables, or paste as plain text when needed",
      "usecases.queue": "Paste queue",
      "usecases.queueBody": "Collect copies in a queue, drag to reorder or reverse the list, then paste items one by one with Ctrl / ⌘ + V while the queue is active",
      "usecases.drag": "Cross-app drag and drop",
      "usecases.dragBody": "Drag text, links, images, or files into compatible apps, including multiple files from one record",
      "usecases.search": "Search the clue you remember",
      "usecases.searchBody": "Text, page titles, file paths, and source apps can all lead you back",
      "usecases.preview": "Preview before you paste",
      "usecases.previewBody": "Check rich text, images, links, and files before deciding how to use them",
      "usecases.organize": "Filter, tag, and favorite",
      "usecases.organizeBody": "Filter by type, app, date, or favorite and keep reusable items close",
      "formats.kicker": "Every format, easy to see",
      "formats.title": "The right card for every kind of content",
      "formats.body": "Text, images, links, colors, and files are sorted automatically, with the context you need to recognize, search, preview, and reuse them",
      "formats.text": "Text",
      "formats.textBody": "Keep headings, lists, and tables intact, then paste with the original formatting or as plain text",
      "formats.textFeature1": "Headings, tables & links",
      "formats.textFeature2": "Searchable content",
      "formats.textFeature3": "Formatted or plain paste",
      "formats.image": "Images",
      "formats.imageBody": "See the image in the card, inspect full detail, and export it whenever you need the file",
      "formats.imageFeature1": "Full-size preview",
      "formats.imageFeature2": "Dimensions & GIF detection",
      "formats.imageFeature3": "Export as an image file",
      "formats.link": "Links",
      "formats.linkBody": "Add page titles and preview images automatically, so a link is more than a bare URL",
      "formats.linkFeature1": "Title & preview image",
      "formats.linkFeature2": "Preview before opening",
      "formats.linkFeature3": "Search title or URL",
      "formats.color": "Colors",
      "formats.colorBody": "See the swatch and its value together, then convert between common color formats",
      "formats.colorFeature1": "HEX / RGB / HSL",
      "formats.colorFeature2": "Live color swatch",
      "formats.colorFeature3": "One-click conversion",
      "formats.file": "Files",
      "formats.fileBody": "Keep files, folders, and multi-file copies ready to preview, locate, or send again",
      "formats.fileFeature1": "Single files, folders & batches",
      "formats.fileFeature2": "Preview common content",
      "formats.fileFeature3": "Open location or copy path",
      "search.kicker": "Remember a little, find the rest",
      "search.title": "Search whatever you remember",
      "search.body": "Enter the fragment you remember, then narrow the results by type, source app, favorite, tag, or time",
      "search.point1": "Text and rich-text keywords",
      "search.point2": "Page titles, URLs, file names & paths",
      "search.point3": "Type, source, favorites, tags & time",
      "workflow.kicker": "Work your way",
      "workflow.title": "Make vPaste feel natural to use",
      "workflow.body": "Your theme, your shortcuts, your way of working",
      "settings.behaviorBody": "Light or dark · English or Chinese",
      "settings.experienceBody": "Link previews · Remember your place",
      "settings.dataBody": "Storage location · Migration and cleanup",
      "settings.shortcutsBody": "Call up the panel · Choose how to paste",
      "alt.localArtwork": "A desktop archive of paper records beside a portable drive, illustrating local history and migration",
      "settings.behavior": "Interface & behavior",
      "settings.behavior1": "System, light, and dark themes",
      "settings.behavior2": "English and Simplified Chinese",
      "settings.behavior3": "Startup, tray, and background behavior",
      "settings.experience": "Clipboard experience",
      "settings.experience1": "Rich link titles and preview images",
      "settings.experience2": "Remember search, tab, and scroll position",
      "settings.experience3": "Source app names and icons",
      "settings.data": "Data & privacy",
      "settings.data1": "Skip sensitive content and selected apps",
      "settings.data2": "Choose the history storage folder",
      "settings.data3": "Review storage and clean history by age",
      "settings.data4": "Move complete history between installations",
      "settings.shortcuts": "Keyboard workflow",
      "settings.shortcuts1": "Show or hide the panel from any app",
      "settings.shortcuts2": "Paste with formatting or as plain text",
      "settings.shortcuts3": "Select with arrows, Tab, and Alt",
      "settings.shortcuts4": "Search, preview, and open actions by keyboard",
      "privacy.kicker": "Local history, your control",
      "privacy.title": "Stored on your device,\nnot uploaded to a server",
      "privacy.body": "vPaste stores clipboard history locally without uploading it to a server. Exclude selected apps and sensitive content from capture; enabling link previews sends requests to the linked pages",
      "privacy.localDb": "Clipboard history stored on your device",
      "privacy.control": "Sensitive-content and per-app exclusions",
      "data.onDevice": "On your device",
      "data.migrate": "Move your history",
      "data.clean": "Clear older records",
      "demo.older": "More history, still here",
      "demo.keepFormat": "Headings, lists and tables stay intact",
      "demo.plainText": "Paste as plain text when needed",
      "demo.spacePreview": "Preview the selected item",
      "demo.readme": "A clipboard workspace for text, images, links and files",
      "demo.workNote": "Project notes",
      "demo.projectNote": "Collected for this project",
      "demo.dropHere": "Drop an image into your document",
      "demo.saved": "Saved on this device",
      "demo.manualMigration": "Manual migration",
      "demo.exportImport": "Export an archive · Import on Windows or Mac",
      "demo.pause": "Pause demo",
      "demo.resume": "Play demo",
      "privacy.flowCopy": "Copy",
      "privacy.flowStore": "Check privacy",
      "privacy.flowFind": "Store locally",
      "privacy.flowPaste": "Find & paste",
      "privacy.orbitLabel": "Local",
      "privacy.orbitCore": "Clipboard history",
      "source.kicker": "Open source makes the promise inspectable",
      "source.title": "Open from source code to security policy",
      "source.body": "vPaste is GPL-3.0 open source. Its Windows and macOS desktop code, platform integrations, release history, and security policy are open for anyone to inspect",
      "source.factOpen": "Auditable source",
      "source.factLocal": "Local history architecture",
      "source.factPrivate": "Clipboard history is stored on your device",
      "source.factPlatforms": "Platform-specific clipboard handling",
      "final.kicker": "Browse clipboard history as cards, call it up fast, paste in one step",
      "final.title": "Your clipboard, one shortcut away",
      "product.all": "All",
      "product.favorites": "Favorites",
      "product.text": "Text",
      "product.images": "Images",
      "product.links": "Links",
      "product.colors": "Colors",
      "product.files": "Files",
      "product.search": "Search clipboard history",
      "product.timeSeconds": "A few seconds ago",
      "product.timeMinutes": "4 minutes ago",
      "product.timeTenHours": "10 hours ago",
      "product.timeHours": "2 hours ago",
      "product.timeHoursLong": "6 hours ago",
      "product.timeYesterday": "Yesterday",
      "product.textTitle": "vPaste",
      "product.textDescription": "Your clipboard, one shortcut away",
      "product.linkTitle": "Loxonl/vPaste-desktop",
      "product.fileName": "C:/Demo/vPaste Intro.pdf",
      "product.filterState": "Showing image items",
      "product.word": "Microsoft Word",
      "product.wechat": "WeChat",
      "product.chrome": "Google Chrome",
      "product.explorer": "File Explorer",
      "product.figma": "Figma",
      "product.excel": "Microsoft Excel",
      "product.tableContent": "Content",
      "product.tableType": "Type",
      "product.tableResult": "Result",
      "product.tableText": "vPaste text",
      "product.tablePlain": "Plain text",
      "product.tableSearchable": "Searchable",
      "product.tableLink": "Link",
      "product.tableTitleKept": "Title kept",
      "product.tableColor": "Color",
      "product.tableValueShown": "Value shown",
      "product.codeTitle": "Code snippet",
      "product.replyTitle": "Reusable reply",
      "product.addressTitle": "Shipping address",
      "product.codeBody": "const openHistory = () => invoke(\"show_main_window\");",
      "product.replyBody": "Thanks, I have reviewed the details and will follow up today",
      "product.addressBody": "18 Market Street, Suite 240\nSan Francisco, CA",
      "product.smartFilters": "Smart Filters",
      "product.smartFiltersBody": "Match type, app, or keywords",
      "product.manualTags": "Manual Tags",
      "product.manualTagsBody": "Mark individual items yourself",
      "product.filterText": "Text from Word",
      "product.filterLinks": "Links from Chrome",
      "product.tagLaunch": "Launch copy",
      "product.tagReference": "Reference",
      "product.previewTitle": "Clipboard preview",
      "product.previewBody": "Preview copied text, images, links, files, and rich formatting before pasting them back into your work",
      "product.general": "General",
      "product.data": "Data",
      "product.shortcuts": "Shortcuts",
      "product.about": "About",
      "product.system": "System settings",
      "product.startup": "Launch at startup",
      "product.tray": "Show tray icon",
      "product.language": "Language",
      "product.theme": "Theme",
      "product.tutorial": "Tutorial",
      "product.open": "Open",
      "product.personalization": "Personalization",
      "product.linkPreview": "Link auto preview",
      "product.keepSearch": "Keep search history",
      "product.linkPreviewDesc": "Rich context for copied URLs",
      "product.keepSearchDesc": "Resume the previous query",
      "product.languageValue": "English",
      "product.themeValue": "System",
      "alt.main": "vPaste clipboard history window with typed tabs and recent clipboard items",
      "alt.shortcut": "vPaste appearing over the desktop",
      "alt.formats": "Abstract stack of clipboard content formats",
      "alt.tabs": "vPaste custom filter tabs",
      "alt.preview": "vPaste clipboard item preview",
      "alt.settings": "vPaste settings window",
      "alt.vault": "Abstract local data vault receiving clipboard layers",
      "meta.title": "vPaste — Your clipboard, one shortcut away",
      "meta.description": "vPaste is a local clipboard manager for Windows and macOS that automatically organizes text, images, links, colors, and files into visual cards for fast search, preview, and reuse",
    },
    zh: {
      "demo.light": "浅色",
      "demo.dark": "深色",
      "demo.backTop": "回到顶部",
      "demo.noResults": "演示记录中没有匹配内容",
      "demo.settings": "设置",
      "alt.searchCapture": "vPaste 正式搜索界面：顶部展开搜索框，下方显示带关键词高亮的剪贴卡片",
      "alt.settingsCapture": "vPaste 通用设置页，展开跟随系统、浅色模式和深色模式的主题菜单",
      "demo.label": "交互演示",
      "demo.preview": "功能示意",
      "a11y.skip": "跳到主要内容",
      "a11y.menu": "打开菜单",
      "a11y.closeMenu": "关闭菜单",
      "a11y.primaryNav": "主要导航",
      "a11y.home": "vPaste 首页",
      "a11y.language": "语言",
      "a11y.demoPlatform": "演示平台",
      "a11y.projectFacts": "项目概况",
      "a11y.privacyFlow": "本机剪贴处理流程",
      "nav.experience": "一键呼出",
      "nav.formats": "内容格式",
      "nav.workflow": "个性设置",
      "nav.privacy": "隐私",
      "nav.source": "开源",
      "hero.kicker": "每次复制，都清晰可见",
      "hero.slogan": "剪贴捷径，一键即达",
      "hero.lede": "vPaste 将文本、图片、链接、颜色与文件自动分类为清晰的可视化卡片。随时呼出，快速浏览、搜索、预览，再一键粘贴",
      "hero.platforms": "Windows + macOS",
      "hero.local": "历史存于本机",
      "hero.license": "GPL-3.0 开源",
      "action.download": "下载 vPaste",
      "action.repository": "查看源码",
      "action.releases": "下载最新版本",
      "shortcut.kicker": "从任意应用一键呼出",
      "shortcut.title": "从容呼出，所选即达",
      "shortcut.body": "随时呼出，选取内容。开启自动粘贴，直接回填原窗口；多屏跟随当前操作",
      "shortcut.press": "按下",
      "shortcut.canvasLabel": "你的桌面",
      "usecases.kicker": "可视化剪贴历史",
      "usecases.title": "复制了什么，一眼就知道",
      "usecases.body": "类型、时间、来源应用和内容预览都在卡片上。历史再多，也能快速辨认和找回",
      "usecases.aria": "剪贴板用途场景",
      "usecases.history": "找回被覆盖的内容",
      "usecases.historyBody": "文本、图片或文件按时间排列，打开面板即可取回",
      "usecases.snippets": "保留原有格式",
      "usecases.snippetsBody": "标题、列表和表格保留结构，也可按需要粘贴为纯文本",
      "usecases.queue": "粘贴队列",
      "usecases.queueBody": "连续复制入队，支持拖动排序和一键倒序；队列启用时，按 Ctrl / ⌘ + V 逐项粘贴",
      "usecases.drag": "跨应用拖拽",
      "usecases.dragBody": "将文本、链接、图片或文件拖入支持的应用，一条记录中的多个文件也能一起拖出",
      "usecases.search": "搜索记得的线索",
      "usecases.searchBody": "正文、网页标题、文件路径或来源应用，都能成为查找入口",
      "usecases.preview": "粘贴前先预览",
      "usecases.previewBody": "先确认富文本、图片、链接与文件内容，再决定如何使用",
      "usecases.organize": "分类、标签与收藏",
      "usecases.organizeBody": "按类型、应用、日期或收藏筛选，把常用内容留在手边",
      "formats.kicker": "每种内容，都看得清楚",
      "formats.title": "不同内容自有合适的卡片",
      "formats.body": "文本、图片、链接、颜色和文件会自动分类，并保留辨认、搜索、预览与再次使用所需的信息",
      "formats.text": "文本",
      "formats.textBody": "保留标题、列表和表格结构，可按原格式或纯文本粘贴",
      "formats.textFeature1": "标题、表格与链接",
      "formats.textFeature2": "正文关键词可搜索",
      "formats.textFeature3": "原格式或纯文本粘贴",
      "formats.image": "图片",
      "formats.imageBody": "缩略图直接展示内容，可查看完整细节并导出复用",
      "formats.imageFeature1": "完整图片预览",
      "formats.imageFeature2": "分辨率与 GIF 识别",
      "formats.imageFeature3": "导出为图片文件",
      "formats.link": "链接",
      "formats.linkBody": "自动补全网页标题与预览图，不必只靠网址辨认",
      "formats.linkFeature1": "标题与预览图",
      "formats.linkFeature2": "粘贴前查看页面",
      "formats.linkFeature3": "标题和网址都可搜索",
      "formats.color": "颜色",
      "formats.colorBody": "色块与数值同时可见，常用颜色格式可以快速转换",
      "formats.colorFeature1": "HEX / RGB / HSL",
      "formats.colorFeature2": "真实色块预览",
      "formats.colorFeature3": "一键转换颜色格式",
      "formats.file": "文件",
      "formats.fileBody": "保留文件、文件夹和多文件记录，稍后仍可预览、定位和再次发送",
      "formats.fileFeature1": "单个、多个或文件夹",
      "formats.fileFeature2": "常见内容预览",
      "formats.fileFeature3": "打开位置或复制路径",
      "search.kicker": "记得一点，就能找到",
      "search.title": "记得什么就搜什么",
      "search.body": "输入记得的片段，再按类型、来源应用、收藏、标签或时间缩小范围",
      "search.point1": "文本与富文本关键词",
      "search.point2": "网页标题、网址、文件名与路径",
      "search.point3": "类型、来源、收藏、标签与时间",
      "workflow.kicker": "按你的习惯工作",
      "workflow.title": "把 vPaste 调成顺手的样子",
      "workflow.body": "从主题到快捷键，调成自己顺手的样子",
      "settings.behaviorBody": "深浅主题 · 中英双语",
      "settings.experienceBody": "链接预览 · 记住上次位置",
      "settings.dataBody": "存储位置 · 历史迁移与清理",
      "settings.shortcutsBody": "呼出面板 · 按需选择粘贴格式",
      "alt.localArtwork": "纸质记录收纳盒与便携硬盘，表达本地历史的保存与迁移",
      "settings.behavior": "界面与行为",
      "settings.behavior1": "跟随系统、浅色与深色主题",
      "settings.behavior2": "英文与简体中文界面",
      "settings.behavior3": "开机启动、托盘与后台运行",
      "settings.experience": "剪贴板体验",
      "settings.experience1": "链接标题与预览图自动补全",
      "settings.experience2": "记住搜索、标签与滚动位置",
      "settings.experience3": "记录来源应用名称与图标",
      "settings.data": "数据与隐私",
      "settings.data1": "跳过敏感内容与指定应用",
      "settings.data2": "自行选择历史数据存储位置",
      "settings.data3": "统计空间并按时间清理历史",
      "settings.data4": "在不同安装之间迁移完整历史",
      "settings.shortcuts": "键盘工作流",
      "settings.shortcuts1": "从任意应用呼出或收起面板",
      "settings.shortcuts2": "保留格式粘贴或粘贴为纯文本",
      "settings.shortcuts3": "方向键、Tab 与 Alt 快速选择",
      "settings.shortcuts4": "用键盘搜索、预览并打开操作菜单",
      "privacy.kicker": "本机存储，数据自主",
      "privacy.title": "记录留在本机，\n不上传服务器",
      "privacy.body": "vPaste 将剪贴历史保存在本机，不上传服务器。可排除指定应用和敏感内容，避免录入历史；开启链接预览时会请求链接指向的网页",
      "privacy.localDb": "剪贴历史保存在你的设备上",
      "privacy.control": "敏感内容保护与指定应用排除",
      "data.onDevice": "留在你的设备上",
      "data.migrate": "迁移完整历史",
      "data.clean": "按时间清理历史",
      "demo.older": "更早的记录，也在这里",
      "demo.keepFormat": "标题、列表与表格，保留原有格式",
      "demo.plainText": "需要时，也能粘贴为纯文本",
      "demo.spacePreview": "预览当前选中的内容",
      "demo.readme": "收纳文本、图片、链接与文件的剪贴板工作台",
      "demo.workNote": "项目笔记",
      "demo.projectNote": "为这个项目收集的内容",
      "demo.dropHere": "把图片拖入文档",
      "demo.saved": "持续保存在本机",
      "demo.manualMigration": "手动迁移",
      "demo.exportImport": "导出归档 · 在 Windows 或 Mac 导入",
      "demo.pause": "暂停演示",
      "demo.resume": "播放演示",
      "privacy.flowCopy": "复制",
      "privacy.flowStore": "检查隐私规则",
      "privacy.flowFind": "本机保存",
      "privacy.flowPaste": "查找并粘贴",
      "privacy.orbitLabel": "本机",
      "privacy.orbitCore": "剪贴历史",
      "source.kicker": "开源，也让承诺可核验",
      "source.title": "从代码到安全策略全程公开",
      "source.body": "vPaste 采用 GPL-3.0 开源。Windows 与 macOS 桌面端代码、平台适配、发布记录和安全策略均可公开查阅",
      "source.factOpen": "代码可审查",
      "source.factLocal": "本机历史架构",
      "source.factPrivate": "剪贴历史保存在你的设备上",
      "source.factPlatforms": "针对平台处理原生剪贴格式",
      "final.kicker": "卡片浏览剪贴历史，快速呼出，一键粘贴",
      "final.title": "剪贴捷径，一键即达",
      "product.all": "全部",
      "product.favorites": "收藏",
      "product.text": "文本",
      "product.images": "图片",
      "product.links": "链接",
      "product.colors": "颜色",
      "product.files": "文件",
      "product.search": "搜索剪贴板历史",
      "product.timeSeconds": "几秒前",
      "product.timeMinutes": "4 分钟前",
      "product.timeTenHours": "10 小时前",
      "product.timeHours": "2 小时前",
      "product.timeHoursLong": "6 小时前",
      "product.timeYesterday": "昨天",
      "product.textTitle": "vPaste",
      "product.textDescription": "剪贴捷径，一键即达",
      "product.linkTitle": "Loxonl/vPaste-desktop",
      "product.fileName": "C:/Demo/vPaste Intro.pdf",
      "product.filterState": "正在显示图片内容",
      "product.word": "Microsoft Word",
      "product.wechat": "微信",
      "product.chrome": "Google Chrome",
      "product.explorer": "文件资源管理器",
      "product.figma": "Figma",
      "product.excel": "Microsoft Excel",
      "product.tableContent": "内容",
      "product.tableType": "类型",
      "product.tableResult": "结果",
      "product.tableText": "vPaste 文本",
      "product.tablePlain": "纯文本",
      "product.tableSearchable": "可搜索",
      "product.tableLink": "链接",
      "product.tableTitleKept": "保留标题",
      "product.tableColor": "颜色",
      "product.tableValueShown": "显示色值",
      "product.codeTitle": "代码片段",
      "product.replyTitle": "常用回复",
      "product.addressTitle": "收货地址",
      "product.codeBody": "const openHistory = () => invoke(\"show_main_window\");",
      "product.replyBody": "谢谢，详细信息已经确认，我会在今天继续跟进",
      "product.addressBody": "上海市静安区灵石路 18 号\n创意中心 240 室",
      "product.smartFilters": "自动筛选",
      "product.smartFiltersBody": "按类型、应用或关键词自动匹配",
      "product.manualTags": "手动标记",
      "product.manualTagsBody": "自行标记具体的剪贴内容",
      "product.filterText": "Word 文本",
      "product.filterLinks": "Chrome 链接",
      "product.tagLaunch": "发布文案",
      "product.tagReference": "参考资料",
      "product.previewTitle": "剪贴内容预览",
      "product.previewBody": "粘贴前先确认复制过的文本、图片、链接、文件和富文本格式，再把它们带回当前工作",
      "product.general": "通用",
      "product.data": "数据",
      "product.shortcuts": "快捷键",
      "product.about": "关于",
      "product.system": "系统设置",
      "product.startup": "开机启动",
      "product.tray": "显示托盘图标",
      "product.language": "多语言",
      "product.theme": "主题模式",
      "product.tutorial": "使用向导",
      "product.open": "打开",
      "product.personalization": "个性化",
      "product.linkPreview": "链接自动预览",
      "product.keepSearch": "保留搜索记录",
      "product.linkPreviewDesc": "为复制的链接保留丰富上下文",
      "product.keepSearchDesc": "再次打开时恢复上一次搜索",
      "product.languageValue": "简体中文（大陆）",
      "product.themeValue": "跟随系统",
      "alt.main": "vPaste 主剪贴板历史窗口，展示类型标签和近期记录",
      "alt.shortcut": "vPaste 从桌面上方呼出",
      "alt.formats": "由多种剪贴板内容组成的抽象堆栈",
      "alt.tabs": "vPaste 自定义筛选标签",
      "alt.preview": "vPaste 剪贴内容预览",
      "alt.settings": "vPaste 设置窗口",
      "alt.vault": "接收剪贴板内容的抽象本地数据仓",
      "meta.title": "vPaste — 剪贴捷径，一键即达",
      "meta.description": "vPaste 是一款本机存储的 Windows 与 macOS 剪贴板管理器，用可视化卡片自动分类文本、图片、链接、颜色与文件，支持快速搜索、预览和再次粘贴",
    },
  };

  const icons = {
    search: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    grid: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>',
    star: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>',
    plus: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    settings: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>',
    file: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/></svg>',
    pin: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m12 17-5 5M5 3l6 6M14 4l6 6-3 1-4 4-1 3-6-6 3-1 4-4Z"/></svg>',
    tune: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 5h6M4 12h10M4 19h16"/><circle cx="16" cy="5" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="8" cy="19" r="2"/></svg>',
    database: '<svg aria-hidden="true" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>',
    keyboard: '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h.01M11 14h6"/></svg>',
    info: '<svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    github: '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.4 3.5 6.6 6.8 7a4.8 4.8 0 0 0-1 3.5v4"/><path d="M8 19c-3 .9-3-1.5-4.2-2"/></svg>',
  };

  const productTabs = (active = "all") => `
    <div class="vp-app-tabs">
      <span class="vp-app-tab ${active === "all" ? "is-active" : ""}">${icons.grid}<b data-i18n="product.all">All</b></span>
      <span class="vp-app-tab">${icons.star}<b data-i18n="product.favorites">Favorites</b></span>
      <span class="vp-app-tab ${active === "text" ? "is-active" : ""}"><b data-i18n="product.text">Text</b></span>
      <span class="vp-app-tab ${active === "images" ? "is-active" : ""}"><b data-i18n="product.images">Images</b></span>
      <span class="vp-app-tab ${active === "links" ? "is-active" : ""}"><b data-i18n="product.links">Links</b></span>
      <span class="vp-app-tab ${active === "colors" ? "is-active" : ""}"><b data-i18n="product.colors">Colors</b></span>
      <span class="vp-app-tab ${active === "files" ? "is-active" : ""}"><b data-i18n="product.files">Files</b></span>
      <span class="vp-app-tab-add">${icons.plus}</span>
    </div>`;

  const productBar = (active = "all") => `
    <div class="vp-app-bar">
      <span class="vp-app-icon-button" title="Search">${icons.search}</span>
      ${productTabs(active)}
      <span class="vp-app-icon-button">${icons.settings}</span>
    </div>`;

  const appAssets = {
    word: "assets/apps/word.svg",
    wechat: "assets/apps/wechat.png",
    chrome: "assets/apps/chrome.png",
    explorer: "assets/apps/explorer.png",
    figma: "assets/apps/figma.png",
    excel: "assets/apps/excel.svg",
  };

  const appVisuals = {
    word: { color: "rgb(8, 66, 213)", textColor: "#fff" },
    wechat: { color: "rgb(6, 198, 98)", textColor: "#fff" },
    chrome: { color: "rgb(232, 64, 50)", textColor: "#fff" },
    explorer: { color: "#986100", textColor: "#fff" },
    figma: { color: "#9f2d1e", textColor: "#fff" },
    excel: { color: "rgb(16, 124, 65)", textColor: "#fff" },
  };

  const productCard = (type, titleKey, timeKey, app, appNameKey, body, extraClass = "") => `
    <article class="vp-clip-card vp-clip-card--${type} ${extraClass}">
      <header style="background:${appVisuals[app].color};color:${appVisuals[app].textColor}">
        <span><b data-i18n="${titleKey}">${titleKey.split(".").pop()}</b><small data-i18n="${timeKey}">${timeKey.split(".").pop()}</small></span>
        <span class="vp-app-source vp-app-source--${app}"><img src="${appAssets[app]}" alt=""/><em class="sr-only" data-i18n="${appNameKey}">${appNameKey.split(".").pop()}</em></span>
      </header>
      <div class="vp-clip-card__body">${body}</div>
    </article>`;

  const historyCards = () => [
    productCard("text", "product.text", "product.timeSeconds", "word", "product.word", '<div class="vp-text-card"><strong data-i18n="product.textTitle">vPaste</strong><p data-i18n="product.textDescription">A polished visual clipboard, one shortcut away</p></div>'),
    productCard("image", "product.images", "product.timeMinutes", "wechat", "product.wechat", '<img src="assets/format-stack.png" alt="" loading="lazy"/><span class="vp-image-size">1200 × 800</span>'),
    productCard("link", "product.links", "product.timeHours", "chrome", "product.chrome", `<div class="vp-link-card"><span class="vp-link-mark">${icons.github}</span><span class="vp-link-domain">github.com</span><strong data-i18n="product.linkTitle">Loxonl/vPaste-desktop</strong><small>github.com/Loxonl/vPaste-desktop</small></div>`),
    productCard("file", "product.files", "product.timeHoursLong", "explorer", "product.explorer", `<div class="vp-file-preview"><div class="vp-file-type" aria-hidden="true"><img src="assets/pdf.svg" alt=""/><span>PDF</span></div><strong data-i18n="product.fileName">C:/Demo/vPaste Intro.pdf</strong></div>`),
    productCard("color", "product.colors", "product.timeTenHours", "figma", "product.figma", '<div class="vp-color-preview"><span>#F24E1E</span></div>'),
    productCard("rich", "product.text", "product.timeYesterday", "excel", "product.excel", `
      <div class="vp-rich-card">
        <table>
          <thead><tr>
            <th data-i18n="product.tableContent">Content</th>
            <th data-i18n="product.tableType">Type</th>
            <th data-i18n="product.tableResult">Result</th>
          </tr></thead>
          <tbody>
            <tr><td><b data-i18n="product.tableText">vPaste text</b></td><td data-i18n="product.tablePlain">Plain text</td><td data-i18n="product.tableSearchable">Searchable</td></tr>
            <tr><td><span class="vp-rich-link">vpaste.app</span></td><td data-i18n="product.tableLink">Link</td><td data-i18n="product.tableTitleKept">Title kept</td></tr>
            <tr><td><span class="vp-rich-color">#2563EB</span></td><td data-i18n="product.tableColor">Color</td><td data-i18n="product.tableValueShown">Value shown</td></tr>
          </tbody>
        </table>
      </div>`),
  ].join("");

  const historySurface = () => `
    <div class="vp-app-window">
      ${productBar("all")}
      <div class="vp-card-rail">${historyCards()}</div>
    </div>`;

  const renderProductSurfaces = () => {
    document.querySelectorAll("[data-product-surface]").forEach((surface) => {
      surface.innerHTML = historySurface();
    });
  };

  renderProductSurfaces();

  const cardSamples = document.createElement("template");
  cardSamples.innerHTML = historyCards();
  const sampleCard = (type) => cardSamples.content.querySelector(`.vp-clip-card--${type}`)?.outerHTML || "";
  document.querySelectorAll("[data-format-sample]").forEach((surface) => {
    surface.innerHTML = sampleCard(surface.dataset.formatSample);
  });

  const readStorage = (key) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // The site remains fully usable when storage is blocked.
    }
  };

  const languageButtons = [...document.querySelectorAll("[data-language-button]")];
  const platformButtons = [...document.querySelectorAll("[data-platform-button]")];
  const platformShortcuts = [...document.querySelectorAll("[data-platform-shortcut]")];
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  const applyTranslations = (root, dictionary) => {
    root.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value) element.textContent = value;
    });

    root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      const value = dictionary[element.dataset.i18nAlt];
      if (value) element.setAttribute("alt", value);
    });

    root.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = dictionary[element.dataset.i18nAria];
      if (value) element.setAttribute("aria-label", value);
    });
  };

  const setLanguage = (language, persist = true) => {
    const nextLanguage = translations[language] ? language : "en";
    const dictionary = translations[nextLanguage];
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.language = nextLanguage;
    document.title = dictionary["meta.title"];
    metaDescription?.setAttribute("content", dictionary["meta.description"]);
    ogDescription?.setAttribute("content", dictionary["hero.slogan"]);

    applyTranslations(document, dictionary);

    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.languageButton === nextLanguage));
    });

    if (persist) writeStorage(STORAGE_KEYS.language, nextLanguage);
    document.dispatchEvent(new Event("vpaste:language"));
  };

  const setPlatform = (platform, animate = true) => {
    const nextPlatform = platform === "macos" ? "macos" : "windows";
    document.documentElement.dataset.platform = nextPlatform;
    platformShortcuts.forEach((element) => {
      element.textContent = nextPlatform === "macos" ? "Option + V" : "Alt + V";
    });
    platformButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.platformButton === nextPlatform));
    });
    const desktop = document.querySelector("[data-platform-desktop]");
    if (animate && desktop && window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.gsap.fromTo(desktop, { scale: 0.992, autoAlpha: 0.76 }, { scale: 1, autoAlpha: 1, duration: 0.42, ease: "power2.out", overwrite: "auto", clearProps: "transform,opacity,visibility" });
    }
  };

  const detectPlatform = () => {
    const reportedPlatform = navigator.userAgentData?.platform || navigator.platform || "";
    const userAgent = navigator.userAgent || "";
    const isTouchMac = navigator.maxTouchPoints > 1 && (
      /mac/i.test(reportedPlatform) ||
      /ipad|iphone|ipod/i.test(userAgent)
    );

    if (/windows|win32|win64/i.test(reportedPlatform) || /windows/i.test(userAgent)) return "windows";
    if (!isTouchMac && (/macos|macintosh|macintel/i.test(reportedPlatform) || /macintosh|mac os x/i.test(userAgent))) return "macos";
    return "windows";
  };

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });

  platformButtons.forEach((button) => {
    button.addEventListener("click", () => setPlatform(button.dataset.platformButton));
  });

  const storedLanguage = readStorage(STORAGE_KEYS.language);
  const browserLanguage = navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  setLanguage(storedLanguage || browserLanguage, false);

  setPlatform(detectPlatform(), false);

  const useCaseVisual = document.querySelector("[data-usecase-visual]");
  const useCaseButtons = [...document.querySelectorAll("[data-usecase-button]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const useCaseKeys = ["history", "snippets", "organize", "search", "preview", "queue", "drag"];
  const sceneCards = (types) => `<div class="scene-cards vp-product-surface">${types.map(sampleCard).join("")}</div>`;
  const useCaseScenes = [
    () => `<div class="scene-history">${productBar()}${sceneCards(["text", "image", "link"])}</div>`,
    () => `<div class="scene-formats">${sceneCards(["rich", "text"])}</div>`,
    () => `<div class="scene-tags"><div class="scene-chips"><span>${icons.star}<b data-i18n="product.favorites">Favorites</b></span><span data-i18n="product.tagLaunch">Launch copy</span><span data-i18n="product.tagReference">References</span></div>${sceneCards(["text", "link"])}</div>`,
    () => `<img class="scene-official-search" src="assets/product/search-${document.documentElement.dataset.language}.png" data-product-image="search" width="1560" height="528" loading="lazy" decoding="async" alt="" />`,
    () => `<div class="scene-preview">${sceneCards(["rich"])}<span class="scene-preview-label" data-i18n="product.previewTitle">Content preview</span></div>`,
    () => `<div class="scene-queue"><div class="scene-query"><img src="assets/vpaste-logo.png" width="24" height="24" alt=""/><b data-i18n="usecases.queue">Paste queue</b><span>03</span></div><ol><li><span>01</span><strong>vPaste</strong><small data-i18n="product.text">Text</small></li><li><span>02</span><strong>vpaste.app</strong><small data-i18n="product.links">Links</small></li><li><span>03</span><strong>vPaste Intro.pdf</strong><small data-i18n="product.files">Files</small></li></ol><div class="queue-shortcut"><kbd>Ctrl / ⌘ + V</kbd><span>→</span></div></div>`,
    () => `<div class="scene-drag">${sceneCards(["text"])}<span class="drag-arrow" aria-hidden="true">↗</span><div class="drag-target"><span data-i18n="product.textTitle">vPaste</span><p data-i18n="product.textDescription">A polished visual clipboard, one shortcut away</p><i></i><i></i></div></div>`,
  ];
  const renderUseCase = (index) => {
    if (!useCaseVisual) return;
    useCaseButtons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-selected", String(buttonIndex === index));
      button.tabIndex = buttonIndex === index ? 0 : -1;
    });
    useCaseVisual.setAttribute("aria-labelledby", `usecase-tab-${index}`);
    useCaseVisual.innerHTML = `<div class="scene-illustration">${useCaseScenes[index]()}</div><div class="scene-caption"><h3 data-i18n="usecases.${useCaseKeys[index]}"></h3><p data-i18n="usecases.${useCaseKeys[index]}Body"></p></div>`;
    applyTranslations(useCaseVisual, translations[document.documentElement.dataset.language]);
    document.querySelector("[data-usecase-counter]").textContent = `0${index + 1} / 07`;
    if (!reduceMotion.matches) {
      useCaseVisual.getAnimations().forEach((animation) => animation.cancel());
      useCaseVisual.animate([{ opacity: 0.45, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" });
    }
  };

  useCaseButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      renderUseCase(index);
      if (!document.body.classList.contains("journey-enhanced")) {
        button.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
      }
    });
    button.addEventListener("keydown", (event) => {
      const lastIndex = useCaseButtons.length - 1;
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = lastIndex;
      if (nextIndex === null) return;
      event.preventDefault();
      renderUseCase(nextIndex);
      useCaseButtons[nextIndex].focus();
      useCaseButtons[nextIndex].scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
    });
  });
  renderUseCase(0);
  document.addEventListener("vpaste:feature", (event) => {
    const index = event.detail;
    if (Number.isInteger(index) && index >= 0 && index < useCaseButtons.length) renderUseCase(index);
  });

  // These are captures of the official client renderer, not invented website controls.
  const updateProductImages = () => {
    const language = document.documentElement.dataset.language;
    document.querySelectorAll("[data-product-image]").forEach((image) => {
      image.src = `assets/product/${image.dataset.productImage}-${language}.png`;
    });
  };
  document.addEventListener("vpaste:language", updateProductImages);
  updateProductImages();

  const siteHeader = document.querySelector("[data-site-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const siteMenu = document.querySelector("[data-site-menu]");

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    siteMenu?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    const menuLabel = menuButton?.querySelector(".sr-only");
    if (menuLabel) menuLabel.textContent = translations[document.documentElement.dataset.language]["a11y.menu"];
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    siteMenu?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
    const menuLabel = menuButton.querySelector(".sr-only");
    if (menuLabel) {
      const dictionary = translations[document.documentElement.dataset.language];
      menuLabel.textContent = dictionary[willOpen ? "a11y.closeMenu" : "a11y.menu"];
    }
  });

  siteMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const updateHeader = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
  const updateActiveSection = () => {
    if (document.body.classList.contains("story-motion")) return;
    const anchorLine = (siteHeader?.offsetHeight || 72) + 120;
    let activeLink = null;
    sectionLinks.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      if (section && section.getBoundingClientRect().top <= anchorLine) activeLink = link;
    });
    sectionLinks.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  const updatePageChrome = () => {
    updateHeader();
    updateActiveSection();
  };
  updatePageChrome();
  window.addEventListener("scroll", updatePageChrome, { passive: true });
  document.addEventListener("vpaste:language", updatePageChrome);

  // Scroll choreography is owned by motion-concepts.js.
  window.vpasteSite = {
    translate: (root) => applyTranslations(root, translations[document.documentElement.dataset.language]),
    useCaseScene: (index) => useCaseScenes[index](),
  };
})();
