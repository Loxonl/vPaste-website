import type {CSSProperties} from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ClientSurface} from './ClientSurface';
import {NativeProduct} from './NativeProduct';
import {desktopMotion} from './generated/desktop-motion';
import {revision3} from './generated/revision3';

const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const lerp=(n:number,a:number,b:number,x=0,y=1)=>interpolate(n,[a,b],[x,y],clamp);
const ease=(n:number,a:number,b:number,x=0,y=1)=>interpolate(n,[a,b],[x,y],{...clamp,easing:Easing.inOut(Easing.cubic)});
const font='"Segoe UI", "Microsoft YaHei", sans-serif';
type Config=typeof revision3[number];
type Shot=Config['shots'][number];
const names=['文本','图片','链接','文件','颜色'];
const ranges:Record<string,[number,number]>={search:[0,3.35],formatting:[0,1.9],categories:[2.6,5.05],preview:[.1,3.5],queue:[1.95,8.4],drag:[.1,3.15],local:[.1,2.7]};
const focus:Record<string,[number,number]>={search:[345,132],formatting:[880,135],categories:[270,135],preview:[560,-210],queue:[508,-150],drag:[575,-18],local:[1306,80]};

const Cursor=({x,y,down=false}:{x:number;y:number;down?:boolean})=><svg width="34" height="44" viewBox="0 0 34 44" style={{position:'absolute',left:x,top:y,transform:`scale(${down?.83:1})`,filter:'drop-shadow(0 2px 2px #0004)',zIndex:20}}><path d="M3 2 3 32 12 25 19 40 26 36 19 22 31 21Z" fill="#161c22" stroke="white" strokeWidth="2.2"/></svg>;

const Desktop=({time,duration,second=true,still=false}:{time:number;duration:number;second?:boolean;still?:boolean})=>{
  const show=(at:number)=>1-(1-lerp(time,at,at+desktopMotion.showMs/1000))**3;
  const hide=lerp(time,3.2,3.2+desktopMotion.hideMs/1000)**3;
  const amount=still?1:time<3.34?show(1)*(1-hide):second?show(duration-1.45):0;
  const after=time>=3.48;
  const travel=ease(time,1.55,2.75);
  return <AbsoluteFill style={{overflow:'hidden',background:'#d9eaf8'}}>
    <Img src={staticFile('revision3/windows-wallpaper.jpg')} style={{position:'absolute',inset:0,width:1920,height:1080,objectFit:'cover'}}/>
    <div style={{position:'absolute',left:74,top:42,width:1772,height:997,borderRadius:10,overflow:'hidden',boxShadow:'0 12px 48px #16375345'}}>
      <Img src={staticFile(`revision3/note-${after?'after':'before'}.png`)} style={{width:1772,height:997}}/>
    </div>
    <div style={{position:'absolute',left:-desktopMotion.bleed,top:1080-desktopMotion.height*amount,boxShadow:'0 -5px 30px #182f4628'}}><ClientSurface/></div>
    {!still&&time>1.5&&time<3.34&&<Cursor x={850-720*travel} y={470+420*travel} down={time>3.15}/>}
  </AbsoluteFill>;
};

const Headline=({children,style={}}:{children:React.ReactNode;style?:CSSProperties})=><h1 style={{position:'absolute',margin:0,fontSize:100,fontWeight:700,lineHeight:1.13,letterSpacing:-3,...style}}>{children}</h1>;

const Opening=({config,shot,local}:{config:Config;shot:Shot;local:number})=>{
  const time=local/30;
  const duration=(shot.to-shot.from)/30;
  const split=config.strategy==='split'?ease(time,duration-1.9,duration-.55):0;
  const scale=1-split*.38;
  const caption=time<1?'vPaste · 剪贴捷径，一键即达':time<3.2?'Alt + V，随时调用':time<duration-1.45?'选中，即刻粘贴':'每次复制，都清晰可见';
  return <>
    <div style={{position:'absolute',left:split*62,top:split*218,width:1920,height:1080,transform:`scale(${scale})`,transformOrigin:'0 0',borderRadius:split*20,overflow:'hidden'}}><Desktop time={time} duration={duration} second={config.strategy!=='kinetic'}/></div>
    {split<.9&&<Headline style={{left:190,right:190,top:330,textAlign:'center',fontSize:config.strategy==='kinetic'?88:78,color:'#243849',opacity:lerp(time,.3,.65)*(1-split)}}>{caption}</Headline>}
    {split>0&&<Headline style={{left:1340,top:380,width:450,fontSize:114,color:config.palette.ink,opacity:split}}>随时调用<br/><span style={{color:config.palette.accent}}>即刻粘贴</span></Headline>}
  </>;
};

