export interface IpcApi {
  // From preload.ts
  getDevices: () => Promise<any[]>;
  removeDevice: (deviceId: string) => Promise<void>;
  getStatus: () => Promise<string>;
  setStatus: (status: string) => void;
  pairDevice: (ssid: string, password: string) => Promise<any>;
  openPairingWindow: () => void;
  openSettingsWindow: () => void;
  closeWindow: () => void;
  onPairingStatus: (callback: (data: any) => void) => void;
  onConfirmColorRequest: (callback: () => void) => void;
  confirmColorResponse: (confirmed: boolean) => void;
  removeAllListeners: (channel: string) => void;
  askToEnterRequest: (
    deviceId: string,
    deviceName: string,
    urgency?: "normal" | "urgent"
  ) => Promise<any>;
  askToEnterResponse: (
    deviceId: string,
    response: "yes" | "no" | "if-urgent"
  ) => Promise<any>;
  getScheduleRules: () => Promise<any[]>;
  addScheduleRule: (rule: any) => Promise<any>;
  updateScheduleRule: (id: string, updates: any) => Promise<any>;
  deleteScheduleRule: (id: string) => Promise<void>;
  getScheduleServiceStatus: () => Promise<any>;
  triggerScheduleCheck: () => Promise<void>;
  getActiveNotificationCount: () => Promise<number>;
  closeAllNotifications: () => Promise<void>;
  getDefaultStatus: () => Promise<string>;
  setDefaultStatus: (status: string) => void;
}

declare global {
  interface Window {
    api: IpcApi;
  }
}
