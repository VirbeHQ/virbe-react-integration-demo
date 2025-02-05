import { useEffect } from 'react';
import { atom } from "@/utils/atom.ts";

const scriptLoadStateAtom = atom<'loading' | 'loaded' | 'not-loaded'>('not-loaded');

/**
 * Loads the Virbe plugin script
 * @param domain - The domain of the Virbe dashboard
 * @returns The script load state
 */
export function useLoadScript(domain: string) {
  const [scriptLoadState, setScriptLoadState] = scriptLoadStateAtom.useState();

  useEffect(() => {
    if (scriptLoadStateAtom.getState() !== 'not-loaded') {
      return;
    }

    setScriptLoadState('loading');

    const scriptTag = document.createElement('script');
    scriptTag.src = `${domain}/render-streaming/virbe-pixel-streaming.es.js`;
    scriptTag.async = true;
    scriptTag.type = 'module';
    scriptTag.addEventListener('load', () => {
      setScriptLoadState('loaded');
    });
    document.body.appendChild(scriptTag);
  }, [domain, setScriptLoadState]);

  return {
    isScriptLoaded: scriptLoadState === 'loaded',
  };
}
