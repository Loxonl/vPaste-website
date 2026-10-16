import {useEffect, useState, type CSSProperties, type ReactNode} from 'react';
import {AbsoluteFill, Audio, Easing, Img, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {cards, englishCards, cardCss} from './generated/website';
import {revisedScenes, revisedEnglishScenes} from './revised-timeline';
import {revisedCopy, type RevisedLanguage} from './revised-copy';
import clientIcons from './client-icons.json';
import keypresses from './revised-keypresses.json';
import timing from './revised-timing.json';

const blue = '#075be8';
const ink = '#163a70';
const muted = '#4d6588';
const paper = '#fafcff';
const font = '"Segoe UI", "Microsoft YaHei", sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (t: number, a: number, b: number, x = 0, y = 1) => interpolate(t, [a, b], [x, y], {...clamp, easing: Easing.inOut(Easing.cubic)});
const blend = (a: number, b: number, p: number) => a + (b - a) * p;
const gate = (t: number, a: number, b: number, d = .25) => ease(t, a, a + d) * (1 - ease(t, b - d, b));
const at = (left: number, top: number, style: CSSProperties = {}): CSSProperties => ({position: 'absolute', left, top, ...style});
// All card centres lie on one circle; rotation follows the same radial angle.
const fanCards = revisedCopy.zh.types.map((_, i) => {
  const rotation = (i-2)*11;
  const radians = rotation*Math.PI/180;
  const cx = 960+1750*Math.sin(radians);
  const cy = 2340-1750*Math.cos(radians);
  const halfHeight = 134.4*Math.abs(Math.sin(radians))+147.2*Math.cos(radians);
  return {x:cx-134.4,y:cy-147.2,rotation,labelX:cx-154,labelY:cy+halfHeight+32};
});
const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>,
  // Same Material icons as the client's ClipboardHeader.tsx.
  all: <path d={clientIcons.all} fill="currentColor" stroke="none"/>,
  gear: <path d={clientIcons.gear} fill="currentColor" stroke="none"/>,
  queue: <path d={clientIcons.queue} fill="currentColor" stroke="none"/>,
  arrow: <path d="M3 12h18m-6-6 6 6-6 6"/>,
  check: <path d="m4 12 5 5L20 6"/>,
  archive: <><rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/></>,
  pin: <><path d="M9 3h6v6l3 3v2H6v-2l3-3ZM8 3h8M12 14v7"/></>,
};
const Icon = ({name, size = 28, style}: {name: keyof typeof paths; size?: number; style?: CSSProperties}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={style}>{paths[name]}</svg>;
const Cursor = ({x, y, click = false, opacity = 1}: {x: number; y: number; click?: boolean; opacity?: number}) => <svg width="36" height="44" viewBox="0 0 30 38" style={at(x, y, {opacity, zIndex: 30, transform: `scale(${click ? .86 : 1})`, filter: 'drop-shadow(0 2px 3px #163a7030)'})}><path d="M3 2v29l8-8 7 13 6-3-7-13h11Z" fill={blue} stroke="#fff" strokeWidth="2.2"/></svg>;

const KeyboardHint = ({t, from, to, top, keys, presses, label}: {t:number;from:number;to:number;top:number;keys:string[];presses:number[];label:string}) => {
  const lastPress = presses.filter(time => t >= time).at(-1);
  const press = lastPress === undefined ? 0 : 1-ease(t, lastPress+.06, lastPress+.16);
  return <div style={at(80,top,{width:1760,display:'flex',alignItems:'center',justifyContent:'center',gap:14,opacity:gate(t,from,to,.15),zIndex:16})}>
    {keys.map((key,i) => <div key={i} style={{display:'flex',alignItems:'center',gap:14}}>
      {i>0&&<span style={{fontSize:25,color:muted}}>+</span>}
      <div style={{minWidth:64,height:52,padding:'0 19px',display:'grid',placeItems:'center',borderRadius:10,border:`1.5px solid ${blue}`,fontSize:27,fontWeight:600,background:press>.1?blue:'#fff',color:press>.1?'#fff':blue,transform:`translateY(${press*4}px)`,boxShadow:`0 ${4*(1-press)}px 0 #b8cdee`}}>{key}</div>
    </div>)}
    <span style={{fontSize:24,color:muted,marginLeft:10}}>{label}</span>
  </div>;
};

function useWebsiteAssets() {
  const [handle] = useState(() => delayRender('Load original website cards'));
  useEffect(() => {
    const urls = [...new Set(cards.flatMap(html => [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1])))];
    Promise.all(urls.map(src => {const img = new Image(); img.src = src; return img.decode();}))
      .then(() => document.fonts.ready).then(() => continueRender(handle)).catch(cancelRender);
    return () => continueRender(handle);
  }, [handle]);
}

