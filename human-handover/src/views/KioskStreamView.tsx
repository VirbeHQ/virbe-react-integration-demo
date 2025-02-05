import environment from "../environment.ts";
import { useLocalStorage } from "@uidotdev/usehooks";
import { ApiStatus } from "../components/plugin/types";
import { useCallback, useEffect, useRef } from "react";
import { VirbePixelStreamingWrapper } from "@/components/pixel-streaming/VirbePixelStreamingWrapper.tsx";
import { VirbePluginMethods, WebRtcStatus } from "@/components/pixel-streaming/types.ts";
import { LocalStorageItem } from "@/utils/localStorage.ts";

export function KioskStreamView() {
  const ref = useRef<VirbePluginMethods>(null);
  const [humanHandover] = useLocalStorage(LocalStorageItem.HumanHandover, false);
  const [controllerApiStatus] = useLocalStorage<ApiStatus | null>(LocalStorageItem.ControllerApiStatus, null);
  const [hasWebRtcSession, setHasWebRtcSession] = useLocalStorage(LocalStorageItem.DisplayHasWebRtcSession, false);

  const startConversationUsingControllerStatus = useCallback(
    (plugin: VirbePluginMethods, apiStatus: ApiStatus) => {
      if (controllerApiStatus) {
        const { conversation } = apiStatus;
        if (conversation) {
          console.log("Starting conversation", conversation);
          plugin.startConversation(conversation.conversationId, conversation.endUserId);
          plugin.unmute();
        }
      }
    },
    []
  );

  const onWebRtcSessionStatusChanged = useCallback(
    (_: VirbePluginMethods, status: WebRtcStatus) => {
      const { connected } = status;
      setHasWebRtcSession(connected);
    },
    []
  );

  useEffect(() => {
    if (humanHandover) {
      ref.current?.stopConversation();
    } else {
      if (ref.current && controllerApiStatus && hasWebRtcSession) {
        // Connect to conversation using controller api status
        startConversationUsingControllerStatus(ref.current, controllerApiStatus);
      }
    }
  }, [hasWebRtcSession, humanHandover, controllerApiStatus]);

  const onStreamAccepted = useCallback((plugin: VirbePluginMethods, _: string) => {
    // This is moment where communication socket with kiosk is active
    if (controllerApiStatus) {
      startConversationUsingControllerStatus(plugin, controllerApiStatus);
    }
  }, [controllerApiStatus]);

  return (
    <>
      <div className="dark min-h-screen bg-background">
        {humanHandover ? (
          <p>Human Handover</p>
        ) : (
          <VirbePixelStreamingWrapper
            ref={ref}
            ss={environment.ss}
            streamerId={environment.streamerId}
            domain={environment.dashboardUrl}
            onInitialized={(_) => {
              setHasWebRtcSession(false);
              // Connection will be initialized by Touch module and passed through localStorage
            }}
            onStreamAccepted={onStreamAccepted}
            onWebRtcSessionStatusChanged={onWebRtcSessionStatusChanged}
            className="z-0"
          />
        )}
      </div>
    </>
  );
}
