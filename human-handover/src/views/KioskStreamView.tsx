import environment from "../environment.ts";
import {useLocalStorage} from "@uidotdev/usehooks";
import {ApiStatus} from "../components/plugin/types";
import {useCallback, useEffect, useRef} from "react";
import {VirbePixelStreamingWrapper} from "@/components/pixel-streaming/VirbePixelStreamingWrapper.tsx";
import {VirbePluginMethods, WebRtcStatus} from "@/components/pixel-streaming/types.ts";
import {LocalStorageItem} from "@/utils/localStorage.ts";

export function KioskStreamView() {
  const ref = useRef<VirbePluginMethods>(null);
  const [humanHandover] = useLocalStorage(LocalStorageItem.HumanHandover, false);
  const [controllerApiStatus] = useLocalStorage<ApiStatus | null>(LocalStorageItem.ControllerApiStatus, null);
  const [hasWebRtcSession, setHasWebRtcSession] = useLocalStorage(LocalStorageItem.DisplayHasWebRtcSession, false);

  const startConversationUsingControllerStatus = useCallback(
    (plugin: VirbePluginMethods, apiStatus: ApiStatus) => {
      if (controllerApiStatus) {
        const {conversation} = apiStatus;
        if (conversation) {
          console.log("Starting conversation", conversation);
          plugin.startConversation(conversation.conversationId, conversation.endUserId);
          plugin.unmute();
        }
      }
    }, []);

  useEffect(() => {
    if (humanHandover) {
      ref.current?.interruptSpeech();
      ref.current?.stopConversation();
    } else {
      if (ref.current && controllerApiStatus && hasWebRtcSession) {
        console.log("Starting conversation using controller status", controllerApiStatus);
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
  }, []);

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
            settings={{
              UseMic: false,
              MatchViewportRes: false,
              // DefaultResolutionWidth: 320,
              // DefaultResolutionHeight: 640,
            }}
            domain={environment.dashboardUrl}
            onInitialized={(_) => {
              setHasWebRtcSession(false);
              // Connection will be initialized by Touch module and passed through localStorage
            }}
            onStreamAccepted={onStreamAccepted}
            onWebRtcSessionStatusChanged={(_: VirbePluginMethods, status: WebRtcStatus) => {
              const {connected} = status;
              setHasWebRtcSession(connected);
            }}
            className="z-0"
          />
        )}
      </div>
    </>
  );
}