const Card = ({language, index, x, y, scale, rotation = 0, opacity = 1, selected = false, zIndex = 3}: {language: RevisedLanguage; index: number; x: number; y: number; scale: number; rotation?: number; opacity?: number; selected?: boolean; zIndex?: number}) => <div style={at(x, y, {width: 168, height: 184, opacity, transformOrigin: '50% 50%', transform: `translate(${(scale-1)*84}px, ${(scale-1)*92}px) scale(${scale}) rotate(${rotation}deg)`, zIndex})}>
  <div className="vp-product-surface" style={{background: 'transparent', minHeight: 0, overflow: 'visible', outline: selected ? `2px solid ${blue}` : undefined, outlineOffset: 5, borderRadius: 12}} dangerouslySetInnerHTML={{__html: (language==='en'?englishCards:cards)[index]}}/>
</div>;

const poses = [
  [0, 176, 1120, 1.4], [.45, 176, 1120, 1.4], [1.3, 176, 688, 1.4], [2.4, 176, 688, 1.4],
  [3.3, 80, 478, 11/7], [9.15, 80, 478, 11/7], [9.7, 80, 565, 11/7],
  [12, 80, 565, 11/7], [12.6, 80, 478, 11/7], [keypresses.preview[0], 80, 478, 11/7],
  [20.2, 361, 756, 1.07], [22.2, 361, 756, 1.07], [22.8, 568, 874, .7],
  [26.2, 568, 874, .7], [26.8, 378, 756, 1.04], [29.2, 378, 756, 1.04],
  [29.7, 378, 756, 1.04], [37.5, 378, 756, 1.04],
];
const pose = (t: number, col: number) => interpolate(t, poses.map(p => p[0]), poses.map(p => p[col]), {...clamp, easing: Easing.inOut(Easing.cubic)});
const categorySteps = [
  {at: 12.6, tab: 1, cards: [0, 2]},
  {at: 13.3, tab: 2, cards: [0, 5]},
  {at: 14, tab: 3, cards: [1]},
  {at: 14.7, tab: 7, cards: [0, 2, 3]},
];
// Default type emoji from the client's clipboardTutorial.ts.
const tabEmoji = ['', '', '📝', '🖼️', '🔗', '🎨', '📁', ''];

