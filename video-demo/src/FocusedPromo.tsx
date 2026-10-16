import type {CSSProperties} from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {NativeProduct} from './NativeProduct';
import {variants} from './generated/variants';

export type FocusedPromoProps = {variant: 'A' | 'B' | 'C'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = (n: number, a: number, b: number) => interpolate(n, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const linear = (n: number, a: number, b: number) => interpolate(n, [a, b], [0, 1], clamp);
const types = ['文本', '图片', '链接', '文件', '颜色'];
const cameras: Record<string, [number, number, number]> = {
  shortcut: [560, 135, 1.52], history: [380, 133, 2.55], formatting: [830, 130, 2.5],
  categories: [292, 118, 2.6], search: [315, 125, 2.55], preview: [560, -200, 1.75],
  queue: [508, -150, 1.66], drag: [575, -18, 1.23], types: [887, 461, 2.62],
  local: [1306, 80, 3.8],
};
const sourceRanges: Record<string, [number, number]> = {
  history: [.2, 3.3], formatting: [0, 1.9], categories: [2.6, 5.05], search: [0, 3.35],
  preview: [.1, 3.5], queue: [1.95, 8.4], drag: [.1, 3.15], local: [.1, 2.7],
};

export const FocusedPromo = ({variant}: FocusedPromoProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const config = variants.find(v => v.id === variant)!;
  const shot = config.shots.find(s => frame >= s.from && frame < s.to) ?? config.shots.at(-1)!;
  const local = frame - shot.from;
  const length = shot.to - shot.from;
  const progress = linear(local, 0, length - 1);
  const enter = ease(local, 0, config.transitionFrames);
  const exit = shot.kind === 'closing' ? 0 : ease(local, length - config.transitionFrames, length);
  const {palette, layout} = config;
  const kind = shot.kind;
  const isBrand = kind === 'intro' || kind === 'closing';
  const typeIndex = kind === 'types' ? Math.min(4, Math.floor(progress * 5)) : 0;
  const title = kind === 'types' ? types[typeIndex] : shot.title;
  const typeProgress = progress * 5 - typeIndex;
  const sourceTime = kind === 'types' ? .2 * Math.min(1, typeProgress / .24) : sourceRanges[kind] ? interpolate(progress, [0, 1], sourceRanges[kind]) : 0;
  const curtain = (kind === 'intro' ? 0 : 1 - enter) + exit;
  let camera = [...(cameras[kind] ?? [560, 135, 1.5])] as [number, number, number];
  const bias = kind === 'types' || kind === 'local' ? 0 : shot.cameraBias;
  camera[0] += bias;
  if (layout === 'precision') camera[2] *= 1 + .035 * progress;
  if (layout === 'ribbon') {camera[0] += (1 - ease(progress, 0, .85)) * 24; camera[2] *= .96;}
  if (layout === 'spotlight') {camera[2] *= .98 + .075 * ease(progress, 0, .72); camera[1] += (1 - ease(progress, 0, .8)) * 12;}
  const productY = kind === 'types' && layout !== 'spotlight' ? 425 : layout === 'ribbon' ? 505 : layout === 'spotlight' ? 600 : 455;
  const titleAtTop = layout === 'spotlight';
  const titleY = titleAtTop ? 54 : 875;
  const titleSize = kind === 'types' ? 170 : title.length > 10 ? 112 : 128;
  const titleStyle: CSSProperties = {
    position: 'absolute', left: layout === 'ribbon' ? 105 : 75, right: 75, top: titleY,
    margin: 0, fontSize: titleSize, lineHeight: 1.2, fontWeight: layout === 'precision' ? 650 : 750,
    letterSpacing: -4, color: palette.ink, whiteSpace: 'nowrap', zIndex: 8,
    textAlign: layout === 'precision' ? 'center' : layout === 'spotlight' ? 'center' : 'left',
    opacity: kind === 'intro' ? 1 : Math.min(1, enter * 1.5),
    transform: layout === 'ribbon' ? `translateY(${(1 - enter) * 155}px)` : layout === 'precision' ? `translateX(${(1 - enter) * 90}px)` : `scale(${.9 + enter * .1})`,
  };
  const rootFont = '"Segoe UI", "Microsoft YaHei", sans-serif';
  return <AbsoluteFill style={{background: palette.background, color: palette.ink, fontFamily: rootFont, overflow: 'hidden'}}>
    <Audio src={staticFile(`variants/${variant}/soundtrack.wav`)}/>
    {layout === 'ribbon' && <div style={{position: 'absolute', left: 0, top: 0, width: 52, height: 1080, background: palette.surface}}/>}
    {layout === 'spotlight' && <div style={{position: 'absolute', width: 1150, height: 1150, borderRadius: '50%', left: 385, top: 235, background: palette.surface, opacity: .36}}/>}
    {isBrand ? <AbsoluteFill style={{justifyContent: 'center', alignItems: layout === 'ribbon' ? 'flex-start' : 'center', paddingLeft: layout === 'ribbon' ? 180 : 0}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 38, transform: `translateY(${(1-enter)*45}px)`, opacity: .35 + .65 * enter}}>
        <Img src={staticFile('native/assets/vpaste-logo.png')} style={{width: 150, height: 150, objectFit: 'contain'}}/>
        <div style={{fontSize: 172, fontWeight: 700, letterSpacing: -8}}>vPaste</div>
      </div>
      <div style={{fontSize: kind === 'intro' ? 106 : 100, marginTop: 58, fontWeight: 600, letterSpacing: -4, color: palette.accent}}>{kind === 'intro' ? '剪贴捷径，一键即达' : 'GPL-3.0 开源'}</div>
      {kind === 'closing' && <div style={{fontSize: 61, marginTop: 55, fontWeight: 550}}>vpaste.app ↗</div>}
    </AbsoluteFill> : <>
      <div style={{position: 'absolute', inset: titleAtTop ? '234px 0 0' : '0 0 248px', overflow: 'hidden'}}>
        {kind === 'settings' ? <div style={{position: 'absolute', left: 960 - 940 * 2.05, top: (titleAtTop ? 240 : 400) - 460 * 2.05, transform: `scale(${2.05 + progress * .1})`, transformOrigin: '0 0'}}>
          <Img src={staticFile('native/assets/product/settings-theme-zh.png')} style={{width: 1230, height: 1080, maxWidth: 'none'}}/>
        </div> : <div style={{position: 'absolute', left: 960 - camera[0] * camera[2], top: productY - (titleAtTop ? 234 : 0) - camera[1] * camera[2], transformOrigin: '0 0', transform: `scale(${camera[2]}) translateY(${kind === 'shortcut' ? (1 - ease(local, 0, 16)) * 160 : 0}px)`, opacity: kind === 'shortcut' ? .2 + enter * .8 : 1}}>
          <NativeProduct key={kind + typeIndex} kind={kind} time={sourceTime} typeIndex={typeIndex}/>
        </div>}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: titleAtTop ? 30 : 860, height: 204, overflow: 'hidden', zIndex: 8}}>
        <h1 style={{...titleStyle, top: titleAtTop ? 24 : 15}}>{title}</h1>
      </div>
    </>}
    {frame > 0 && curtain > .002 && layout === 'precision' && <div style={{position: 'absolute', inset: 0, background: palette.surface, transform: `translateX(${local < length/2 ? enter*100 : (exit-1)*100}%)`, zIndex: 20}}/>}
    {frame > 0 && curtain > .002 && layout === 'ribbon' && <div style={{position: 'absolute', inset: 0, background: palette.surface, transform: `translateY(${local < length/2 ? enter*100 : (exit-1)*100}%)`, zIndex: 20}}/>}
    {frame > 0 && curtain > .002 && layout === 'spotlight' && <div style={{position: 'absolute', inset: 0, background: palette.background, opacity: curtain, zIndex: 20}}/>}
  </AbsoluteFill>;
};
