import {Composition} from 'remotion';
import {VpasteDemo, type VpasteDemoProps} from './VpasteDemo';
import {VpastePromo} from './VpastePromo';
import {promoDuration, promoFps} from './promo-timeline';
import {FocusedPromo} from './FocusedPromo';
import {NarrativePromo} from './NarrativePromo';

export const RemotionRoot = () => {
  return (
    <>
    {(['A', 'B', 'C'] as const).map(variant => <Composition key={`r3-${variant}`} id={`Vpaste-R3-${variant}`} component={NarrativePromo} durationInFrames={1200} fps={30} width={1920} height={1080} defaultProps={{variant}}/>)}
    {(['A', 'B', 'C'] as const).map(variant => <Composition key={variant} id={`Vpaste40s-${variant}`} component={FocusedPromo} durationInFrames={1200} fps={30} width={1920} height={1080} defaultProps={{variant}}/>)}
    <Composition id="Vpaste40s" component={VpastePromo} durationInFrames={promoDuration * promoFps} fps={promoFps} width={1920} height={1080}/>
    <Composition
      id="Vpaste20s"
      component={VpasteDemo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{language: 'zh'} satisfies VpasteDemoProps}
    />
    </>
  );
};