const Product = ({t, language}: {t: number; language: RevisedLanguage}) => {
  const copy = revisedCopy[language];
  const tabWidths = language==='en' ? [64,106,82,90,82,90,80,90] : [82,88,88,88,88,88,88,88];
  const tabCenter = (index: number) => 54 + tabWidths.slice(0, index).reduce((a,b) => a+b, 0) + tabWidths[index]/2;
  const x = pose(t, 1), y = pose(t, 2), scale = pose(t, 3);
  const fan = gate(t, 5, 9, .45);
  const formatting = gate(t, 9.15, 12.3, .45);
  const categories = gate(t, 12.3, 15.3, .2);
  const searching = gate(t, 15.9, 18.5, .25);
  const searchResults = gate(t, keypresses.searchResultsAt, 18.5, .2);
  const local = gate(t, 31.5, 37.5, .3);
  const visibility = 1 - gate(t, 29.3, 31.7, .3);
  const shell = (1-fan) * (1-local) * visibility;
  const step = categorySteps.filter(s => t >= s.at).at(-1);
  const activeTab = categories > .1 && step ? step.tab : 0;
  const stepsBefore = categorySteps.filter(s => t >= s.at);
  const previousCards = stepsBefore.at(-2)?.cards ?? [0,1,2,3,4,5];
  const change = step ? ease(t, step.at, step.at+.22) : 0;
  const nextStep = categorySteps.find(s => t < s.at);
  const cursorX = nextStep ? blend(tabCenter(activeTab), tabCenter(nextStep.tab), ease(t,nextStep.at-.18,nextStep.at)) : tabCenter(activeTab);
  return <>
    <div style={at(x, y, {width: 1120, height: 270, transform: `scale(${scale})`, transformOrigin: '0 0', opacity: shell, border: '1px solid #bbc9d3', borderRadius: 14, background: '#edf0ed', boxShadow: '0 22px 60px -25px #163a7038'})}/>
    <div style={at(x, y, {width: 1120, height: 48, transform: `scale(${scale})`, transformOrigin: '0 0', display: 'flex', alignItems: 'center', padding: '0 20px', opacity: shell, background: '#ffffff90', borderRadius: '14px 14px 0 0', borderBottom: '1px solid #cad4da'})}>
      <Icon name="search" size={22} style={{flexShrink:0}}/>
      <div style={{marginLeft: 12, width: 212*searching, overflow: 'hidden', opacity: searching, flexShrink: 0, height: 32, border: searching > 0 ? `1.5px solid ${blue}` : 'none', borderRadius: 7, fontSize: 17, lineHeight: '29px', paddingLeft: 8*searching, background: '#fff', color: ink, whiteSpace: 'nowrap'}}>{'vPaste'.slice(0, keypresses.search.filter(time=>t>=time).length)}<span style={{color: blue}}>│</span></div>
      {copy.tabs.map((label,i) => <div key={label} style={{width: tabWidths[i], height: 48, flexShrink: 0, display: 'flex', gap: 5, alignItems: 'center', justifyContent: 'center', fontSize: 16, whiteSpace:'nowrap', color: i===activeTab ? blue : '#65757a', fontWeight: i===activeTab ? 700 : 500, borderBottom: i===activeTab ? `3px solid ${blue}` : '3px solid transparent'}}>{i<2 && <Icon name={i===0?'all':'star'} size={16}/>} {tabEmoji[i]&&<span style={{fontFamily:'"Segoe UI Emoji", sans-serif'}}>{tabEmoji[i]}</span>}{i===7 && <span style={{background: '#9670dd', width: 7, height: 7, borderRadius: '50%'}}/>}{label}</div>)}
      <div style={{marginLeft:'auto',display:'flex',gap:14,paddingLeft:14,flexShrink:0,color:'#65757a'}}><Icon name="queue" size={22}/><Icon name="gear" size={22}/></div>
    </div>
    <AbsoluteFill style={{background:paper,opacity:formatting*.94,zIndex:5}}/>
    {cards.map((html,i) => {
      const stagger = gate(t, 5.05+i*.14, 9, .5);
      // Let the fan settle, then lift each card smoothly out of its actual slot.
      const liftDelay = i===5 ? .15 : 0;
      const lift = ease(t,9.25+liftDelay,10.1+liftDelay)*(1-ease(t,11.9,12.3));
      let px = x+(16+i*182)*scale, py=y+68*scale, s=scale, rotation=0, opacity=visibility;
      if(i<5) {
        px=blend(px, fanCards[i].x, stagger); py=blend(py, fanCards[i].y, stagger);
        s=blend(s, 1.6, stagger); rotation=fanCards[i].rotation*stagger;
      } else opacity*=1-fan;
      if(i===0 || i===5) {
        px=blend(px, i===0 ? 540 : 1048, lift); py=blend(py, 438, lift); s=blend(s, 1.98, lift);
      } else opacity*=1-formatting*.86;
      if(categories && step) {
        const before=previousCards.indexOf(i), after=step.cards.indexOf(i);
        const slot=blend(before<0?i:before, after<0?i:after, change);
        px=blend(px, x+(16+slot*182)*scale, categories);
        opacity*=blend(1, blend(before<0?0:1,after<0?0:1,change), categories);
      }
      const results=[0,2,5];
      if(searchResults) {const slot=results.indexOf(i); px=blend(px, x+(16+Math.max(0,slot)*182)*scale, searchResults); if(slot<0) opacity*=1-searchResults;}
      px=blend(px,197+i*260,local); py=blend(py,326,local); s=blend(s,1.35,local);
      const selected=Boolean((lift>.6 && (i===0||i===5)) || (t>=19.1&&t<22.5&&i===1) || (t>=26.5&&t<29.5&&i===1));
      return <div key={html.slice(0,60)+i}>
        <Card language={language} index={i} x={px} y={py} scale={s} rotation={rotation} opacity={opacity} selected={selected} zIndex={selected||(formatting>0&&(i===0||i===5))?7:3}/>
        {i<5 && <div style={at(fanCards[i].labelX, fanCards[i].labelY, {width: 308, textAlign: 'center', fontSize: 33, fontWeight: 600, color: ink, opacity: stagger})}>{copy.types[i]}</div>}
        {(i===0||i===5) && <div style={at(i===0?515:1023, 840, {width: 384, textAlign: 'center', fontSize: 30, color: ink, opacity:ease(t,9.85+liftDelay,10.25+liftDelay)*(1-ease(t,11.9,12.3)),zIndex:8})}>{copy.formatLabels[i===0?0:1]}</div>}
      </div>;
    })}
    {categories>.1 && <Cursor x={x+cursorX*scale} y={y+33*scale} click={Boolean(step&&t-step.at<.16)} opacity={categories}/>}
    {t>=15.65&&t<16.25&&<Cursor x={x+24*scale} y={y+27*scale} click={t>=15.9&&t<16.06} opacity={gate(t,15.65,16.25,.15)}/>}
  </>;
};

