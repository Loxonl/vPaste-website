import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export type VpasteDemoProps = {
  language: 'zh' | 'en';
};

const copy = {
  zh: {
    interface: '产品主界面',
    interfaceDetail: '复制内容，以卡片形式集中呈现',
    preview: '内容预览',
    source: '来源应用',
    time: '复制时间',
    features: '功能特色',
    searchPlaceholder: '搜索正文、标题、路径或来源应用',
    searchQuery: 'release shortcut',
    search: '快速搜索',
    inspect: '粘贴前预览',
    format: '原格式 / 纯文本',
    supported: '支持类型',
    typeDetails: [
      'Text · 富文本与纯文本',
      'Images · 图片缩略图与尺寸',
      'Links · 标题、图标与完整 URL',
      'Files · 文件、文件夹与路径',
      'Colors · HEX / RGB / HSL',
    ],
  },
  en: {
    interface: 'Main interface',
    interfaceDetail: 'Everything you copy, organized as visual cards',
    preview: 'Content preview',
    source: 'Source app',
    time: 'Copied time',
    features: 'Key features',
    searchPlaceholder: 'Search text, titles, paths, or source apps',
    searchQuery: 'release shortcut',
    search: 'Fast search',
    inspect: 'Preview before paste',
    format: 'Rich / plain text',
    supported: 'Supported types',
    typeDetails: [
      'Text · Rich and plain text',
      'Images · Thumbnails and dimensions',
      'Links · Titles, icons, and full URLs',
      'Files · Files, folders, and paths',
      'Colors · HEX / RGB / HSL',
    ],
  },
} as const;

const fontFamily = '"Segoe UI Variable", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif';
const ink = '#101419';
const muted = '#66717b';
const blue = '#3578f6';
const sceneDuration = 210;
const transitionDuration = 15;
const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const Background = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, sceneDuration], [-30, 36], clamp);

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 78% 12%, #ffffff 0%, #f0f4f7 42%, #e6ecf1 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          right: -260 + x,
          top: -380,
          borderRadius: '50%',
          background: 'rgba(53,120,246,0.10)',
          filter: 'blur(16px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          left: -280 - x,
          bottom: -330,
          borderRadius: '50%',
          background: 'rgba(33,199,166,0.11)',
          filter: 'blur(20px)',
        }}
      />
    </AbsoluteFill>
  );
};

const SectionLabel = ({index, title, detail}: {index: string; title: string; detail?: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 200}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 82,
        top: 64,
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
      }}
    >
      <div
        style={{
          minWidth: 58,
          height: 42,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: blue,
          color: '#fff',
          fontSize: 21,
          fontWeight: 750,
        }}
      >
        {index}
      </div>
      <div>
        <div style={{fontSize: 29, fontWeight: 760, color: ink, letterSpacing: '-0.03em'}}>{title}</div>
        {detail ? <div style={{fontSize: 19, color: muted, marginTop: 3}}>{detail}</div> : null}
      </div>
    </div>
  );
};

const ProductWindow = ({
  zoom = 1,
  translateX = 0,
  translateY = 0,
  opacity = 1,
}: {
  zoom?: number;
  translateX?: number;
  translateY?: number;
  opacity?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: 70,
      right: 70,
      top: 218,
      height: 650,
      borderRadius: 34,
      background: 'rgba(255,255,255,0.76)',
      outline: '1px solid rgba(20,43,65,0.11)',
      boxShadow: '0 38px 100px rgba(25,52,80,0.19)',
      overflow: 'hidden',
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transform: `translate(${translateX}px, ${translateY}px) scale(${zoom})`,
        transformOrigin: 'center center',
      }}
    >
      <Img
        src={staticFile('product-main.png')}
        style={{
          position: 'absolute',
          left: 0,
          top: 72,
          width: '100%',
          height: 446,
          objectFit: 'fill',
        }}
      />
    </div>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 132,
        background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(247,249,250,0.94) 66%)',
      }}
    />
  </div>
);

