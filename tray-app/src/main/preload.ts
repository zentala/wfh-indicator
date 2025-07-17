const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipc", {
  // Add other IPC channels as needed
  openPairingWindow: () => ipcRenderer.invoke("open-pairing-window"),
  closeWindow: () => ipcRenderer.send("close-window"),
});