const Heading = ({t, language}: {t:number; language:RevisedLanguage}) => {
  const index = revisedScenes.findIndex(s=>t>=s.from&&t<s.to);
  const shot = revisedScenes[index];
  if(!shot || t>=37.5) return null;
  const copy = language==='en' ? revisedEnglishScenes[index] : shot;
  const p=gate(t, shot.from, shot.to, .22);
  const overlay=t>=18.5&&t<29.5;
  return <div style={at(80, overlay?70:116, {width:1760,textAlign:'center',opacity:p,transform:`translateY(${(1-ease(t,shot.from,shot.from+.3))*22}px)`,zIndex:15})}>
    <div data-video-title style={{fontSize: t>=31.5?83:92,fontWeight:650,lineHeight:1.2,letterSpacing:language==='en'?-1:-3}}>{copy.title}</div>
    <div data-video-detail style={{fontSize:32,color:muted,lineHeight:1.5,marginTop:24}}>{copy.detail}</div>
  </div>;
};

const Panel = ({title, children, style}: {title:string;children:ReactNode;style:CSSProperties}) => <div style={{border:'1px solid #c0cee1',borderRadius:20,background:'#fff',boxShadow:'0 24px 60px -22px #163a7033',overflow:'hidden',...style}}><div style={{height:68,padding:'0 25px',display:'flex',alignItems:'center',borderBottom:'1px solid #e1e9f2',fontSize:27,fontWeight:600,color:ink}}>{title}<span style={{marginLeft:'auto',fontSize:20,fontWeight:400,color:'#95a4b7'}}>− &nbsp; □ &nbsp; ×</span></div>{children}</div>;

const Preview = ({t}:{t:number}) => <div style={at(588,315,{width:744,height:430,padding:14,borderRadius:20,background:'#fff',border:'1px solid #bdcde2',boxShadow:'0 25px 65px -18px #163a7040',opacity:gate(t,keypresses.previewOpensAt,22.5,.35),transform:`scale(${ease(t,keypresses.previewOpensAt,keypresses.previewOpensAt+.4,.94,1)})`,zIndex:9})}>
  <Img src={staticFile('promo/format-stack.webp')} style={{width:'100%',height:'100%',objectFit:'contain',background:'#f4f7f5',borderRadius:10}}/>
  <Icon name="pin" size={24} style={at(703,22,{color:muted})}/>