const FocusCallout = ({
  label,
  x,
  y,
  delay,
}: {
  label: string;
  x: number;
  y: number;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 180}});
  const exit = interpolate(frame, [170, 198], [1, 0], clamp);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 8,
        padding: '13px 20px',
        borderRadius: 16,
        background: 'rgba(16,20,25,0.88)',
        color: '#fff',
        boxShadow: '0 16px 38px rgba(0,0,0,0.20)',
        fontSize: 21,
        fontWeight: 650,
        opacity: entrance * exit,
        transform: `translateY(${interpolate(entrance, [0, 1], [24, 0])}px) scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
      }}
    >
      {label}
      <div
        style={{
          position: 'absolute',
          left: 28,
          bottom: -9,
          width: 18,
          height: 18,
          background: 'rgba(16,20,25,0.88)',
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
};

const InterfaceScene = ({language}: VpasteDemoProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = copy[language];
  const windowIn = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 130}});
  const camera = interpolate(frame, [45, 185], [0.98, 1.035], {...clamp, easing: Easing.inOut(Easing.quad)});

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <SectionLabel index="01" title={text.interface} detail={text.interfaceDetail} />
      <ProductWindow
        zoom={camera}
        opacity={windowIn}
        translateY={interpolate(windowIn, [0, 1], [58, 0])}
      />
      <FocusCallout label={text.preview} x={320} y={552} delay={44} />
      <FocusCallout label={text.source} x={755} y={560} delay={72} />
      <FocusCallout label={text.time} x={1455} y={286} delay={100} />
    </AbsoluteFill>
  );
};

const FeatureChip = ({label, index}: {label: string; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame: frame - 94 - index * 9, fps, config: {damping: 18, stiffness: 170}});

  return (
    <div
      style={{
        padding: '15px 23px',
        borderRadius: 999,
        background: index === 0 ? blue : 'rgba(255,255,255,0.91)',
        color: index === 0 ? '#fff' : ink,
        outline: index === 0 ? 'none' : '1px solid rgba(23,47,69,0.10)',
        boxShadow: '0 13px 32px rgba(23,47,69,0.11)',
        fontSize: 21,
        fontWeight: 680,
        opacity: entrance,
        transform: `translateY(${interpolate(entrance, [0, 1], [22, 0])}px)`,
      }}
    >
      {label}
    </div>
  );
};

const FeaturesScene = ({language}: VpasteDemoProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = copy[language];
  const windowIn = spring({frame, fps, config: {damping: 200}});
  const searchIn = spring({frame: frame - 26, fps, config: {damping: 18, stiffness: 150}});
  const typed = interpolate(frame, [58, 114], [0, text.searchQuery.length], clamp);
  const focusGlow = interpolate(frame, [40, 76, 142, 184], [0, 1, 1, 0], clamp);

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <SectionLabel index="02" title={text.features} detail={text.searchPlaceholder} />
      <ProductWindow zoom={1.025} opacity={windowIn * 0.78} />
      <div
        style={{
          position: 'absolute',
          zIndex: 9,
          left: 240,
          right: 240,
          top: 294,
          height: 98,
          borderRadius: 25,
          background: 'rgba(255,255,255,0.97)',
          outline: `3px solid rgba(53,120,246,${0.22 + focusGlow * 0.55})`,
          boxShadow: `0 26px 70px rgba(21,48,78,${0.14 + focusGlow * 0.12})`,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 30px',
          opacity: searchIn,
          transform: `translateY(${interpolate(searchIn, [0, 1], [-34, 0])}px) scale(${interpolate(searchIn, [0, 1], [0.96, 1])})`,
        }}
      >
        <div style={{width: 27, height: 27, borderRadius: '50%', outline: `3px solid ${blue}`, position: 'relative'}}>
          <div style={{position: 'absolute', width: 12, height: 3, right: -9, bottom: -5, borderRadius: 4, background: blue, transform: 'rotate(45deg)'}} />
        </div>
        <div style={{fontSize: 31, color: ink}}>
          {text.searchQuery.slice(0, Math.floor(typed))}
          <span style={{color: blue, opacity: frame % 18 < 9 ? 1 : 0}}>│</span>
        </div>
        <div style={{marginLeft: 'auto', color: muted, fontSize: 19}}>{text.searchPlaceholder}</div>
      </div>
      <div style={{position: 'absolute', zIndex: 10, left: 240, bottom: 116, display: 'flex', gap: 15}}>
        {[text.search, text.inspect, text.format].map((label, index) => (
          <FeatureChip key={label} label={label} index={index} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const typeNames = ['Text', 'Images', 'Links', 'Files', 'Colors'];
const typeColors = ['#48b755', '#ff970a', '#4387ee', '#09a9aa', '#198be6'];

const TypesScene = ({language}: VpasteDemoProps) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const text = copy[language];
  const windowIn = spring({frame, fps, config: {damping: 200}});
  const activeIndex = Math.min(4, Math.floor(frame / 39));
  const localFrame = frame - activeIndex * 39;
  const detailIn = spring({frame: localFrame, fps, config: {damping: 18, stiffness: 190}});
  const pan = interpolate(
    frame,
    [0, 50, 96, 142, 195],
    [0, -170, -420, -690, -930],
    {...clamp, easing: Easing.inOut(Easing.quad)},
  );

  return (
    <AbsoluteFill style={{fontFamily}}>
      <Background />
      <SectionLabel index="03" title={text.supported} detail={text.typeDetails[activeIndex]} />
      <div
        style={{
          position: 'absolute',
          left: 70,
          right: 70,
          top: 205,
          height: 660,
          borderRadius: 34,
          background: '#f8fafb',
          outline: '1px solid rgba(20,43,65,0.11)',
          boxShadow: '0 38px 100px rgba(25,52,80,0.20)',
          overflow: 'hidden',
          opacity: windowIn,
        }}
      >
        <Img
          src={staticFile('product-main.png')}
          style={{
            position: 'absolute',
            left: pan,
            top: 0,
            width: 2630,
            height: 660,
            objectFit: 'fill',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 46,
            bottom: 34,
            padding: '17px 24px',
            borderRadius: 18,
            background: 'rgba(16,20,25,0.91)',
            color: '#fff',
            boxShadow: '0 18px 48px rgba(0,0,0,0.24)',
            fontSize: 24,
            fontWeight: 680,
            opacity: detailIn,
            transform: `translateY(${interpolate(detailIn, [0, 1], [18, 0])}px)`,
          }}
        >
          {text.typeDetails[activeIndex]}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 56, display: 'flex', justifyContent: 'center', gap: 18}}>
        {typeNames.map((name, index) => {
          const active = index === activeIndex;
          return (
            <div
              key={name}
              style={{
                minWidth: 132,
                padding: '13px 18px',
                borderRadius: 999,
                textAlign: 'center',
                background: active ? typeColors[index] : 'rgba(255,255,255,0.86)',
                color: active ? '#fff' : muted,
                outline: active ? 'none' : '1px solid rgba(20,43,65,0.10)',
                fontSize: 20,
                fontWeight: 680,
                transform: `scale(${active ? 1.06 : 1})`,
                boxShadow: active ? `0 14px 32px ${typeColors[index]}45` : 'none',
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const VpasteDemo = ({language}: VpasteDemoProps) => {
  const timing = linearTiming({durationInFrames: transitionDuration});

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={sceneDuration} premountFor={30}>
        <InterfaceScene language={language} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={sceneDuration} premountFor={30}>
        <FeaturesScene language={language} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={sceneDuration} premountFor={30}>
        <TypesScene language={language} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
