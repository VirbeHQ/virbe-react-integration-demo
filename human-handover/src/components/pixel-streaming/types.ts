/**
 * Plugin internal types
 */

export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';
export type ConversationStatus = null | {
  type: 'initialized';
  conversationId: string;
  endUserId: string;
};

export type WebRtcStatus = {
  connected: boolean;
  streamerId?: string;
};

export type ApiStatus = {
  connection: ConnectionStatus;
  conversation: ConversationStatus;
};

export type Subscription = {
  unsubscribe: () => void;
};
export type EventListener = (event: CustomEvent) => void;
export type SubscribeEvent = (listener: EventListener) => Subscription;

/**
 * Plugin exposed methods
 */
export type VirbePluginEvent =
  | 'onApiStatusChanged'
  | 'onInitialized'
  | 'onStreamAccepted'
  | 'onStreamRejected'
  | 'onWebRtcSessionStatusChanged'
  | 'onCustomMessageAction'
  | 'onEngineEvent'
  | 'onStartedSpeaking'
  | 'onEndedSpeaking'
  | 'onInterruptSpeechClicked';

export interface VirbePluginMethods {
  sendText: (text: string, language?: string) => void;
  sendSignal: (name: string, value?: string) => void;
  showWidget: () => void;
  hideWidget: () => void;
  mute: () => void;
  unmute: () => void;
  reconnectStream: () => void;
  playStream: () => void;
  changeStreamResolution: (width: number, height: number) => void;
  changeStreamSetting: (key: SettingKeys, value: unknown) => void;
  disconnectStream: () => void;
  muteMicrophone: () => void;
  unmuteMicrophone: () => void;
  startNewConversation: (endUserId?: string) => void;
  startConversation: (conversationId: string, endUserId?: string) => void;
  stopConversation: () => void;
  startSpeechRecord: () => void;
  stopSpeechRecord: () => void;
  interruptSpeech: () => void;
  subscribeToEvent: (event: VirbePluginEvent, listener: EventListener) => Subscription;
}

export interface VirbePixelStreamingExposedSettings {
  AutoConnect?: boolean;
  UseMic?: boolean;
  MatchViewportRes?: boolean;
  DefaultResolutionWidth?: number;
  DefaultResolutionHeight?: number;
  StartVideoMuted?: boolean;
  AutoPlayVideo?: boolean;
  TouchInput?: boolean;
  FakeMouseWithTouches?: boolean;
  MouseInput?: boolean;
  KeyboardInput?: boolean;
  SuppressBrowserKeys?: boolean;
  PreferredCodec?: 'VP8' | 'H264' | 'VP9';
  // Changing WebRTC settings requires a reconnection of the stream
  WebRTCFPS?: number;
  WebRTCMinBitrate?: number;
  WebRTCMaxBitrate?: number;
  ControlsQuality?: boolean;
  MinQP?: number;
  MaxQP?: number;
}

export type SettingKeys = keyof VirbePixelStreamingExposedSettings;

/**
 * Plugin attributes and global types for the plugin element to provide type-safety
 */

export interface VirbePluginProps {
  ss: string;
  streamerId: string;
  mode?: string;
  position?: string;
  settings?: string;
}

// it provides type-safety for the <virbe-plugin> element
export type VirbePixelStreamingPlugin = React.DetailedHTMLProps<React.HTMLAttributes<VirbePluginMethods>, VirbePluginMethods> & VirbePluginProps;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['virbe-pixel-streaming']: VirbePixelStreamingPlugin;
    }
  }
}