</div>;

const pasteTimes=keypresses.paste;
const Queue = ({t, language}:{t:number; language:RevisedLanguage}) => {
  const copy = revisedCopy[language];
  const values = copy.values;
  const p=gate(t,22.5,26.5);
  const consumed=pasteTimes.filter(time=>t>=time+.22).length;
  return <div style={{opacity:p}}>
    <Panel title={`${copy.queue}    ${3-consumed} / 100`} style={at(260,350,{width:610,height:435,zIndex:9})}>
      <div style={{padding:'15px 25px'}}>{values.map((value,i) => {
        const passed=ease(t,pasteTimes[i],pasteTimes[i]+.23);
        const entered=ease(t,22.8+i*.12,23+i*.12);
        return <div key={value} style={{height:90*(1-passed),overflow:'hidden',opacity:entered*(1-passed),display:'flex',alignItems:'center',gap:16,borderBottom:'1px solid #e9eef5'}}><span style={{color:'#99a8bc',fontSize:29}}>⠿</span><div style={{fontSize:26,color:ink}}>{value}<div style={{fontSize:18,color:i===consumed?blue:muted,marginTop:6}}>{i===consumed?copy.next:copy.text}</div></div></div>;
      })}{consumed===3&&<div style={{height:190,display:'grid',placeItems:'center',fontSize:29,color:blue}}><div><Icon name="check" size={40}/> {copy.queueDone}</div></div>}</div>
    </Panel>
    <Icon name="arrow" size={70} style={at(925,510,{color:blue,zIndex:9})}/>
    <Panel title={copy.form} style={at(1050,350,{width:610,height:435,zIndex:9})}>
      <div style={{padding:'15px 25px'}}>{values.map((value,i) => <div key={value} style={{height:108,padding:'8px 0',borderBottom:i<2?'1px solid #e9eef5':undefined}}><div style={{fontSize:21,color:muted,marginBottom:11}}>{copy.fields[i]}</div><div style={{fontSize:27,color:ink,opacity:ease(t,pasteTimes[i],pasteTimes[i]+.25)}}>{value}</div></div>)}</div>
    </Panel>
    <KeyboardHint t={t} from={22.7} to={26.5} top={807} keys={['Ctrl / ⌘','V']} presses={pasteTimes} label={copy.paste}/>
  </div>;
};

