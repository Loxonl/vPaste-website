import {useEffect, useState, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Audio, Easing, Img, cancelRender, continueRender, delayRender, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {cards, cardCss} from './generated/website';
import {scenes} from './promo-timeline';

const blue = '#075be8';
const ink = '#163a70';
const muted = '#4d6588';
const font = '"Segoe UI", "Microsoft YaHei", sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const mix = (t: number, start: number, end: number, a = 0, b = 1) => interpolate(t, [start, end], [a, b], {...clamp, easing: Easing.inOut(Easing.cubic)});
const gate = (t: number, start: number, end: number, duration = .25) => mix(t, start, start + duration) * (1 - mix(t, end - duration, end));
const box = (left: number, top: number, extra: CSSProperties = {}): CSSProperties => ({position: 'absolute', left, top, ...extra});
const names = ['文本', '图片', '链接', '文件', '颜色'];
const facts = ['原格式 / 纯文本', '完整细节预览', '标题与网页预览', '文件、文件夹与路径', 'HEX / RGB / HSL'];
const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,
  code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/></>,
  keyboard: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 9h1m4 0h1m4 0h1M6 12h1m4 0h1m4 0h1M7 16h10"/></>,
  history: <><path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l4 2"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8ZM14 2v6h6M8 13h8m-8 4h5"/></>,
  gear: <><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/></>,
  drive: <><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 14h18M7 17h.1M11 17h.1"/></>,
  check: <path d="m4 12 5 5L20 6"/>,
  arrow: <path d="M3 12h18m-6-6 6 6-6 6"/>,
} as const;
type IconName = keyof typeof paths;
const Icon = ({name, size = 28, style}: {name: IconName; size?: number; style?: CSSProperties}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={style}>{paths[name]}</svg>;
const Pill = ({children, dark = false, style}: {children: ReactNode; dark?: boolean; style?: CSSProperties}) => <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: '15px 25px', borderRadius: 50, border: `1px solid ${dark ? '#ffffff66' : '#cbdcf4'}`, background: dark ? '#ffffff12' : '#ffffff', color: dark ? '#fff' : ink, fontSize: 24, ...style}}>{children}</div>;

