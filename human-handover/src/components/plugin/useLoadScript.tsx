import { useEffect } from 'react';
import { atom } from "@/utils/atom.ts";

const scriptLoadStateAtom = atom<'loading' | 'loaded' | 'not-loaded'>('not-loaded');

export type WebWidgetType = 'web-component' | 'web-component-avatarless';

/**
 * Loads the Virbe plugin script
 * @param domain - The domain of the Virbe dashboard
 * @param widgetType - The type of widget to load
 * @returns The script load state
 */
export function useLoadScript(domain: string, widgetType: WebWidgetType = 'web-component') {
  const [scriptLoadState, setScriptLoadState] = scriptLoadStateAtom.useState();

  useEffect(() => {
    if (scriptLoadStateAtom.getState() !== 'not-loaded') {
      return;
    }

    setScriptLoadState('loading');

    const scriptTag = document.createElement('script');
    scriptTag.src = `${domain}/${widgetType}/virbe-plugin.es.js`;
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
