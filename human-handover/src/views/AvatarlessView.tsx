import environment from '@/environment.ts';
import { VirbePluginWrapper } from '@/components/plugin/VirbePluginWrapper';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useEffect, useRef, useState } from 'react';
import { VirbePluginMethods } from '@/components/plugin/types';
import { ApiStatus } from '../components/plugin/types';
import { LocalStorageItem } from "@/utils/localStorage.ts";

export function AvatarlessView() {
  const ref = useRef<VirbePluginMethods>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [humanHandover] = useLocalStorage(LocalStorageItem.HumanHandover, false);
  const [hasWebRtcSession] = useLocalStorage(LocalStorageItem.DisplayHasWebRtcSession, false);
  const [, setControllerApiState] = useLocalStorage<ApiStatus | null>(LocalStorageItem.ControllerApiStatus, null);

  useEffect(() => {
    if (humanHandover) {
      ref.current?.stopConversation();
      setIsInitialized(false);
    } else if (isInitialized) {
      ref.current?.startNewConversation();
    }
  }, [humanHandover, isInitialized]);

  useEffect(() => {
    if (hasWebRtcSession) {
      // Mute if there is a WebRTC session - audio goes through the WebRTC connection
      ref.current?.mute();
    } else {
      // Unmute if there is no WebRTC session - audio goes through the touch screen
      ref.current?.unmute();
    }
  }, [hasWebRtcSession]);

  return (
    <>
      <div className="dark min-h-screen bg-background">
        {humanHandover ? (
          <p>Human Handover</p>
        ) : (
          <VirbePluginWrapper
            ref={ref}
            profileId={environment.profileId}
            profileSecret={environment.profileSecret}
            domain={environment.dashboardUrl}
            onInitialized={() => {
              setIsInitialized(true);
            }}
            onApiStatusChanged={(plugin, { connection, conversation }) => {
              if (connection === 'connected' && conversation) {
                setControllerApiState({ connection, conversation });
                // Start unmuted but mute if there is a WebRTC session
                console.log('Starting conversation', conversation);
                console.log('Muting if there is a WebRTC session', hasWebRtcSession);
                if (!hasWebRtcSession) {
                  plugin.unmute();
                } else {
                  plugin.mute();
                }
              } else {
                setControllerApiState(null)
              }
            }}
            type="web-component-avatarless"
            className="z-0"
          />
        )}
      </div>
    </>
  );
}
