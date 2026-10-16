import {useEffect, useLayoutEffect, useRef, useMemo} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {clientSnapshot} from './generated/client-snapshot';

// The captured DOM/CSS comes from the actual client, not a hand-built UI replica.
export const ClientSurface = ({card}: {card?:number}) => {
  const element=useRef<HTMLDivElement>(null);
  const handle=useMemo(()=>delayRender('Original desktop frontend assets'),[card]);
  useEffect(()=>()=>continueRender(handle),[handle]);
  useLayoutEffect(()=>{
    const host=element.current!;
    const shadow=host.shadowRoot ?? host.attachShadow({mode:'open'});
    const markup=card===undefined?clientSnapshot.html:clientSnapshot.cards[card];
    const html=markup.replace(/(?:http:\/\/127\.0\.0\.1:8796)?\/native\/assets\/([^"\s]+)/g,(_,f)=>staticFile('native/assets/'+f));
    const css=clientSnapshot.css.replaceAll(':root',':host').replace(/\bhtml\b/g,':host').replace(/\bbody\b/g,':host');
    shadow.innerHTML=`<style>${css}\n:host{display:block;color-scheme:light} [class*="clipboard-container"]{width:1944px!important;height:302px!important} *,*::before,*::after{transition:none!important;animation:none!important} ${card===undefined?'':'[data-hash]{outline:none!important;box-shadow:none!important;content-visibility:visible!important}'}</style><div id="root">${html}</div>`;
    Promise.all(Array.from(shadow.querySelectorAll('img')).map(img=>img.decode())).then(()=>document.fonts.ready).then(()=>continueRender(handle)).catch(cancelRender);
  },[card,handle]);
  return <div ref={element} data-theme="light" style={{width:card===undefined?1944:220,height:card===undefined?302:230}}/>;
};
