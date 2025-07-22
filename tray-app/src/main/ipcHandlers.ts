import { ipcMain } from "electron";
import { stateManager } from "./stateManager";
import { deviceManager } from "./deviceManager";
import { WebSocketManager } from "./websocketManager";
import { openSettingsWindow, openPairingWindow } from "./windows";
import { WorkStatus } from "@wfh-indicator/domain";
import { ScheduleRule } from "../types/device";
import settings from "electron-settings";
import { notificationService } from "./notificationService";

const websocketManager = new WebSocketManager();

export function registerIpcHandlers(): void {
  ipcMain.on("open-settings-window", openSettingsWindow);
  ipcMain.on("open-pairing-window", openPairingWindow);
  ipcMain.on("show-pin-hint", () => {
    notificationService.showNotification(
      "Pin App Icon",
      "To keep the icon visible, find it in the system tray overflow menu, then drag and drop it onto your taskbar."
    );
  });

  ipcMain.handle("get-devices", async () => deviceManager.getDevices());
  ipcMain.handle("get-paired-devices", async () => deviceManager.getDevices());
  ipcMain.on("unpair-device", (event, deviceId: string) =>
    deviceManager.removeDevice(deviceId)
  );
  ipcMain.on("start-pairing", () => websocketManager.start());
  ipcMain.on("stop-pairing", () => websocketManager.stop());

  ipcMain.handle(
    "pair-device",
    async (event, { ssid, password }: { ssid: string; password: string }) => {
      console.log(`Pairing with SSID: ${ssid}`);
      const sender = event.sender;

      // Simulate pairing process and send status updates
      if (!sender.isDestroyed()) {
        sender.send("pairing-status", {
          step: "detecting",
          status: "pending",
          message: "Detecting device...",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (!sender.isDestroyed()) {
        sender.send("pairing-status", {
          step: "transferring",
          status: "pending",
          message: "Sending WiFi credentials...",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (!sender.isDestroyed()) {
        sender.send("pairing-status", {
          step: "testing",
          status: "pending",
          message: "Testing connection...",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate success
      if (!sender.isDestroyed()) {
        sender.send("pairing-status", {
          step: "success",
          status: "done",
          message: "Device paired successfully!",
        });
      }

      return { success: true };
    }
  );

  ipcMain.handle("get-status", () => stateManager.getStatus());
  ipcMain.on("set-status", (event, status: WorkStatus) => {
    stateManager.setStatus(status);
  });

  ipcMain.handle("get-schedule-rules", async () =>
    deviceManager.getScheduleRules()
  );
  ipcMain.handle("get-schedules", async () => deviceManager.getScheduleRules());
  ipcMain.on("save-schedules", (event, schedules: ScheduleRule[]) => {
    // This is a simplification. In a real app, you might want to diff
    // the schedules and call add/update/delete accordingly.
    // For now, we'll just replace the whole list.
    settings.set("scheduleRules", schedules as any);
    deviceManager.emit("schedule-rules-changed");
  });

  ipcMain.handle("get-default-status", async () => {
    const defaultStatus = await settings.get("defaultStatus");
    return defaultStatus || WorkStatus.AVAILABLE;
  });

  ipcMain.on("set-default-status", (event, status: WorkStatus) => {
    settings.set("defaultStatus", status);
  });
}
