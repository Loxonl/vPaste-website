(() => {
  // Same public examples used on the website; no local clipboard or database access.
  const base = '/native/assets/';
  const now = Date.now();
  const records = [
    ['Text', '剪贴捷径，一键即达。', 'Microsoft Word', '#185abd', ''],
    ['Image', base+'format-stack.png', 'WeChat', '#07b75b', ''],
    ['Link', 'https://vpaste.app|||'+base+'vpaste-logo.png|||vPaste · 剪贴捷径，一键即达|||icon', 'Google Chrome', '#d83c35', ''],
    ['File', JSON.stringify(['C:/Demo/vPaste Intro.pdf']), '文件资源管理器', '#ba8709', ''],
    ['Color', '#F24E1E', 'Figma', '#9c3028', ''],
    ['Text', 'vPaste 文本 / 链接 / 颜色', 'Microsoft Excel', '#087747', '<table><tr><th>内容</th><th>类型</th></tr><tr><td><b>vPaste 文本</b></td><td>纯文本</td></tr><tr><td><a href="https://vpaste.app">vpaste.app</a></td><td>链接</td></tr><tr><td>#2563EB</td><td>颜色</td></tr></table>'],
  ].map(([itemType,content,appSource,titleColor,richHtml], i)=>({id:6-i,hash:'public-demo-'+i,itemType,content,appSource,titleColor,richHtml,time:now-i*60000,previewContent:itemType==='Image'?content:'',textContent:'',appIconPath:base+'apps/'+['word.svg','wechat.png','chrome.png','explorer.png','figma.png','excel.svg'][i],label:0,tags:[]}));
  let nextId = 0;
  const callbacks = new Map();
  const listeners = new Map();
  window.__TAURI_INTERNALS__ = {
    invoke: async (command, args={}) => {
      if(command.startsWith('plugin:log')) console.log(command,JSON.stringify(args));
      if(command==='get_config') return JSON.stringify({multilingual:'Chinese',theme_mode:'light',onboarding_completed:true,retain_last_position:false,retain_search_history:false});
      if(command==='search') {const list = records.filter(r=>!args.keywords || r.content.toLowerCase().includes(args.keywords.toLowerCase()));return JSON.stringify({list,consumed:list.length,hasMore:false,nextId:0,nextTime:0})}
      if(command==='get_custom_tabs') return ['Text','Image','Link','File','Color'].map((type,i)=>({id:type,name:['文本','图片','链接','文件','颜色'][i],filter:{itemType:type,appSource:'',appSources:[],favorite:'any',relativeAmount:'',relativeUnit:'day'}}));
      if(['list_language_packs','list_item_tags','refresh_link_previews'].includes(command)) return [];
      if(command==='get_developer_mode') return false;
      if(command==='get_paste_queue_state') return {active:false,revision:0};
      if(command==='check_paste_accessibility_permission') return {granted:true};
      if(command==='get_update_state') return {status:'disabled',currentVersion:'',downloadedBytes:0,portable:false,feedEnabled:false,releaseUrl:''};
      if(command==='history_image_metadata') return {width:1200,height:800,isGif:false};
      if(['history_image_card_preview_asset_path','history_file_preview_asset_path','history_file_data_url'].includes(command)) return args.path;
      if(command==='file_preview_info') return {kind:'single-icon',paths:['C:/Demo/vPaste Intro.pdf'],exists:true,missing_paths:[],display_path:'C:/Demo/vPaste Intro.pdf',secondary_text:'',extension:'pdf',preview_path:''};
      if(command==='plugin:event|listen') {listeners.set(args.event,args.handler);return ++nextId}
      if(command==='plugin:window|scale_factor') return 1;
      if(command==='plugin:window|inner_size') return {width:1920,height:302};
      return null;
    },
    transformCallback: cb=>{callbacks.set(++nextId,cb);return nextId},
    unregisterCallback:()=>{},
    convertFileSrc:value=>value,
    metadata:{currentWindow:{label:'clipboard'},currentWebview:{label:'clipboard'}},
  };
  localStorage.setItem('vpaste.themeMode','light');
})();
