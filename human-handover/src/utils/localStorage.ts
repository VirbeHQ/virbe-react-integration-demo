export const LocalStorageItem = {
  HumanHandover: 'HumanHandover',
  ControllerApiStatus: 'ControllerApiStatus',
  DisplayHasWebRtcSession: 'DisplayHasWebRtcSession',
};

export type LocalStorageItem = (typeof LocalStorageItem)[keyof typeof LocalStorageItem];