// The original website HTML embeds its image bytes. Hold rendering until decoded.
const useCardAssets = () => {
  const [handle] = useState(() => delayRender('Decode website card assets'));
  useEffect(() => {
    const urls = [...new Set(cards.flatMap(card => [...card.matchAll(/src="([^"]+)"/g)].map(match => match[1])))];
    Promise.all(urls.map(src => {const img = new Image(); img.src = src; return img.decode();}))
      .then(() => document.fonts.ready).then(() => continueRender(handle)).catch(cancelRender);
  }, [handle]);
};

const Background = ({t}: {t: number}) => {
  const closing = mix(t, 35, 35.7);
  return <AbsoluteFill style={{background: interpolateColors(closing, [0, 1], ['#fafcff', blue]), overflow: 'hidden'}}>
    <div style={box(70, 152, {right: 70, height: 1, background: closing > .5 ? '#ffffff25' : '#cbdcf480'})}/>
    {(['keyboard', 'history', 'file', 'gear', 'drive', 'code'] as IconName[]).map((name, i) => <Icon key={name} name={name} size={430} style={box(-220 + i * 445 - t * 12, 760 + Math.sin(t * .25 + i) * 28, {color: closing > .5 ? '#fff' : '#3684ff', opacity: .07, transform: `rotate(${-14 + i * 7}deg)`})}/>)}
    <Icon name="code" size={580} style={box(1590 - t * 6, -170, {color: closing > .5 ? '#fff' : '#3684ff', opacity: .065, transform: 'rotate(-15deg)'})}/>
  </AbsoluteFill>;
};

const Headlines = ({t}: {t: number}) => {
  const scene = scenes.find(s => t >= s.from && t < s.to) ?? scenes[scenes.length - 1];
  const local = t - scene.from;
  const inP = scene.from === 0 ? mix(local, -.25, .35) : mix(local, 0, .42);
  const outP = scene.from === 35 ? 1 : 1 - mix(t, scene.to - .2, scene.to);
  const side = t < 7 || (t >= 28 && t < 31);
  const close = t >= 35;
  const compact = t >= 16 && t < 22;
  return <div style={box(side ? 108 : 0, side ? 264 : compact ? 186 : close ? 240 : 203, {width: side ? 710 : 1920, textAlign: side ? 'left' : 'center', color: close ? '#fff' : ink, opacity: inP * outP, transform: `translateY(${(1 - inP) * 40 - (1 - outP) * 18}px)`, zIndex: 10})}>
    <div style={{fontSize: 22, letterSpacing: 4, color: close ? '#b8d6ff' : blue, marginBottom: 24}}>{scene.label}</div>
    <div style={{fontSize: side ? 94 : close ? 100 : compact ? 72 : 88, fontWeight: 650, lineHeight: 1.19, letterSpacing: -4, whiteSpace: 'pre-line'}}>{scene.title}</div>
    <div style={{fontSize: 27, lineHeight: 1.5, color: close ? '#d9e9ff' : muted, marginTop: 26}}>{scene.detail}</div>
    {t < 4 && <div style={{marginTop: 36, display: 'flex', gap: 15}}><Pill>Windows + macOS</Pill><Pill>历史存于本机</Pill></div>}
    {t >= 4 && t < 7 && <div style={{marginTop: 36, display: 'flex', gap: 14}}><Pill><Icon name="keyboard"/>Alt + V</Pill><Pill>macOS：Option + V</Pill></div>}
  </div>;
};

const poses = [
  [0, 818, 488, .87, -7], [.8, 805, 464, .91, -5], [3.7, 805, 464, .91, -5],
  [4.4, 795, 590, .91, 0], [6.6, 795, 590, .91, 0], [7.4, 142, 501, 1.46, 0],
  [9.2, 142, 501, 1.46, 0], [10, 142, 510, 1.46, 0], [11.8, 142, 501, 1.46, 0],
  [15.7, 142, 501, 1.46, 0], [16.35, 299, 678, 1.18, 0], [21.6, 299, 678, 1.18, 0],
  [22.6, 120, 505, 1.5, 0], [27.5, 120, 505, 1.5, 0],
  [28.4, 125, 730, .66, -3], [30.7, 125, 730, .66, -3], [31.45, 150, 530, .82, 0],
  [34.7, 150, 530, .82, 0], [35.6, 500, 1150, .82, 0], [40, 500, 1150, .82, 0],
];
const poseAt = (t: number, col: number) => interpolate(t, poses.map(p => p[0]), poses.map(p => p[col]), {...clamp, easing: Easing.inOut(Easing.cubic)});

const Product = ({t}: {t: number}) => {
  const formats = gate(t, 22, 28, .6);
  const search = gate(t, 13.5, 16, .3);
  const organize = gate(t, 11.5, 13.5, .3);
  const snippet = gate(t, 9.5, 11.5, .35);
  const activeType = Math.min(4, Math.max(0, Math.floor((t - 22.7) / .87)));
  const scale = poseAt(t, 3);
  const tabs = ['全部', '收藏', '文本', '图片', '链接', '颜色', '文件', '+'];
  return <div className="promo-product" style={box(poseAt(t, 1), poseAt(t, 2), {width: 1120, height: 270, transformOrigin: '0 0', transform: `rotate(${poseAt(t, 4)}deg) scale(${scale})`, zIndex: 3})}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 14, border: '1px solid #bbc9d3', background: '#edf0ed', boxShadow: '0 30px 65px -25px #163a7040', opacity: 1 - formats}}/>
    <div style={box(0, 0, {width: 1120, height: 48, display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px', borderBottom: '1px solid #ced6d8', background: '#ffffff90', borderRadius: '14px 14px 0 0', opacity: 1 - formats})}>
      <Icon name="search" size={20}/>
      <div style={{width: 276 * search, opacity: search, height: 32, overflow: 'hidden', border: search > 0 ? '1.5px solid #075be8' : 'none', borderRadius: 7, background: '#fff', fontSize: 17, lineHeight: '29px', paddingLeft: search * 10, whiteSpace: 'nowrap', color: '#243e4b'}}>{'vPaste'.slice(0, Math.floor(mix(t, 13.9, 14.55, 0, 6)))}<span style={{color: blue}}>│</span></div>
      {tabs.map((tab, i) => {const active = organize > .5 ? i === 1 : i === 0; return <div key={tab} style={{height: 48, display: 'flex', alignItems: 'center', gap: 5, padding: '0 12px', fontSize: 14, color: active ? blue : '#65757a', fontWeight: active ? 700 : 500, borderBottom: active ? `3px solid ${blue}` : '3px solid transparent'}}>{i === 1 && <Icon name="star" size={16}/>} {tab}</div>;})}
      <Icon name="gear" size={21} style={{marginLeft: 'auto'}}/>
    </div>
    {cards.map((html, i) => {
      const baseX = 16 + i * 182;
      const selected = formats > .1 && i === activeType;
      const typeLift = selected ? mix(t, 22.7 + activeType * .87, 23 + activeType * .87) : 0;
      let x = baseX + formats * (i * 224 + 25 - baseX);
      let y = 68 - formats * (70 + typeLift * 15);
      let cardScale = 1 + formats * (.1 + typeLift * .07);
      let opacity = i === 5 ? 1 - formats : 1;
      if (i === 5) {x -= snippet * 380; y -= snippet * 35; cardScale += snippet * .12;}
      if (i === 3 || i === 4) opacity *= 1 - snippet * .8;
      if (![0, 2, 5].includes(i)) opacity *= 1 - search;
      if (i === 2) x -= search * 182;
      if (i === 5) x -= search * 546;
      if (organize > 0) {opacity *= [0, 2].includes(i) ? 1 : 1 - organize * .78; if (i === 2) x -= organize * 182;}
      if (t >= 7 && t < 9.5) y += (1 - mix(t, 7.1 + i * .07, 7.7 + i * .07)) * 65;
      return <div key={i} style={box(x, y, {opacity, transformOrigin: '50% 50%', transform: `scale(${cardScale}) rotate(${formats * (i - 2) * 1.6}deg)`, zIndex: selected || (i === 5 && snippet > 0) ? 5 : 1})}>
        <div className="vp-product-surface" style={{overflow: 'visible', minHeight: 0, background: 'transparent', outline: selected ? '2px solid #075be8' : 'none', outlineOffset: 6, borderRadius: 14}} dangerouslySetInnerHTML={{__html: html}}/>
        {i < 5 && <div style={{position: 'absolute', left: -20, width: 208, top: 218, textAlign: 'center', color: ink, opacity: formats}}><div style={{fontSize: 26, fontWeight: 650}}>{names[i]}</div><div style={{fontSize: 13.5, marginTop: 10, color: muted}}>{facts[i]}</div></div>}
      </div>;
    })}
    <div style={box(310, 280, {opacity: snippet, display: 'flex', gap: 10})}><Pill style={{fontSize: 17, padding: '10px 18px', background: blue, color: '#fff'}}>保留原有格式</Pill><Pill style={{fontSize: 17, padding: '10px 18px'}}>纯文本粘贴</Pill></div>
  </div>;
};

const Window = ({title, children, style}: {title: string; children: ReactNode; style?: CSSProperties}) => <div style={{borderRadius: 20, border: '1px solid #b8cbe4', background: '#fff', boxShadow: '0 25px 65px -20px #163a7033', overflow: 'hidden', ...style}}><div style={{padding: '16px 24px', display: 'flex', alignItems: 'center', fontSize: 21, color: muted, borderBottom: '1px solid #e2eaf4'}}>{title}<span style={{marginLeft: 'auto', color: '#99a7b8'}}>− &nbsp; □ &nbsp; ×</span></div>{children}</div>;

const FeatureOverlays = ({t}: {t: number}) => {
  const desktop = gate(t, 4, 7, .5);
  const preview = gate(t, 16, 18, .25);
  const queue = gate(t, 18, 20, .22);
  const drag = gate(t, 20, 22, .22);
  const travel = mix(t, 20.45, 21.3);
  const fields = ['hello@example.com', '上海市 · 示例路 18 号', '200000'];
  return <>
    {desktop > 0 && <div style={box(745, 237, {width: 1105, height: 605, border: '7px solid #163a70', borderRadius: 25, overflow: 'hidden', opacity: desktop, transform: `scale(${.85 + desktop * .15})`, boxShadow: '0 30px 75px -30px #163a7040'})}><Img src={staticFile('promo/desktop-windows.webp')} style={{width: '100%', height: '100%', objectFit: 'cover'}}/><div style={box(380, 130, {fontSize: 32, color: '#204164', opacity: desktop})}>你的桌面</div></div>}
    {preview > 0 && <div style={box(1110, 410, {width: 510, opacity: preview, transform: `translateY(${(1-preview)*45}px) scale(${.94 + preview*.06})`, zIndex: 8})}><div style={{padding: 12, border: '1px solid #b8cbe4', borderRadius: 18, background: '#fff', boxShadow: '0 25px 65px -20px #163a7033'}}><Img src={staticFile('promo/format-stack.webp')} style={{display: 'block', width: '100%', height: 230, objectFit: 'contain', background: '#f4f7f5', borderRadius: 10}}/></div><div style={box(-650, 95)}><Pill><Icon name="keyboard"/>Space</Pill><div style={{fontSize: 27, color: muted, marginTop: 20}}>大图与完整内容，先看清楚</div></div></div>}
    {queue > 0 && <div style={{opacity: queue, zIndex: 8}}><Window title="粘贴队列" style={box(345, 404, {width: 505})}><div style={{padding: '10px 23px'}}>{fields.map((value, i) => <div key={value} style={{height: 61, display: 'flex', alignItems: 'center', gap: 16, fontSize: 20, borderBottom: i < 2 ? '1px solid #edf1f6' : 'none', color: ink, opacity: .3 + .7 * (1 - mix(t, 18.65 + i * .25, 18.85 + i * .25))}}><span style={{color: '#aab4c1'}}>⠿</span>{value}</div>)}</div></Window><Icon name="arrow" size={56} style={box(930, 498, {color: blue})}/><Window title="收件信息" style={box(1070, 404, {width: 505})}><div style={{padding: '10px 23px'}}>{fields.map((value, i) => <div key={value} style={{height: 61, display: 'flex', alignItems: 'center', fontSize: 20, color: ink, borderBottom: i < 2 ? '1px solid #edf1f6' : 'none'}}><span style={{width: 100, color: muted, fontSize: 16}}>{['电子邮箱', '收件地址', '邮政编码'][i]}</span><span style={{opacity: mix(t, 18.65 + i * .25, 18.85 + i * .25)}}>{value}</span></div>)}</div></Window></div>}
    {drag > 0 && <div style={{opacity: drag, zIndex: 8}}><Window title="项目笔记" style={box(1110, 404, {width: 520})}><div style={{height: 215, padding: 18}}><div style={{height: '100%', border: `2px dashed ${travel > .8 ? blue : '#cad8ec'}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: muted, fontSize: 23, background: '#f7faff'}}>{travel < 1 ? '把图片拖入文档' : <Img src={staticFile('promo/format-stack.webp')} style={{height: '100%', width: '100%', objectFit: 'contain'}}/>}</div></div></Window><div style={box(510, 478, {fontSize: 28, color: muted})}>从剪贴卡片，直接拖入</div><div style={box(515 + travel * 710, 815 - travel * 332, {opacity: 1 - mix(t, 21.28, 21.45), transform: 'rotate(-7deg)'})}><Img src={staticFile('promo/format-stack.webp')} style={{width: 180, height: 125, objectFit: 'cover', borderRadius: 10, boxShadow: '0 15px 30px #163a7030'}}/><svg width="34" height="42" viewBox="0 0 24 30" style={box(150, 95)}><path d="M2 2v24l7-7 5 10 5-3-6-10h10Z" fill={blue} stroke="#fff" strokeWidth="2"/></svg></div></div>}
  </>;
};

const ClosingScenes = ({t}: {t: number}) => {
  const settings = gate(t, 28, 31, .4);
  const privacy = gate(t, 31, 35, .4);
  const closing = mix(t, 35.5, 36.1);
  return <>
    {settings > 0 && <div style={box(977, 205, {width: 818, opacity: settings, transformOrigin: '85% 100%', transform: `scale(${.8 + settings * .2})`, borderRadius: 18, overflow: 'hidden', border: '1px solid #cbdcf4', boxShadow: '0 35px 75px -30px #163a7040'})}><Img src={staticFile('promo/settings-theme-zh.webp')} style={{display: 'block', width: '100%'}}/></div>}
    {privacy > 0 && <div style={{opacity: privacy, zIndex: 6}}>
      <div style={box(1260, 487, {width: 245, height: 245, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, background: '#eaf3ff', border: '1px solid #a6bfe5', color: blue})}><Icon name="drive" size={115}/><div style={box(177, 172, {borderRadius: 30, padding: 12, background: blue, color: '#fff'})}><Icon name="check" size={28}/></div></div>
      {[0, 1, 2].map(i => {const p = mix(t, 31.45 + i * .25, 32.45 + i * .25); return <div key={i} style={box(930 + p * 350, 620 - Math.sin(p * Math.PI) * 75, {width: 40, height: 50, borderRadius: 7, background: blue, opacity: gate(p, .02, .98, .15) * .7, transform: `rotate(${p * 15}deg)`})}/>;})}
      <div style={box(150, 828, {display: 'flex', gap: 18})}><Pill><Icon name="check"/>敏感内容与应用排除</Pill><Pill><Icon name="drive"/>Windows ↔ Mac 手动迁移历史</Pill></div>
      <div style={box(1190, 767, {fontSize: 27, color: ink})}>保存在你的设备上</div>
      <div style={box(151, 914, {fontSize: 19, color: muted})}>开启链接预览时，会请求对应网页。</div>
    </div>}
    {t >= 35 && <div style={{opacity: closing, color: '#fff', zIndex: 10}}>
      <div style={box(0, 624, {width: 1920, display: 'flex', gap: 24, justifyContent: 'center', transform: `translateY(${(1-closing)*25}px)`})}><Pill dark><Icon name="code"/>代码可审查</Pill><Pill dark><Icon name="drive"/>本机历史架构</Pill><Pill dark><Icon name="history"/>发布记录公开</Pill></div>
      <div style={box(0, 765, {width: 1920, textAlign: 'center', fontSize: 63, fontWeight: 650, letterSpacing: -1})}>vpaste.app <span style={{fontSize: 42, marginLeft: 20}}>↗</span></div>
      <div style={box(0, 857, {width: 1920, textAlign: 'center', fontSize: 25, color: '#c8dfff'})}>下载 vPaste，让每次复制都有用。</div>
    </div>}
  </>;
};

export const VpastePromo = () => {
  useCardAssets();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const closing = mix(t, 35, 35.7);
  const scene = scenes.find(s => t >= s.from && t < s.to) ?? scenes[scenes.length - 1];
  return <AbsoluteFill style={{fontFamily: font, color: ink, overflow: 'hidden'}}>
    <style>{`${cardCss}\n.promo-product * {box-sizing:border-box} .promo-product .vp-product-surface {--vp-card-width:168px;--vp-card-height:184px;--vp-card-header:48px;--vp-source-frame:60px;--vp-source-height:58px;--vp-source-icon:54px;--vp-source-offset:-4px} .promo-product svg {fill:none;stroke:currentColor} .sr-only {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)} .promo-product .vp-rich-card table {min-width:0;width:100%;font-size:6px}.promo-product .vp-rich-card th,.promo-product .vp-rich-card td{padding:7px 3px} .promo-product .vp-clip-card{border-radius:12px} `}</style>
    <Audio src={staticFile('promo/soundtrack.wav')} volume={.68}/>
    <Background t={t}/>
    <div style={box(80, 57, {display: 'flex', alignItems: 'center', gap: 17, zIndex: 20, color: interpolateColors(closing, [0, 1], [ink, '#fff'])})}><div style={{background: closing > .5 ? '#fff' : blue, borderRadius: 16, width: 58, height: 58, display: 'grid', placeItems: 'center'}}><Img src={staticFile('promo/vpaste-tray.svg')} style={{width: 36, height: 36, filter: closing > .5 ? 'none' : 'brightness(0) invert(1)'}}/></div><span style={{fontSize: 37, fontWeight: 700, letterSpacing: -1}}>vPaste</span></div>
    <div style={box(1580, 78, {fontSize: 18, letterSpacing: 2, color: closing > .5 ? '#b8d6ff' : muted})}>COPY. FIND. PASTE.</div>
    <FeatureOverlays t={t}/>
    <Product t={t}/>
    <Headlines t={t}/>
    <ClosingScenes t={t}/>
    <div style={box(80, 1008, {right: 80, display: 'flex', alignItems: 'center', gap: 38, zIndex: 20})}>{['一键呼出', '高效工作流', '内容类型', '个性设置', '本机存储', '开源透明'].map((name, i) => <div key={name} style={{fontSize: 18, color: closing > .5 ? '#fff' : i === scene.chapter ? blue : '#7890b0', opacity: i === scene.chapter ? 1 : .55, display: 'flex', alignItems: 'center', gap: 11}}><span style={{width: i === scene.chapter ? 30 : 7, height: 7, borderRadius: 8, background: 'currentColor'}}/>{name}</div>)}<div style={{marginLeft: 'auto', color: closing > .5 ? '#b8d6ff' : '#7890b0', fontSize: 18}}>vpaste.app</div></div>
    <div style={box(0, 1076, {height: 4, width: 1920 * frame / 1199, background: closing > .5 ? '#89bdff' : blue})}/>
  </AbsoluteFill>;
};