const Drag = ({t, language}:{t:number; language:RevisedLanguage}) => {
  const copy = revisedCopy[language];
  const opacity=gate(t,26.5,29.5);
  const travel=ease(t,27.05,28.5);
  const dropped=ease(t,28.45,28.65);
  const sourceX=378+(16+182)*1.04,sourceY=756+68*1.04;
  const x=blend(sourceX,830,travel),y=blend(sourceY,454,travel);
  return <div style={{opacity}}>
    <Panel title={copy.document} style={at(530,310,{width:860,height:425,zIndex:9})}>
      <div style={{padding:24,height:355}}><div style={{height:'100%',minHeight:0,overflow:'hidden',border:`2px dashed ${travel>.65?blue:'#b9cbe5'}`,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',background:'#f6f9ff',color:muted,fontSize:31}}>{dropped>0?<Img src={staticFile('promo/format-stack.webp')} style={{display:'block',width:'100%',height:303,minWidth:0,objectFit:'contain',opacity:dropped}}/>:copy.drop}</div></div>
    </Panel>
    {t>=26.95&&t<28.67&&<div style={at(x,y,{width:260,height:174,opacity:1-dropped,boxShadow:'0 18px 45px #163a7040',borderRadius:10,overflow:'hidden',zIndex:12})}><Img src={staticFile('promo/format-stack.webp')} style={{width:'100%',height:'100%',objectFit:'contain',background:'#fff'}}/></div>}
    <Cursor x={x+145} y={y+106} click={travel>0&&travel<1} opacity={gate(t,26.8,29.1,.2)}/>
  </div>;
};

const Platform = ({mac, saved}:{mac:boolean;saved:number}) => <div style={{position:'relative',width:200,height:200,border:'1px solid #b8cce7',borderRadius:40,background:'#fff',display:'grid',placeItems:'center',color:blue,boxShadow:'0 12px 30px -18px #163a7040'}}>
  <Img src={staticFile(mac?'promo/platform-macos.svg':'promo/platform-windows.svg')} style={{width:mac?144:112,height:mac?144:112,objectFit:'contain'}}/>
  <div style={at(154,154,{width:54,height:54,borderRadius:30,display:'grid',placeItems:'center',background:blue,color:'#fff',opacity:saved,transform:`scale(${.75+saved*.25})`})}><Icon name="check" size={30}/></div>
</div>;

const LocalHistory = ({t, language}:{t:number; language:RevisedLanguage}) => {
  const opacity=gate(t,31.5,37.5,.3);
  const outward=ease(t,34.05,35.25),back=ease(t,35.55,36.75);
  const bundleX=690+outward*462-back*462;
  return <div style={{opacity}}>
    <svg width="1920" height="1080" style={at(0,0,{zIndex:1})} fill="none" stroke="#c3d5f0" strokeWidth="2.5" strokeDasharray="8 10"><path d="M570 606v73q0 22 30 22v33M1350 606v73q0 22-30 22v33M720 835h480"/></svg>
    <div style={at(500,734,{zIndex:6})}><Platform mac={false} saved={ease(t,33,33.3)}/><div style={{textAlign:'center',fontSize:33,fontWeight:600,marginTop:22}}>Windows</div></div>
    <div style={at(1220,734,{zIndex:6})}><Platform mac saved={ease(t,33.45,33.75)}/><div style={{textAlign:'center',fontSize:33,fontWeight:600,marginTop:22}}>macOS</div></div>
    <div style={at(779,932,{width:362,textAlign:'center',fontSize:language==='en'?27:30,color:muted,zIndex:6})}>{revisedCopy[language].migration}</div>
    {cards.map((_,i) => {
      const p=ease(t,32.0+i*.13,32.85+i*.13);
      const s=1.35*(1-.92*p),cx=197+i*260+113.4,cy=326+124.2;
      const targetX=i<3?600:1320;
      return <Card key={i} language={language} index={i} x={blend(cx,targetX,p)-84*s} y={blend(cy,835,p)-92*s} scale={s} opacity={gate(p,.015,.98,.12)} zIndex={8}/>;
    })}
    <div style={at(bundleX,801,{width:78,height:68,display:'grid',placeItems:'center',borderRadius:14,border:'2px solid #a6bfe5',background:'#fff',color:blue,opacity:gate(t,33.85,37.1,.18),zIndex:8,boxShadow:'0 10px 25px #163a7020'})}><Icon name="archive" size={42}/></div>
  </div>;
};

// Both the first frame and the ending use this static brand composition.
// Keep text antialiasing consistent with the moving cover's composited layer.
export const VpasteCover = () => <AbsoluteFill style={{background:paper,fontFamily:font,color:ink,display:'flex',alignItems:'center',justifyContent:'center',filter:'opacity(1)'}}>
  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:52}}>
    <div style={{display:'flex',alignItems:'center',gap:34}}><Img src={staticFile('promo/vpaste-logo-master.svg')} style={{width:230,height:230}}/><div style={{fontSize:184,fontWeight:650,letterSpacing:-7,lineHeight:1}}>vPaste</div></div>
    <div style={{padding:'12px 32px 17px',borderRadius:18,background:'#eaf2ff',color:blue,fontSize:52,fontWeight:600,letterSpacing:.5,textDecoration:'underline',textDecorationThickness:2,textUnderlineOffset:9}}>vpaste.app</div>
  </div>
</AbsoluteFill>;