const Types=({config,shot,local}:{config:Config;shot:Shot;local:number})=>{
  const span=(shot.to-shot.from)/5;
  const index=Math.min(4,Math.floor(local/span));
  const card=config.typeOrder[index];
  const t=local-index*span;
  const enter=ease(t,0,9);
  const exit=ease(t,span-7,span);
  if(config.strategy==='continuous'){
    const fromX=12+card*236, fromY=838;
    const scale=lerp(enter,0,1,1,1.85);
    return <>
      <div style={{position:'absolute',inset:0,opacity:.14}}><Desktop time={2} duration={7.5} still/></div>
      <div style={{position:'absolute',inset:0,background:'#f7faffb8'}}/>
      <Headline style={{left:0,right:0,top:150,textAlign:'center',fontSize:120,color:config.palette.ink,opacity:1-exit}}>{names[card]}</Headline>
      <div style={{position:'absolute',left:lerp(enter,0,1,fromX,756),top:lerp(enter,0,1,fromY,386),transform:`scale(${scale})`,transformOrigin:'0 0',filter:'drop-shadow(0 15px 25px #203a4a18)',opacity:1-exit}}><ClientSurface card={card}/></div>
    </>;
  }
  if(config.strategy==='kinetic'){
    const flip=index%2===1;
    return <>
      <div style={{position:'absolute',left:flip?0:1110,top:0,bottom:0,width:810,background:index%2?config.palette.surface:'#f8e4d9'}}/>
      <Headline style={{left:flip?1020:120,top:340,fontSize:220,color:config.palette.ink,transform:`translateX(${(1-enter)*(flip?160:-160)}px)`,opacity:1-exit}}>{names[card]}</Headline>
      <div style={{position:'absolute',left:flip?245:1270,top:260+80*(1-enter),transform:`rotate(${(1-enter)*(flip?-12:12)}deg) scale(1.85)`,transformOrigin:'0 0',opacity:1-exit,filter:'drop-shadow(0 16px 20px #7339121b)'}}><ClientSurface card={card}/></div>
    </>;
  }
  return <>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:1110,background:config.palette.surface}}/>
    <div style={{position:'absolute',left:346,top:310+(1-enter)*470-exit*470,transform:'scale(1.85)',transformOrigin:'0 0',opacity:Math.min(1,enter*2)*(1-exit),filter:'drop-shadow(0 18px 26px #154a3222)'}}><ClientSurface card={card}/></div>
    <Headline style={{left:1255,top:440,fontSize:164,color:config.palette.ink,opacity:1-exit}}>{names[card]}</Headline>
  </>;
};

// Camera movement is editorial; the operation inside the crop is the original website timeline.
const Demo=({kind,progress,width,height,zoom=1.3,bias=0}:{kind:string;progress:number;width:number;height:number;zoom?:number;bias?:number})=>{
  const center=focus[kind]??[560,135];
  const time=ranges[kind]?lerp(progress,0,1,...ranges[kind]):0;
  if(kind==='settings') return <div style={{width,height,overflow:'hidden',borderRadius:16,position:'relative'}}><Img src={staticFile('native/assets/product/settings-theme-zh.png')} style={{position:'absolute',width:1230,height:1080,left:width/2-945,top:height/2-440}}/></div>;
  return <div style={{width,height,overflow:'hidden',position:'relative'}}><div style={{position:'absolute',left:width/2-(center[0]+bias)*zoom,top:height/2-center[1]*zoom,transform:`scale(${zoom})`,transformOrigin:'0 0'}}><NativeProduct kind={kind} time={time}/></div></div>;
};

