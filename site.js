(() => {
  "use strict";

  const STORAGE_KEYS = {
    language: "vpaste.website.language.v2",
    platform: "vpaste.website.platform.v1",
  };

  const translations = {
    en: {
      "a11y.skip": "Skip to content",
      "a11y.menu": "Open menu",
      "a11y.closeMenu": "Close menu",
      "nav.experience": "Experience",
      "nav.formats": "Formats",
      "nav.workflow": "Settings",
      "nav.privacy": "Privacy",
      "nav.source": "Open source",
      "hero.kicker": "Clipboard history, made visual.",
      "hero.slogan": "A polished clipboard, one shortcut away.",
      "hero.lede": "vPaste turns text, rich content, images, links, colors, and files into clear visual cards with smooth, focused motion. See what you copied, find it fast, and paste it back in the format the work expects.",
      "hero.platforms": "Windows + macOS",
      "hero.local": "Local-first by design",
      "hero.license": "GPL-3.0 open source",
      "hero.caption": "The actual vPaste interface",
      "hero.captionDetail": "Source apps, true previews, filters, and actions—clear at a glance.",
      "action.repository": "View on GitHub",
      "action.releases": "Browse releases",
      "shortcut.kicker": "Polished, not persistent",
      "shortcut.title": "Slides in when needed. Gets out of the way.",
      "shortcut.body": "The compact panel appears above your current app with smooth motion, keeps keyboard and mouse selection close, then returns focus after you paste.",
      "shortcut.press": "Press",
      "shortcut.canvasLabel": "Your desktop",
      "usecases.kicker": "See more than a list of copies",
      "usecases.title": "Know what it is before you paste.",
      "usecases.body": "Every card shows useful context—content preview, format, source app, and time—so history stays readable instead of becoming a wall of text.",
      "usecases.aria": "Clipboard use cases",
      "usecases.history": "Recover overwritten copies",
      "usecases.historyBody": "Recent-first local history brings back text, images, links, colors, and files.",
      "usecases.snippets": "Restore the original format",
      "usecases.snippetsBody": "Paste stored HTML or RTF where supported, or use the plain-text shortcut.",
      "usecases.search": "Search what you remember",
      "usecases.searchBody": "Match text, link titles, file names and paths, or source apps.",
      "usecases.preview": "Preview without opening",
      "usecases.previewBody": "Inspect rich text, images, links, and files before they leave history.",
      "usecases.organize": "Group by real context",
      "usecases.organizeBody": "Filter by type, app, date, or favorite, then add record tags when needed.",
      "usecases.historyVisual": "Local history, newest first",
      "usecases.historyVisualBody": "Repeated copies return to the front instead of creating noise.",
      "usecases.snippetVisual": "Rich format or plain text",
      "usecases.searchVisual": "Search titles, paths, apps, and text",
      "usecases.searchQuery": "release shortcut",
      "usecases.placeholder": "IMAGE PLACEHOLDER",
      "usecases.placeholderSize": "1600 × 1060 px",
      "formats.kicker": "Keep more than clipboard text",
      "formats.title": "Copy whatever the work requires.",
      "formats.body": "vPaste stores each content type with the details needed to recognize, preview, search, and restore it—from rich formatting and link metadata to image dimensions and file paths.",
      "formats.text": "Text",
      "formats.textBody": "Keep copied HTML or RTF so cards preserve hierarchy, tables, links, and styling in preview, with a searchable plain-text fallback.",
      "formats.textFeature1": "Layout, tables & links",
      "formats.textFeature2": "HTML / RTF + fallback",
      "formats.textFeature3": "Rich or plain-text paste",
      "formats.image": "Images",
      "formats.imageBody": "Preview the image without loading the original into the list.",
      "formats.imageFeature1": "Persistent thumbnail",
      "formats.imageFeature2": "Pixel dimensions",
      "formats.imageFeature3": "Screenshots, web & local",
      "formats.link": "Links",
      "formats.linkBody": "Fetch page metadata in the background without delaying capture.",
      "formats.linkFeature1": "Page title",
      "formats.linkFeature2": "Preview image + icon",
      "formats.linkFeature3": "Full URL searchable",
      "formats.color": "Colors",
      "formats.colorBody": "Recognize common CSS colors and show the exact value.",
      "formats.colorFeature1": "HEX / RGB / HSL",
      "formats.colorFeature2": "Live color swatch",
      "formats.colorFeature3": "One-click conversion",
      "formats.file": "Files",
      "formats.fileBody": "Keep files and folders as files—not text paths.",
      "formats.fileFeature1": "Name, type & path",
      "formats.fileFeature2": "Single, folder or batch",
      "formats.fileFeature3": "Paste back as file list",
      "search.kicker": "Search the details that survived",
      "search.title": "Remember a word, a title, a path, or an app.",
      "search.body": "Search plain and rich text, cached link titles, file names and paths, and source apps. Build tabs that filter by content type, app, date, favorites, or record tags.",
      "search.point1": "Text and rich-text fallback",
      "search.point2": "Link titles, file names, and paths",
      "search.point3": "Source app, date, favorites, and tags",
      "workflow.kicker": "Control without clutter",
      "workflow.title": "Tune the interface to the way you work.",
      "workflow.body": "Choose the theme and language, decide what vPaste remembers, set privacy boundaries, and keep frequent actions on the keyboard.",
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
      "settings.data4": "Move complete history with .vphistory archives",
      "settings.shortcuts": "Keyboard workflow",
      "settings.shortcuts1": "Show or hide the panel from any app",
      "settings.shortcuts2": "Paste with formatting or as plain text",
      "settings.shortcuts3": "Select with arrows, Tab, and Alt",
      "settings.shortcuts4": "Search, preview, and open actions by keyboard",
      "privacy.kicker": "Local by design, specific by default",
      "privacy.title": "History stays on your device—and is encrypted there.",
      "privacy.body": "vPaste encrypts history on disk, skips clipboard content marked sensitive by the system, and can exclude copies from apps you choose. A complete .vphistory archive moves your history, images, rich formats, and tags to another installation.",
      "privacy.localDb": "XChaCha20-Poly1305 encrypted local history",
      "privacy.control": "Sensitive-content and per-app exclusions",
      "privacy.flowCopy": "Copy",
      "privacy.flowStore": "Check privacy",
      "privacy.flowFind": "Encrypt locally",
      "privacy.flowPaste": "Find & paste",
      "source.kicker": "Claims you can inspect",
      "source.title": "Read the code behind the product.",
      "source.body": "vPaste is GPL-3.0 open source. The desktop code, clipboard format matrix, platform notes, release definitions, and security policy are public for Windows and macOS.",
      "source.factOpen": "Auditable source",
      "source.factLocal": "Local-first architecture",
      "source.factPrivate": "Clipboard processing stays on your machine",
      "source.factPlatforms": "Platform-specific clipboard handling",
      "final.kicker": "Keep the preview, the source, and the format.",
      "final.title": "Bring it back in one shortcut.",
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
      "product.timeMinutesLong": "18 minutes ago",
      "product.timeHours": "2 hours ago",
      "product.timeHoursLong": "6 hours ago",
      "product.textTitle": "Release notes",
      "product.textDescription": "Ready to publish after one last review.",
      "product.linkTitle": "Loxonl/vPaste-desktop",
      "product.fileName": "product-brief.pdf",
      "product.filterState": "Showing image items",
      "product.word": "Microsoft Word",
      "product.wechat": "WeChat",
      "product.chrome": "Google Chrome",
      "product.explorer": "File Explorer",
      "product.figma": "Figma",
      "product.codeTitle": "Code snippet",
      "product.replyTitle": "Reusable reply",
      "product.addressTitle": "Shipping address",
      "product.codeBody": "const openHistory = () => invoke(\"show_main_window\");",
      "product.replyBody": "Thanks, I have reviewed the details and will follow up today.",
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
      "product.previewBody": "Preview copied text, images, links, files, and rich formatting before pasting them back into your work.",
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
      "alt.search": "Abstract optical object organizing content into searchable layers",
      "alt.tabs": "vPaste custom filter tabs",
      "alt.preview": "vPaste clipboard item preview",
      "alt.settings": "vPaste settings window",
      "alt.vault": "Abstract local data vault receiving clipboard layers",
      "meta.title": "vPaste — A visual clipboard, one shortcut away.",
      "meta.description": "vPaste is a polished, local-first clipboard manager for Windows and macOS. Preserve rich text, preview images and links, search every format, and paste it back.",
    },
    zh: {
      "a11y.skip": "跳到主要内容",
      "a11y.menu": "打开菜单",
      "a11y.closeMenu": "关闭菜单",
      "nav.experience": "界面体验",
      "nav.formats": "内容格式",
      "nav.workflow": "设置功能",
      "nav.privacy": "隐私",
      "nav.source": "开源",
      "hero.kicker": "让剪贴板历史清晰可见",
      "hero.slogan": "优雅、直观的剪贴板，只差一个快捷键。",
      "hero.lede": "vPaste 将文本、富文本、图片、链接、颜色和文件整理成清晰的可视化卡片，配合克制而顺滑的动效。看清复制了什么，快速找到它，再按工作需要的格式粘贴回去。",
      "hero.platforms": "Windows + macOS",
      "hero.local": "本地优先设计",
      "hero.license": "GPL-3.0 开源",
      "hero.caption": "真实的 vPaste 主界面",
      "hero.captionDetail": "来源应用、内容预览、筛选与操作，一眼看清。",
      "action.repository": "前往 GitHub",
      "action.releases": "查看 Releases",
      "shortcut.kicker": "需要时出现，不打扰桌面",
      "shortcut.title": "顺滑呼出，用完即走。",
      "shortcut.body": "紧凑面板以顺滑动效出现在当前应用上方，键盘和鼠标都能快速选中内容；完成粘贴后，焦点回到原来的工作。",
      "shortcut.press": "按下",
      "shortcut.canvasLabel": "你的桌面",
      "usecases.kicker": "不只是一列复制记录",
      "usecases.title": "粘贴之前，先知道它是什么。",
      "usecases.body": "每张卡片都展示真正有用的信息：内容预览、格式、来源应用和复制时间。即使历史越来越多，也不会变成一堵难以辨认的文字墙。",
      "usecases.aria": "剪贴板用途场景",
      "usecases.history": "找回被覆盖的复制内容",
      "usecases.historyBody": "按时间排列的本地历史，完整收纳文本、图片、链接、颜色与文件。",
      "usecases.snippets": "按原格式恢复粘贴",
      "usecases.snippetsBody": "支持时写回保存的 HTML 或 RTF，也可用快捷键直接粘贴为纯文本。",
      "usecases.search": "按记得的线索搜索",
      "usecases.searchBody": "可匹配正文、链接标题、文件名与路径，以及来源应用。",
      "usecases.preview": "不打开文件也能预览",
      "usecases.previewBody": "富文本、图片、链接和文件，粘贴前先确认真实内容。",
      "usecases.organize": "按真实工作场景归类",
      "usecases.organizeBody": "按类型、应用、日期或收藏筛选，需要时再为单条记录添加标签。",
      "usecases.historyVisual": "本地历史，最近优先",
      "usecases.historyVisualBody": "重复复制会回到最前面，不制造多余记录。",
      "usecases.snippetVisual": "富格式或纯文本粘贴",
      "usecases.searchVisual": "搜索标题、路径、应用与正文",
      "usecases.searchQuery": "发布 快捷键",
      "usecases.placeholder": "图片占位",
      "usecases.placeholderSize": "1600 × 1060 px",
      "formats.kicker": "保留的不只是剪贴板文本",
      "formats.title": "工作需要什么，就复制什么。",
      "formats.body": "vPaste 会为每类内容保留真正有用的细节：富文本样式、链接元数据、图片尺寸、文件路径，让它们可辨认、可预览、可搜索，也能按原本的类型恢复。",
      "formats.text": "文本",
      "formats.textBody": "保存复制时的 HTML 或 RTF，让卡片尽量按当时的层级和样式预览，同时保留可搜索的纯文本后备。",
      "formats.textFeature1": "字体层级、表格与链接",
      "formats.textFeature2": "HTML/RTF 与文本后备",
      "formats.textFeature3": "富格式或纯文本粘贴",
      "formats.image": "图片",
      "formats.imageBody": "列表加载持久缩略图，不必反复读取原图。",
      "formats.imageFeature1": "持久缩略图",
      "formats.imageFeature2": "像素尺寸",
      "formats.imageFeature3": "截图、网页与本地图片",
      "formats.link": "链接",
      "formats.linkBody": "复制后立即入库，网页信息在后台补全，不阻塞记录。",
      "formats.linkFeature1": "网页标题",
      "formats.linkFeature2": "预览图与网站图标",
      "formats.linkFeature3": "完整 URL 可搜索",
      "formats.color": "颜色",
      "formats.colorBody": "识别常见 CSS 颜色写法，并显示准确色值。",
      "formats.colorFeature1": "HEX / RGB / HSL",
      "formats.colorFeature2": "真实色块预览",
      "formats.colorFeature3": "一键转换颜色格式",
      "formats.file": "文件",
      "formats.fileBody": "文件与文件夹仍按文件保存，不退化成路径文本。",
      "formats.fileFeature1": "名称、类型与路径",
      "formats.fileFeature2": "单文件、文件夹或多选",
      "formats.fileFeature3": "按文件列表恢复粘贴",
      "search.kicker": "搜索被完整保留下来的细节",
      "search.title": "记得正文、标题、路径或应用，就能找到。",
      "search.body": "搜索纯文本和富文本后备、缓存的链接标题、文件名与路径，以及来源应用；再用自定义标签按内容类型、应用、日期、收藏或记录标签筛选。",
      "search.point1": "正文与富文本纯文本后备",
      "search.point2": "链接标题、文件名与路径",
      "search.point3": "来源应用、日期、收藏与标签",
      "workflow.kicker": "丰富控制，不堆叠复杂感",
      "workflow.title": "让界面和操作适应你的工作方式。",
      "workflow.body": "选择主题与语言，决定 vPaste 记住哪些界面状态，设置隐私边界，并把高频操作留在键盘上。",
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
      "settings.data4": "通过 .vphistory 迁移完整历史",
      "settings.shortcuts": "键盘工作流",
      "settings.shortcuts1": "从任意应用呼出或收起面板",
      "settings.shortcuts2": "保留格式粘贴或粘贴为纯文本",
      "settings.shortcuts3": "方向键、Tab 与 Alt 快速选择",
      "settings.shortcuts4": "用键盘搜索、预览并打开操作菜单",
      "privacy.kicker": "本地优先，也把边界说清楚",
      "privacy.title": "历史留在设备上，并在本地加密。",
      "privacy.body": "vPaste 会加密保存在硬盘上的历史，跳过系统标记的敏感剪贴内容，也能排除你指定应用中的复制记录。更换设备时，可用完整的 .vphistory 归档迁移历史、图片、富格式和标签。",
      "privacy.localDb": "XChaCha20-Poly1305 本地加密历史",
      "privacy.control": "敏感内容保护与指定应用排除",
      "privacy.flowCopy": "复制",
      "privacy.flowStore": "检查隐私规则",
      "privacy.flowFind": "本地加密",
      "privacy.flowPaste": "查找并粘贴",
      "source.kicker": "每项宣传都可以检查",
      "source.title": "直接查看产品背后的代码。",
      "source.body": "vPaste 以 GPL-3.0 开源。Windows 与 macOS 的桌面端代码、剪贴板格式矩阵、平台说明、发布定义和安全策略均可公开查阅。",
      "source.factOpen": "代码可审查",
      "source.factLocal": "本地优先架构",
      "source.factPrivate": "剪贴板处理留在你的设备上",
      "source.factPlatforms": "针对平台处理原生剪贴格式",
      "final.kicker": "把预览、来源和格式一起留下。",
      "final.title": "一个快捷键，把它找回来。",
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
      "product.timeMinutesLong": "18 分钟前",
      "product.timeHours": "2 小时前",
      "product.timeHoursLong": "6 小时前",
      "product.textTitle": "发布说明",
      "product.textDescription": "最后确认一次，即可准备发布。",
      "product.linkTitle": "Loxonl/vPaste-desktop",
      "product.fileName": "产品简报.pdf",
      "product.filterState": "正在显示图片内容",
      "product.word": "Microsoft Word",
      "product.wechat": "微信",
      "product.chrome": "Google Chrome",
      "product.explorer": "文件资源管理器",
      "product.figma": "Figma",
      "product.codeTitle": "代码片段",
      "product.replyTitle": "常用回复",
      "product.addressTitle": "收货地址",
      "product.codeBody": "const openHistory = () => invoke(\"show_main_window\");",
      "product.replyBody": "谢谢，详细信息已经确认，我会在今天继续跟进。",
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
      "product.previewBody": "粘贴前先确认复制过的文本、图片、链接、文件和富文本格式，再把它们带回当前工作。",
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
      "alt.search": "将内容整理成可搜索层次的抽象光学物件",
      "alt.tabs": "vPaste 自定义筛选标签",
      "alt.preview": "vPaste 剪贴内容预览",
      "alt.settings": "vPaste 设置窗口",
      "alt.vault": "接收剪贴板内容的抽象本地数据仓",
      "meta.title": "vPaste — 优雅、直观的剪贴板，只差一个快捷键。",
      "meta.description": "vPaste 是面向 Windows 与 macOS 的本地优先剪贴板管理器，可保留富文本格式、预览图片与链接、搜索多种内容，并按原类型恢复粘贴。",
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
    word: "assets/apps/word.png",
    wechat: "assets/apps/wechat.png",
    chrome: "assets/apps/chrome.png",
    explorer: "assets/apps/explorer.png",
    figma: "assets/apps/figma.png",
  };

  const productCard = (type, titleKey, timeKey, app, appNameKey, body, extraClass = "") => `
    <article class="vp-clip-card vp-clip-card--${type} ${extraClass}">
      <header>
        <span><b data-i18n="${titleKey}">${titleKey.split(".").pop()}</b><small data-i18n="${timeKey}">${timeKey.split(".").pop()}</small></span>
        <span class="vp-app-source"><img src="${appAssets[app]}" alt=""/><em class="sr-only" data-i18n="${appNameKey}">${appNameKey.split(".").pop()}</em></span>
      </header>
      <div class="vp-clip-card__body">${body}</div>
    </article>`;

  const historyCards = () => [
    productCard("text", "product.text", "product.timeSeconds", "word", "product.word", '<div class="vp-text-card"><strong data-i18n="product.textTitle">Release notes</strong><p data-i18n="product.textDescription">Ready to publish after one last review.</p></div>'),
    productCard("image", "product.images", "product.timeMinutes", "wechat", "product.wechat", '<img src="assets/format-stack.png" alt="" loading="lazy"/><span class="vp-image-size">1536 × 1024</span>'),
    productCard("link", "product.links", "product.timeHours", "chrome", "product.chrome", `<div class="vp-link-card"><span class="vp-link-mark">${icons.github}</span><span class="vp-link-domain">github.com</span><strong data-i18n="product.linkTitle">Loxonl/vPaste-desktop</strong><small>github.com/Loxonl/vPaste-desktop</small></div>`),
    productCard("file", "product.files", "product.timeHoursLong", "explorer", "product.explorer", `<div class="vp-file-preview">${icons.file}<strong data-i18n="product.fileName">product-brief.pdf</strong></div>`),
    productCard("color", "product.colors", "product.timeMinutesLong", "figma", "product.figma", '<div class="vp-color-preview"><span>#0874E3</span></div>'),
  ].join("");

  const historySurface = () => `
    <div class="vp-app-window">
      ${productBar("all")}
      <div class="vp-card-rail">${historyCards()}</div>
    </div>`;

  const useCasePlaceholder = () => `
    <div class="vp-usecase-placeholder">
      <span data-i18n="usecases.placeholder">IMAGE PLACEHOLDER</span>
      <strong data-i18n="usecases.placeholderSize">1600 × 1060 px</strong>
      <i></i><i></i>
    </div>`;

  const useCaseScenes = Array.from({ length: 5 }, () => useCasePlaceholder);

  const renderProductSurfaces = () => {
    document.querySelectorAll("[data-product-surface]").forEach((surface) => {
      surface.innerHTML = historySurface();
    });
  };

  renderProductSurfaces();

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
  };

  const setPlatform = (platform, persist = true) => {
    const nextPlatform = platform === "macos" ? "macos" : "windows";
    document.documentElement.dataset.platform = nextPlatform;
    platformShortcuts.forEach((element) => {
      element.textContent = nextPlatform === "macos" ? "Option + V" : "Alt + V";
    });
    platformButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.platformButton === nextPlatform));
    });
    const desktop = document.querySelector("[data-platform-desktop]");
    if (persist && desktop && window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.gsap.fromTo(desktop, { scale: 0.992, autoAlpha: 0.76 }, { scale: 1, autoAlpha: 1, duration: 0.42, ease: "power2.out", overwrite: "auto", clearProps: "transform,opacity,visibility" });
    }
    if (persist) writeStorage(STORAGE_KEYS.platform, nextPlatform);
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

  const storedPlatform = readStorage(STORAGE_KEYS.platform);
  const browserPlatform = /Mac/i.test(navigator.userAgent) ? "macos" : "windows";
  setPlatform(storedPlatform || browserPlatform, false);

  const useCaseDeck = document.querySelector("[data-usecase-deck]");
  const useCaseVisual = document.querySelector("[data-usecase-visual]");
  const useCaseButtons = [...document.querySelectorAll("[data-usecase-button]")];
  const useCaseProgress = document.querySelector("[data-usecase-progress]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeUseCase = 0;
  let useCaseTimer = 0;

  const renderUseCase = (index, animate = true) => {
    if (!useCaseVisual || !useCaseScenes[index]) return;
    activeUseCase = index;
    useCaseButtons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-selected", String(buttonIndex === index));
      button.tabIndex = buttonIndex === index ? 0 : -1;
    });
    const replaceScene = () => {
      useCaseVisual.innerHTML = useCaseScenes[index]();
      applyTranslations(useCaseVisual, translations[document.documentElement.dataset.language]);
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    };

    if (animate && window.gsap && useCaseVisual.firstElementChild && !reduceMotion.matches) {
      window.gsap.killTweensOf(useCaseVisual.firstElementChild);
      window.gsap.to(useCaseVisual.firstElementChild, {
        xPercent: -4,
        autoAlpha: 0,
        scale: 0.985,
        duration: 0.24,
        ease: "power2.in",
        onComplete: () => {
          replaceScene();
          const scene = useCaseVisual.firstElementChild;
          window.gsap.fromTo(scene, { xPercent: 5, autoAlpha: 0, scale: 0.985 }, { xPercent: 0, autoAlpha: 1, scale: 1, duration: 0.54, ease: "power3.out", clearProps: "transform,opacity,visibility" });
          window.gsap.from(scene.querySelectorAll(".vp-usecase-placeholder > *"), { y: 12, autoAlpha: 0, stagger: 0.045, duration: 0.36, ease: "power2.out", delay: 0.08, clearProps: "transform,opacity,visibility" });
        },
      });
    } else {
      replaceScene();
    }
  };

  const stopUseCaseTimer = () => {
    window.clearInterval(useCaseTimer);
    useCaseTimer = 0;
    window.gsap?.killTweensOf(useCaseProgress);
  };

  const startUseCaseTimer = () => {
    stopUseCaseTimer();
    if (reduceMotion.matches || document.hidden) return;
    if (useCaseProgress && window.gsap) {
      window.gsap.fromTo(useCaseProgress, { scaleX: 0 }, { scaleX: 1, duration: 5, ease: "none", repeat: -1 });
    }
    useCaseTimer = window.setInterval(() => renderUseCase((activeUseCase + 1) % useCaseScenes.length), 5000);
  };

  useCaseButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      renderUseCase(index);
      startUseCaseTimer();
    });
  });
  useCaseDeck?.addEventListener("mouseenter", stopUseCaseTimer);
  useCaseDeck?.addEventListener("mouseleave", startUseCaseTimer);
  useCaseDeck?.addEventListener("focusin", stopUseCaseTimer);
  useCaseDeck?.addEventListener("focusout", (event) => {
    if (!useCaseDeck.contains(event.relatedTarget)) startUseCaseTimer();
  });
  document.addEventListener("visibilitychange", () => document.hidden ? stopUseCaseTimer() : startUseCaseTimer());
  reduceMotion.addEventListener?.("change", startUseCaseTimer);
  renderUseCase(0, false);
  startUseCaseTimer();

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
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const updateHeader = () => siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const initializeMotion = () => {
    if (!window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    const motionContext = gsap.context(() => {
      const media = gsap.matchMedia();

      gsap.to(".scroll-progress span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: 0.2,
        },
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTimeline
          .from(".site-nav > *", { y: -16, autoAlpha: 0, duration: 0.55, stagger: 0.08 })
          .from("[data-hero-copy]", { y: 28, autoAlpha: 0, duration: 0.72, stagger: 0.08 }, "-=0.24")
          .from("[data-hero-product]", { y: 64, autoAlpha: 0, scale: 0.98, duration: 0.78 }, "-=0.34")
          .from("[data-hero-product] .vp-clip-card", {
            x: 36,
            y: 12,
            autoAlpha: 0,
            scale: 0.94,
            duration: 0.38,
            stagger: 0.065,
            ease: "back.out(1.45)",
            clearProps: "transform,opacity,visibility",
          }, "-=0.42")
          .from(".hero-next", { y: -8, autoAlpha: 0, duration: 0.4 }, "-=0.2");

        return () => heroTimeline.kill();
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([".site-nav > *", "[data-hero-copy]", "[data-hero-product]", "[data-hero-product] .vp-clip-card", ".hero-next"], { clearProps: "all" });
      });

      media.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const shortcutTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".shortcut-section",
            start: "top top",
            end: "+=820",
            pin: "[data-shortcut-pin]",
            pinSpacing: true,
            scrub: 0.9,
            anticipatePin: 1,
          },
        });

        shortcutTimeline
          .fromTo("[data-shortcut-window]", { yPercent: 145, autoAlpha: 0, scale: 0.94 }, { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.4, ease: "power3.out" })
          .from(".shortcut-pulse span", { scaleY: 0, transformOrigin: "bottom", stagger: 0.08, duration: 0.35 }, "-=0.5")
          .to("[data-shortcut-window]", { yPercent: 132, autoAlpha: 0.25, scale: 0.96, duration: 1.2, ease: "power2.in" }, "+=0.45");

        gsap.from("[data-format-art] img", {
          rotate: 4,
          y: 70,
          scale: 0.92,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-format-art]", start: "top 82%" },
        });

        gsap.from("[data-search-art] img", {
          x: -90,
          rotate: -3,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-search-art]", start: "top 82%" },
        });

        gsap.from("[data-privacy-visual] > img", {
          x: 80,
          scale: 0.94,
          autoAlpha: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-privacy-visual]", start: "top 80%" },
        });

        return () => shortcutTimeline.scrollTrigger?.kill();
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch(".format-item", {
          start: "top 88%",
          once: true,
          onEnter: (elements) => gsap.from(elements, { autoAlpha: 0, duration: 0.58, stagger: 0.07, ease: "power2.out" }),
        });

        const useCaseIntro = gsap.timeline({
          scrollTrigger: { trigger: "[data-usecase-deck]", start: "top 82%", once: true },
        });
        useCaseIntro
          .from("[data-usecase-button]", { x: -24, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" })
          .from("[data-usecase-stage]", { x: 42, autoAlpha: 0, scale: 0.985, duration: 0.72, ease: "power3.out" }, "-=0.4")
          .from("[data-usecase-stage] .vp-usecase-placeholder", { y: 18, autoAlpha: 0, duration: 0.42, ease: "power2.out" }, "-=0.34");

        ScrollTrigger.batch(".settings-catalog article, .source-facts > div", {
          start: "top 88%",
          once: true,
          onEnter: (elements) => gsap.from(elements, { y: 28, autoAlpha: 0, duration: 0.56, stagger: 0.08, ease: "power2.out" }),
        });

        gsap.from(".feature-list li", {
          x: 22,
          autoAlpha: 0,
          duration: 0.46,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".feature-list", start: "top 88%", once: true },
        });

        gsap.utils.toArray(".section-copy").forEach((copy) => {
          if (copy.closest(".hero")) return;
          gsap.from(copy.children, {
            y: 24,
            autoAlpha: 0,
            duration: 0.62,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: copy, start: "top 86%", once: true },
          });
        });

        const privacyPath = document.querySelector("[data-privacy-path]");
        if (privacyPath) {
          const length = privacyPath.getTotalLength();
          gsap.set(privacyPath, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(privacyPath, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: privacyPath, start: "top 88%", once: true },
          });
          gsap.from(".privacy-path circle", {
            scale: 0,
            transformOrigin: "center",
            duration: 0.36,
            stagger: 0.18,
            ease: "back.out(2)",
            scrollTrigger: { trigger: privacyPath, start: "top 88%", once: true },
          });
        }
      });

      window.addEventListener("pagehide", () => {
        media.revert();
        motionContext.revert();
      }, { once: true });
    });

    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
  };

  initializeMotion();
})();
