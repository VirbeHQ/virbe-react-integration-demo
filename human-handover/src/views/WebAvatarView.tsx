import environment from '../environment.ts';
import { VirbePluginWrapper } from '@/components/plugin/VirbePluginWrapper.tsx';
import { useLocalStorage } from '@uidotdev/usehooks';
import { ApiStatus, VirbePluginMethods } from '../components/plugin/types';
import { useEffect, useRef, useState } from 'react';
import { LocalStorageItem } from "@/utils/localStorage.ts";

export function WebAvatarView() {
  const ref = useRef<VirbePluginMethods>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [humanHandover] = useLocalStorage(LocalStorageItem.HumanHandover, false);
  const [controllerApiStatus] = useLocalStorage<ApiStatus | null>(LocalStorageItem.ControllerApiStatus, null);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (humanHandover) {
      ref.current?.stopConversation();
    } else if (controllerApiStatus) {
      const { connection, conversation } = controllerApiStatus;

      if (connection === 'connected' && conversation) {
        ref.current?.startConversation(conversation.conversationId, conversation.endUserId);
      }
    }
  }, [humanHandover, controllerApiStatus, isInitialized]);

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
              // WARNING!
              // Ensure "autoStartOnWidgetFocusedEnabled" and "autoStartOnPageFocusedEnabled" are set to >false< in the profile settings

              setIsInitialized(true);
            }}
            onApiStatusChanged={(plugin, { connection, conversation }) => {
              if (connection === 'connected' && conversation) {
                // WARNING!
                // Ensure "startSignalOnNewConversationEnabled" is set to >false< in the profile settings

                plugin.unmute();
                plugin.sendSignal('conversation-start');
              }
            }}
            type="web-component"
            className="z-0"
          />
        )}
      </div>
    </>
  );
}
