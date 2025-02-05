import { useLoadScript, WebWidgetType } from './useLoadScript';
import { getHost } from "@/utils/host.ts";
import { cn } from "@/utils/cn.ts";
import { ApiStatus, VirbePluginMethods } from './types.ts';
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export interface VirbePluginWrapperProps {
  profileId: string;
  profileSecret: string;
  domain?: string;
  type?: WebWidgetType;
  onInitialized?: (ref: VirbePluginMethods) => void;
  onApiStatusChanged?: (ref: VirbePluginMethods, status: ApiStatus) => void;
  className?: string;
}

// IMPORTANT: We're loading this component through WebComponent ShadowRoot to avoid mixing in styles between Dashboard & plugin
const VirbePluginWrapper = forwardRef<VirbePluginMethods, VirbePluginWrapperProps>((props, ref) => {
  const pluginRef = useRef<VirbePluginMethods | null>(null);
  const { profileId, profileSecret, domain = getHost(), type = 'web-component', className } = props;
  const { isScriptLoaded } = useLoadScript(domain, type);
  const [isMounted, setIsMounted] = useState(false);

  const methods: VirbePluginMethods = useMemo(
    () => ({
      startNewConversation: (endUserId?: string) => {
        pluginRef.current?.startNewConversation(endUserId);
      },
      startConversation: (conversationId: string, endUserId?: string) => {
        pluginRef.current?.startConversation(conversationId, endUserId);
      },
      stopConversation: () => {
        pluginRef.current?.stopConversation();
      },
      showWidget: () => {
        pluginRef.current?.showWidget();
      },
      hideWidget: () => {
        pluginRef.current?.hideWidget();
      },
      sendText(text: string, language?: string) {
        pluginRef.current?.sendText(text, language);
      },
      sendSignal(name: string, value?: string) {
        pluginRef.current?.sendSignal(name, value);
      },
      startSpeechRecord: () => {
        pluginRef.current?.startSpeechRecord();
      },
      stopSpeechRecord: () => {
        pluginRef.current?.stopSpeechRecord();
      },
      interruptSpeech: () => {
        pluginRef.current?.interruptSpeech();
      },
      mute: () => {
        pluginRef.current?.mute();
      },
      unmute: () => {
        pluginRef.current?.unmute();
      },
      subscribeToEvent: (event, listener) => {
        return (
          pluginRef.current?.subscribeToEvent(event, listener) ?? {
            unsubscribe: () => {},
          }
        );
      },
    }),
    [],
  );
  useImperativeHandle(ref, () => methods, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (!pluginRef.current) {
      return;
    }

    const subscriptionInitialized = pluginRef.current.subscribeToEvent('onInitialized', () => {
      props.onInitialized?.(methods);
    });

    const subscriptionApiStatusChanged = pluginRef.current.subscribeToEvent('onApiStatusChanged', (event) => {
      const apiStatus = event.detail.action;
      props.onApiStatusChanged?.(methods, apiStatus);
    });

    return () => {
      subscriptionInitialized.unsubscribe();
      subscriptionApiStatusChanged.unsubscribe();
    };
  }, [isMounted]);

  const setRef = useCallback((newRef: VirbePluginMethods | null) => {
    if (newRef) {
      pluginRef.current = newRef;
      setIsMounted(true);
    } else {
      setIsMounted(false);
    }
  }, []);

  if (!isScriptLoaded) {
    return null;
  }

  return (
    <div className={cn('w-100dvw h-100dvh absolute size-full min-w-[400px]', className)}>
      <virbe-plugin ref={setRef} profileId={profileId} profileSecret={profileSecret} mode="embedded" />
    </div>
  );
});

const VirbePluginWrapperMemo = memo(VirbePluginWrapper);
export { VirbePluginWrapperMemo as VirbePluginWrapper };
