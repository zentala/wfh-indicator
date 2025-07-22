const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Device management
  getDevices: () => ipcRenderer.invoke("get-devices"),
  removeDevice: (deviceId: string) =>
    ipcRenderer.invoke("remove-device", deviceId),

  // Status management
  getStatus: () => ipcRenderer.invoke("get-status"),
  setStatus: (status: string) => ipcRenderer.send("set-status", status),

  // Pairing
  pairDevice: (ssid: string, password: string) =>
    ipcRenderer.invoke("pair-device", { ssid, password }),

  // Window management
  openPairingWindow: () => ipcRenderer.send("open-pairing-window"),
  openSettingsWindow: () => ipcRenderer.send("open-settings-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
  showPinHint: () => ipcRenderer.send("show-pin-hint"),

  // Event listeners
  onPairingStatus: (callback: (data: any) => void) => {
    ipcRenderer.on("pairing-status", (_: any, data: any) => callback(data));
  },

  onConfirmColorRequest: (callback: () => void) => {
    ipcRenderer.on("confirm-color-request", callback);
  },

  // Event senders
  confirmColorResponse: (confirmed: boolean) => {
    ipcRenderer.send("confirm-color-response", confirmed);
  },

  // Cleanup listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // ===== ASK TO ENTER API =====
  askToEnterRequest: (
    deviceId: string,
    deviceName: string,
    urgency?: "normal" | "urgent"
  ) =>
    ipcRenderer.invoke("ask-to-enter-request", {
      deviceId,
      deviceName,
      urgency,
    }),

  askToEnterResponse: (
    deviceId: string,
    response: "yes" | "no" | "if-urgent"
  ) => ipcRenderer.invoke("ask-to-enter-response", { deviceId, response }),

  // ===== SCHEDULE RULES API =====
  getScheduleRules: () => ipcRenderer.invoke("get-schedule-rules"),
  addScheduleRule: (rule: any) => ipcRenderer.invoke("add-schedule-rule", rule),
  updateScheduleRule: (id: string, updates: any) =>
    ipcRenderer.invoke("update-schedule-rule", { id, updates }),
  deleteScheduleRule: (id: string) =>
    ipcRenderer.invoke("delete-schedule-rule", id),

  // ===== SCHEDULE SERVICE API =====
  getScheduleServiceStatus: () =>
    ipcRenderer.invoke("get-schedule-service-status"),
  triggerScheduleCheck: () => ipcRenderer.invoke("trigger-schedule-check"),

  // ===== NOTIFICATION SERVICE API =====
  getActiveNotificationCount: () =>
    ipcRenderer.invoke("get-active-notification-count"),
  closeAllNotifications: () => ipcRenderer.invoke("close-all-notifications"),

  // ===== DEFAULT STATUS API =====
  getDefaultStatus: () => ipcRenderer.invoke("get-default-status"),
  setDefaultStatus: (status: any) =>
    ipcRenderer.send("set-default-status", status),
});
