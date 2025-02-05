import { useLoadScript } from './useLoadScript';
import { getHost } from "@/utils/host.ts";
import { cn } from "@/utils/cn.ts";
import { ApiStatus, VirbePluginMethods, WebRtcStatus } from "./types.ts";
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

export interface VirbePixelStreamingWrapperProps {
  ss: string;
  streamerId: string;
  domain?: string;
  onInitialized?: (ref: VirbePluginMethods) => void;
  onStreamAccepted?: (ref: VirbePluginMethods, streamerId: string) => void;
  onWebRtcSessionStatusChanged?: (ref: VirbePluginMethods, status: WebRtcStatus) => void;
  onApiStatusChanged?: (ref: VirbePluginMethods, status: ApiStatus) => void;
  className?: string;
}

const VirbePixelStreamingWrapper = forwardRef<VirbePluginMethods, VirbePixelStreamingWrapperProps>((props, ref) => {
  const pluginRef = useRef<VirbePluginMethods | null>(null);
  const { ss, streamerId, domain = getHost(), className } = props;
  const { isScriptLoaded } = useLoadScript(domain);
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

    const subscriptionOnStreamAccepted = pluginRef.current.subscribeToEvent('onStreamAccepted', (event) => {
      const streamerId = event.detail.streamerId;
      props.onStreamAccepted?.(methods, streamerId);
    });

    const subscriptionWebRtcSessionStatusChanged = pluginRef.current.subscribeToEvent('onWebRtcSessionStatusChanged', (event) => {
      const webRtcSessionStatus = event.detail.status;
      props.onWebRtcSessionStatusChanged?.(methods, webRtcSessionStatus);
    });

    const subscriptionApiStatusChanged = pluginRef.current.subscribeToEvent('onApiStatusChanged', (event) => {
      const apiStatus = event.detail.action;
      props.onApiStatusChanged?.(methods, apiStatus);
    });

    return () => {
      subscriptionInitialized.unsubscribe();
      subscriptionOnStreamAccepted.unsubscribe();
      subscriptionWebRtcSessionStatusChanged.unsubscribe();
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
      <virbe-pixel-streaming ref={setRef} ss={ss} streamerId={streamerId} mode="embedded" />
    </div>
  );
});

const VirbePixelStreamingWrapperMemo = memo(VirbePixelStreamingWrapper);
export { VirbePixelStreamingWrapperMemo as VirbePixelStreamingWrapper };
