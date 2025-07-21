import { ipcMain } from "electron";
import { stateManager } from "./stateManager";
import { scheduleService } from "./scheduleService";
import { deviceManager } from "./deviceManager";
import { WebSocketManager } from "./websocketManager";
import { openSettingsWindow, openPairingWindow } from "./windows";
import { WorkStatus } from "@wfh-indicator/domain/dist/types/workStatus";

const websocketManager = new WebSocketManager();

export function registerIpcHandlers(): void {
  ipcMain.on("open-settings-window", openSettingsWindow);
  ipcMain.on("open-pairing-window", openPairingWindow);

  ipcMain.handle("get-paired-devices", async () => deviceManager.getDevices());
  ipcMain.on("unpair-device", (event, deviceId: string) =>
    deviceManager.removeDevice(deviceId)
  );
  ipcMain.on("start-pairing", () => websocketManager.startPairing());
  ipcMain.on("stop-pairing", () => websocketManager.stopPairing());

  ipcMain.handle("get-status", () => stateManager.getStatus());
  ipcMain.on("set-status", (event, status: WorkStatus) => {
    stateManager.setStatus(status);
  });

  ipcMain.handle("get-schedules", () => scheduleService.getSchedules());
  ipcMain.on("save-schedules", (event, schedules) => {
    scheduleService.saveSchedules(schedules);
  });
}
