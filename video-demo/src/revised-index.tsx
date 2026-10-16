import type {ReactNode} from 'react';
import {AbsoluteFill, Composition, Still, registerRoot} from 'remotion';
import {RevisedPromo, VpasteCover, type RevisedPromoProps} from './RevisedPromo';
import {revisedDuration, revisedFps} from './revised-timeline';

// Rasterize the original design at 2560×1440; do not upscale an encoded video.
const Canvas1440 = ({children}:{children:ReactNode}) => <AbsoluteFill>
  <div style={{position:'absolute',width:1920,height:1080,transform:'scale(1.3333333333333333)',transformOrigin:'0 0'}}>{children}</div>
</AbsoluteFill>;
const Promo1440 = (props:RevisedPromoProps) => <Canvas1440><RevisedPromo {...props}/></Canvas1440>;
const Cover1440 = () => <Canvas1440><VpasteCover/></Canvas1440>;

const RevisedRoot = () => <>
  <Composition id="Vpaste40s-Revised" component={RevisedPromo} durationInFrames={revisedDuration*revisedFps} fps={revisedFps} width={1920} height={1080}/>
  <Still id="VpasteCover" component={VpasteCover} width={1920} height={1080}/>
  <Composition id="Vpaste40s-1440-zh" component={Promo1440} defaultProps={{language:'zh'}} durationInFrames={revisedDuration*revisedFps} fps={revisedFps} width={2560} height={1440}/>
  <Composition id="Vpaste40s-1440-en" component={Promo1440} defaultProps={{language:'en'}} durationInFrames={revisedDuration*revisedFps} fps={revisedFps} width={2560} height={1440}/>
  <Still id="VpasteCover-1440" component={Cover1440} width={2560} height={1440}/>
</>;
registerRoot(RevisedRoot);
