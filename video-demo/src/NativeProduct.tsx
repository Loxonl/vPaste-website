import {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {actorHtml, localHtml, nativeCopy, nativeCss} from './generated/native-data';
import {createProductDemos, createLocalHistoryLoop, gsap, vpasteIcon} from './generated/native-runtime';

// The website's queue timeline intentionally targets an empty tail on its last row.
gsap.config({nullTargetWarn: false});

const demos: Record<string, number> = {history: 0, formatting: 1, categories: 2, search: 3, preview: 4, queue: 5, drag: 6};
const assets = (html: string) => html.replace(/src="\/assets\/([^"]+)"/g, (_, file) => `src="${staticFile('native/assets/' + file)}"`);
const translate = (root: HTMLElement) => root.querySelectorAll<HTMLElement>('[data-i18n]').forEach(node => {
  const text = nativeCopy[node.dataset.i18n!];
  if (text === undefined) throw new Error('Missing website copy: ' + node.dataset.i18n);
  node.textContent = text;
});
const tr = (key: string, tag = 'span', cls = '') => `<${tag} class="${cls}" data-i18n="${key}"></${tag}>`;

export const NativeProduct = ({kind, time, typeIndex = 0}: {kind: string; time: number; typeIndex?: number}) => {
  const root = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender('Decode original website UI'));
  const ready = useRef(false);
  useEffect(() => () => continueRender(handle), [handle]);
  useLayoutEffect(() => {
    const host = root.current!;
    host.innerHTML = assets(actorHtml + (kind === 'local' ? localHtml : ''));
    translate(host);
    const actor = host.querySelector<HTMLElement>('.app-actor')!;
    const app = actor.querySelector<HTMLElement>('.story-product')!;
    let cleanup: () => void = () => {};
    if (kind in demos) {
      const controller = createProductDemos({actor, app, icon: vpasteIcon, tr, translate});
      const loop = controller.enter(demos[kind]);
      loop.pause().repeat(0).totalTime(Math.max(.001, time), false);
      cleanup = () => controller.destroy();
    } else if (kind === 'types') {
      const card = app.querySelectorAll<HTMLElement>('.vp-clip-card')[typeIndex];
      // Exact extraction destination, angle, scale and easing from motion-concepts.js.
      const x = (830 - 155) / .84 - card.offsetLeft;
      const y = (470 - 160) / .84 - card.offsetTop;
      const loop = gsap.timeline({paused: true});
      loop.set(card, {zIndex: 12}).to(card, {x, y, scale: 1.3, rotation: -3.5, duration: .2, ease: 'sine.inOut'});
      loop.totalTime(Math.min(.2, time), false);
      cleanup = () => loop.kill();
    } else if (kind === 'local') {
      const controller = createLocalHistoryLoop({root: host, actor, cards: Array.from(app.querySelectorAll('.vp-clip-card'))});
      controller.seek(time);
      cleanup = () => controller.stop();
    }
    gsap.ticker.sleep();
    if (!ready.current) {
      ready.current = true;
      Promise.all(Array.from(host.querySelectorAll('img')).map(img => img.decode()))
        .then(() => document.fonts.ready).then(() => continueRender(handle)).catch(cancelRender);
    }
    return cleanup;
  }, [kind, time, typeIndex, handle]);
  return <><style>{nativeCss}{`
    .native-root {position:absolute;left:0;top:0;width:1120px;height:270px;--ink:#243e4b;--muted:#566f7a;--paper:#fafcff;--mono:Consolas,monospace;font-family:"Segoe UI Variable","Segoe UI","Microsoft YaHei UI",sans-serif;line-height:1.35}
    .native-root *, .native-root *::before, .native-root *::after {box-sizing:border-box}
    .native-root svg {display:block;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.8}
    .native-root img {max-width:100%}
    .native-root .app-actor {position:absolute;left:0;top:0;width:1120px;height:270px}
    .native-root .story-icon {width:24px;height:24px;flex-shrink:0}
    .native-root .sr-only {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
    .native-root .history-continuation,.native-root .demo-format-note,.native-root .demo-keypress {display:none!important}
    .native-root .data-visual {position:absolute;left:1220px;top:10px;width:610px;margin:0}
    .native-root .data-actions,.native-root .migration-path,.native-root .local-device--mac,.native-root .migration-bundle {display:none!important}
    .native-root .local-device-icon svg {fill:#4c7187;stroke:none}
    .native-root[data-shot="queue"] .story-product {visibility:hidden}
  `}</style><div ref={root} className="native-root" data-shot={kind}/></>;
};
