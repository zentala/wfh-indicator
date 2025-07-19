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

  // Event listeners
  onPairingStatus: (callback: (data: any) => void) => {
    ipcRenderer.on("pairing-status", (_, data) => callback(data));
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
});
