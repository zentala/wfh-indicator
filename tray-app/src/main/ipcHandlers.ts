import { ipcMain } from "electron";
import { stateManager } from "./stateManager";
import { deviceManager } from "./deviceManager";
import { WebSocketManager } from "./websocketManager";
import { openSettingsWindow, openPairingWindow } from "./windows";
import { WorkStatus } from "@wfh-indicator/domain";
import { ScheduleRule } from "../types/device";
import settings from "electron-settings";

const websocketManager = new WebSocketManager();

export function registerIpcHandlers(): void {
  ipcMain.on("open-settings-window", openSettingsWindow);
  ipcMain.on("open-pairing-window", openPairingWindow);

  ipcMain.handle("get-devices", async () => deviceManager.getDevices());
  ipcMain.handle("get-paired-devices", async () => deviceManager.getDevices());
  ipcMain.on("unpair-device", (event, deviceId: string) =>
    deviceManager.removeDevice(deviceId)
  );
  ipcMain.on("start-pairing", () => websocketManager.start());
  ipcMain.on("stop-pairing", () => websocketManager.stop());

  ipcMain.handle("get-status", () => stateManager.getStatus());
  ipcMain.on("set-status", (event, status: WorkStatus) => {
    stateManager.setStatus(status);
  });

  ipcMain.handle("get-schedules", async () => deviceManager.getScheduleRules());
  ipcMain.on("save-schedules", (event, schedules: ScheduleRule[]) => {
    // This is a simplification. In a real app, you might want to diff
    // the schedules and call add/update/delete accordingly.
    // For now, we'll just replace the whole list.
    settings.set("scheduleRules", schedules as any);
    deviceManager.emit("schedule-rules-changed");
  });
}