const Feature=({config,shot,local}:{config:Config;shot:Shot;local:number})=>{
  const progress=lerp(local,0,shot.to-shot.from-1);
  const title=shot.title;
  const kind=shot.kind;
  const enter=ease(local,0,12);
  if(config.strategy==='continuous'){
    const zoom=kind==='local'?2.3:kind==='queue'?1.2:kind==='drag'?1.1:kind==='formatting'?1.55:1.5;
    const width=kind==='drag'?1410:kind==='queue'?1320:1250;
    const height=kind==='drag'?620:kind==='queue'?540:kind==='local'?430:kind==='preview'?490:420;
    return <>
      <div style={{position:'absolute',inset:0,opacity:.12}}><Desktop time={3.6} duration={7.5}/></div>
      <div style={{position:'absolute',inset:0,background:'#f7faffb5'}}/>
      <Headline style={{left:0,right:0,top:118,fontSize:96,textAlign:'center',color:config.palette.ink,opacity:enter}}>{title}</Headline>
      <div style={{position:'absolute',left:(1920-width)/2,top:340+(1-enter)*65,filter:'drop-shadow(0 22px 22px #283e5612)'}}><Demo kind={kind} progress={progress} width={width} height={height} zoom={zoom+progress*.035} bias={shot.cameraBias}/></div>
    </>;
  }
  if(config.strategy==='kinetic'){
    const reveal=ease(local,9,19);
    const side=kind==='search'||kind==='preview';
    const bottom=kind==='formatting'||kind==='queue';
    const bigTitle=kind==='search'?'一搜即达':kind==='queue'?'连续粘贴':kind==='formatting'?'原有格式':kind==='categories'?'分门别类':kind==='preview'?'先看再贴':'留在本机';
    const w=side?1090:kind==='queue'?1360:1340;
    const h=kind==='queue'?570:kind==='preview'?610:480;
    return <>
      <div style={{position:'absolute',left:side?790:0,top:bottom?0:320,width:side?1130:1920,height:bottom?680:760,background:config.palette.surface}}/>
      <Headline style={{left:side?100:120,top:side?320:bottom?800:95,fontSize:side?128:135,width:side?590:1700,color:config.palette.ink,zIndex:2,transform:`translateY(${(1-enter)*50}px)`}}>{side?<>{bigTitle.slice(0,2)}<br/>{bigTitle.slice(2)}</>:bigTitle}</Headline>
      <div style={{position:'absolute',left:side?815:(1920-w)/2,top:side?265:bottom?165:350,clipPath:`inset(0 ${100-reveal*100}% 0 0)`,transform:`translateX(${(1-reveal)*95}px)`}}><Demo kind={kind} progress={progress} width={w} height={h} zoom={kind==='local'?2.6:kind==='preview'?1.48:kind==='queue'?1.23:kind==='formatting'?1.7:1.6} bias={shot.cameraBias}/></div>
    </>;
  }
  const rightCopy:Record<string,string[]>= {queue:['连续粘贴','一气呵成'],drag:['跨应用','直接拖拽'],search:['记得一点','就能找到'],formatting:['保留','原有格式'],settings:['按你的','习惯工作'],local:['记录','留在本机']};
  const lines=rightCopy[kind]??[title];
  const zoom=kind==='queue'?1.08:kind==='drag'?.91:kind==='local'?2.5:1.37;
  return <>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:1260,background:config.palette.surface}}/>
    <div style={{position:'absolute',left:30,top:kind==='drag'?226:290,transform:`translateY(${(1-enter)*55}px)`,opacity:enter}}><Demo kind={kind} progress={progress} width={1200} height={kind==='drag'?630:510} zoom={zoom} bias={shot.cameraBias}/></div>
    <Headline style={{left:1320,top:370,width:500,fontSize:112,color:config.palette.ink,opacity:enter}}>{lines[0]}<br/><span style={{color:config.palette.accent}}>{lines[1]}</span></Headline>
  </>;
};

const Closing=({config,local}:{config:Config;local:number})=>{
  const enter=ease(local,0,15);
  const side=config.strategy==='split';
  return <>
    {side&&<div style={{position:'absolute',left:0,top:0,bottom:0,width:1040,background:config.palette.surface}}/>}
    <div style={{position:'absolute',left:side?200:0,right:side?'auto':0,top:side?380:235,display:'flex',justifyContent:'center',alignItems:'center',gap:30,opacity:enter,transform:`translateY(${(1-enter)*60}px)`}}><Img src={staticFile('native/assets/vpaste-logo.png')} style={{width:134,height:134}}/><span style={{fontSize:154,fontWeight:700,letterSpacing:-6}}>vPaste</span></div>
    <Headline style={{left:side?1180:0,right:side?70:0,top:side?367:505,textAlign:side?'left':'center',fontSize:config.strategy==='kinetic'?122:98,color:config.palette.accent}}>GPL-3.0 开源</Headline>
    <div style={{position:'absolute',left:side?1185:0,right:side?'auto':0,top:side?565:700,textAlign:'center',fontSize:58,color:config.palette.ink}}>vpaste.app ↗</div>
  </>;
};

export const NarrativePromo=({variant}:{variant:'A'|'B'|'C'})=>{
  const frame=useCurrentFrame();
  const config=revision3.find(v=>v.id===variant)!;
  const shot=config.shots.find(s=>frame>=s.from&&frame<s.to)??config.shots.at(-1)!;
  const local=frame-shot.from;
  const transition=shot.from===0?1:ease(local,0,config.strategy==='continuous'?13:config.strategy==='kinetic'?4:11);
  return <AbsoluteFill style={{background:config.palette.background,color:config.palette.ink,fontFamily:font,overflow:'hidden'}}>
    <Audio src={staticFile(`revision3/audio/${variant}/soundtrack.wav`)}/>
    {shot.kind==='desktop'?<Opening config={config} shot={shot} local={local}/>:shot.kind==='types'?<Types config={config} shot={shot} local={local}/>:shot.kind==='closing'?<Closing config={config} local={local}/>:<Feature config={config} shot={shot} local={local}/>}
    {transition<1&&config.strategy==='continuous'&&<AbsoluteFill style={{background:config.palette.background,opacity:1-transition}}/>}
    {transition<1&&config.strategy==='split'&&<AbsoluteFill style={{background:config.palette.background,transform:`translateX(${transition*100}%)`}}/>}
  </AbsoluteFill>;
};