export type RevisedPromoProps = {language?: RevisedLanguage};
export const RevisedPromo = ({language='zh'}:RevisedPromoProps) => {
  const copy = revisedCopy[language];
  useWebsiteAssets();
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const videoTime=frame/fps;
  // Shift the existing demonstrations together, trimming only the final hold.
  const t=Math.max(0,videoTime-timing.introOffset);
  const opening=ease(videoTime,timing.openingHoldUntil,timing.openingTransitionEndsAt);
  const closing=ease(t,37.5,38.1);
  return <AbsoluteFill className="revised-promo" lang={language==='en'?'en':'zh-CN'} style={{fontFamily:font,color:ink,background:paper,overflow:'hidden'}}>
    <style>{`${cardCss}\n.revised-promo *, .revised-promo *::before, .revised-promo *::after{box-sizing:border-box}.revised-promo .vp-product-surface{--vp-card-width:168px;--vp-card-height:184px;--vp-card-header:48px;--vp-source-frame:60px;--vp-source-height:58px;--vp-source-icon:54px;--vp-source-offset:-4px}.revised-promo .vp-product-surface svg{fill:none;stroke:currentColor}.revised-promo .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}.revised-promo .vp-rich-card{padding:6px}.revised-promo .vp-rich-card table{min-width:0;width:100%;font-size:10.5px;line-height:1.3;table-layout:fixed}.revised-promo .vp-rich-card th,.revised-promo .vp-rich-card td{padding:4px 3px;white-space:normal;overflow-wrap:anywhere}.revised-promo .vp-rich-card th:first-child{width:44%}.revised-promo .vp-clip-card{border-radius:12px}`}</style>
    <style>{`.revised-promo[lang="en"] .vp-rich-card th:first-child{width:38%}.revised-promo[lang="en"] .vp-rich-card th:nth-child(2){width:24%}.revised-promo[lang="en"] .vp-rich-card th:nth-child(3){width:38%}.revised-promo[lang="en"] .vp-rich-card th,.revised-promo[lang="en"] .vp-rich-card td{padding:4px 2px}`}</style>
    <Audio src={staticFile('promo/soundtrack-revised.wav')} volume={.62}/>
    <div style={{position:'absolute',inset:0,opacity:1-closing,transform:`translateY(${1080*(1-opening)}px)`}}>
      <Product t={t} language={language}/>
      <Heading t={t} language={language}/>
      {t<2.8&&<KeyboardHint t={t} from={.2} to={2.6} top={454} keys={['Alt / Option','V']} presses={keypresses.summon} label={copy.summon}/>}
      {t>=15.9&&t<18.5&&<KeyboardHint t={t} from={15.95} to={keypresses.searchResultsAt} top={364} keys={['vPaste'[Math.max(0,keypresses.search.filter(time=>t>=time).length-1)]]} presses={keypresses.search} label={copy.search}/>}
      {t>=19.1&&t<22.5&&<KeyboardHint t={t} from={19.1} to={22.5} top={252} keys={['Space']} presses={keypresses.preview} label={copy.preview}/>}
      {t>=keypresses.previewOpensAt&&t<22.5&&<Preview t={t}/>}
      {t>=22.5&&t<26.5&&<Queue t={t} language={language}/>}
      {t>=26.5&&t<29.5&&<Drag t={t} language={language}/>}
      {t>=29.5&&t<31.5&&<div style={at(560,286,{width:800,height:702,opacity:gate(t,29.5,31.5,.22),borderRadius:18,overflow:'hidden',border:'1px solid #cbdcf4',boxShadow:'0 25px 65px -24px #163a7030'})}><Img src={staticFile(`promo/settings-theme-${language}.webp`)} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>}
      {t>=31.5&&t<37.5&&<LocalHistory t={t} language={language}/>}
    </div>
    {(videoTime<timing.openingTransitionEndsAt||t>=37.5)&&<AbsoluteFill style={{transform:`translate3d(0,${videoTime<timing.openingTransitionEndsAt?-1080*opening:0}px,0)`,opacity:videoTime<timing.openingTransitionEndsAt?1:closing,zIndex:40}}><VpasteCover/></AbsoluteFill>}
  </AbsoluteFill>;
};
