import { ipcMain, BrowserWindow } from "electron";
import { deviceManager } from "./deviceManager";
import { stateManager } from "./stateManager";
import { notificationService } from "./notificationService";
import { scheduleService } from "./scheduleService";
import path from "path";
import log from "electron-log";
import { SerialPort } from "serialport";
import { ScheduleRule } from "../types/device";
import { DeviceType, getDeviceCapabilities } from "@wfh-indicator/domain";

let pairingWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

export function createPairingWindow(): void {
  if (pairingWindow) {
    pairingWindow.focus();
    return;
  }
  pairingWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  const url = process.env.VITE_DEV_SERVER_URL
    ? `${process.env.VITE_DEV_SERVER_URL}?window=pairing`
    : `file://${path.join(__dirname, "../renderer/index.html")}?window=pairing`;

  pairingWindow.loadURL(url);

  pairingWindow.on("closed", () => {
    pairingWindow = null;
  });
}

export function createSettingsWindow(): void {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      sandbox: false,
    },
  });

  const url = process.env.VITE_DEV_SERVER_URL
    ? `${process.env.VITE_DEV_SERVER_URL}?window=settings`
    : `file://${path.join(
        __dirname,
        "../renderer/index.html"
      )}?window=settings`;

  settingsWindow.loadURL(url);

  settingsWindow.on("closed", () => {
    settingsWindow = null;
  });
}

ipcMain.on("close-window", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.handle(
  "pair-device",
  async (event, { ssid, password }: { ssid: string; password: string }) => {
    const webContents = event.sender;
    let port: SerialPort | null = null; // Hold the port reference

    try {
      // Step 1: Detect USB
      webContents.send("pairing-status", {
        step: "detecting",
        status: "pending",
      });
      port = await deviceManager.detectUSBDevice();
      if (!port) {
        throw new Error("No device found. Please check the connection.");
      }

      // Open the serial port
      const portOpened = await deviceManager.openSerialPort(port);
      if (!portOpened) {
        throw new Error("Failed to open serial port.");
      }

      webContents.send("pairing-status", {
        step: "detecting",
        status: "success",
      });

      // Step 2: Transfer Credentials
      webContents.send("pairing-status", {
        step: "transferring",
        status: "pending",
      });
      const transferSuccess = await deviceManager.transferWifiCredentials(
        port,
        ssid,
        password
      );
      if (!transferSuccess) {
        throw new Error("Failed to transfer WiFi credentials.");
      }
      webContents.send("pairing-status", {
        step: "transferring",
        status: "success",
      });

      // Step 3: Test Connection
      webContents.send("pairing-status", {
        step: "connecting",
        status: "pending",
      });
      const connectionSuccess = await deviceManager.testDeviceConnection();
      if (!connectionSuccess) {
        throw new Error("Device failed to connect to WiFi.");
      }
      webContents.send("pairing-status", {
        step: "connecting",
        status: "success",
      });

      // Step 4: Visual Confirmation
      webContents.send("pairing-status", {
        step: "confirming",
        status: "pending",
      });
      await deviceManager.setDeviceColor(port, "green");
      const userConfirmed = await new Promise<boolean>((resolve) => {
        ipcMain.once("confirm-color-response", (_, confirmed) =>
          resolve(confirmed)
        );
        webContents.send("confirm-color-request");
      });

      if (!userConfirmed) {
        throw new Error("User did not confirm the color change.");
      }

      // Final Step: Add device
      await deviceManager.addDevice({
        name: "New LED Device",
        deviceType: DeviceType.LED_RING,
        batteryLevel: 100,
        charging: false,
        lastActivity: new Date(),
        capabilities: getDeviceCapabilities(DeviceType.LED_RING),
      });
      webContents.send("pairing-status", { step: "done", status: "success" });
    } catch (error: any) {
      log.error("Pairing failed:", error);
      webContents.send("pairing-status", {
        step: "error",
        status: "error",
        message: error.message,
      });
    } finally {
      if (port) {
        await deviceManager.closeSerialPort(port);
      }
    }
  }
);

ipcMain.handle("get-devices", async () => {
  return await deviceManager.getDevices();
});

ipcMain.handle("remove-device", async (event, deviceId: string) => {
  await deviceManager.removeDevice(deviceId);
  return await deviceManager.getDevices();
});

ipcMain.handle("get-status", () => {
  return stateManager.getStatus();
});

export function registerIPCHandlers(): void {
  ipcMain.on("set-status", (_, status) => {
    stateManager.setStatus(status);
  });

  ipcMain.on("open-pairing-window", createPairingWindow);
  ipcMain.on("open-settings-window", createSettingsWindow);

  // ===== ASK TO ENTER HANDLERS =====

  /**
   * Handles "Ask to Enter" requests from devices.
   * Shows a system notification to the user.
   */
  ipcMain.handle(
    "ask-to-enter-request",
    async (
      event,
      {
        deviceId,
        deviceName,
        urgency,
      }: {
        deviceId: string;
        deviceName: string;
        urgency?: "normal" | "urgent";
      }
    ) => {
      try {
        log.info(
          `Received "Ask to Enter" request from device: ${deviceName} (${deviceId})`
        );

        // Check if device exists
        const devices = await deviceManager.getDevices();
        const device = devices.find((d) => d.deviceId === deviceId);

        if (!device) {
          log.warn(`"Ask to Enter" request from unknown device: ${deviceId}`);
          return { success: false, error: "Device not found" };
        }

        // Show notification
        notificationService.showAskToEnter(deviceId, deviceName, urgency);

        return { success: true };
      } catch (error) {
        log.error("Failed to handle Ask to Enter request:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  );

  /**
   * Handles user responses to "Ask to Enter" requests.
   * Sends the response back to the requesting device.
   */
  ipcMain.handle(
    "ask-to-enter-response",
    async (
      event,
      {
        deviceId,
        response,
      }: {
        deviceId: string;
        response: "yes" | "no" | "if-urgent";
      }
    ) => {
      try {
        log.info(
          `User responded to "Ask to Enter" from device ${deviceId}: ${response}`
        );

        // The actual response handling is done in NotificationService
        // This handler is for programmatic responses (e.g., from UI)
        return { success: true };
      } catch (error) {
        log.error("Failed to handle Ask to Enter response:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  );

  // ===== SCHEDULE RULES HANDLERS =====

  /**
   * Gets all schedule rules.
   */
  ipcMain.handle("get-schedule-rules", async () => {
    try {
      return await deviceManager.getScheduleRules();
    } catch (error) {
      log.error("Failed to get schedule rules:", error);
      return [];
    }
  });

  /**
   * Adds a new schedule rule.
   */
  ipcMain.handle(
    "add-schedule-rule",
    async (event, rule: Omit<ScheduleRule, "id">) => {
      try {
        // Validate the rule
        if (!deviceManager.validateScheduleRule({ ...rule, id: "temp" })) {
          return { success: false, error: "Invalid schedule rule" };
        }

        const newRule = await deviceManager.addScheduleRule(rule);
        log.info(`Added new schedule rule: ${newRule.id}`);

        return { success: true, rule: newRule };
      } catch (error) {
        log.error("Failed to add schedule rule:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  );

  /**
   * Updates an existing schedule rule.
   */
  ipcMain.handle(
    "update-schedule-rule",
    async (
      event,
      {
        id,
        updates,
      }: {
        id: string;
        updates: Partial<ScheduleRule>;
      }
    ) => {
      try {
        const updatedRule = await deviceManager.updateScheduleRule(id, updates);
        log.info(`Updated schedule rule: ${id}`);

        return { success: true, rule: updatedRule };
      } catch (error) {
        log.error("Failed to update schedule rule:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }
  );

  /**
   * Deletes a schedule rule.
   */
  ipcMain.handle("delete-schedule-rule", async (event, id: string) => {
    try {
      await deviceManager.deleteScheduleRule(id);
      log.info(`Deleted schedule rule: ${id}`);

      return { success: true };
    } catch (error) {
      log.error("Failed to delete schedule rule:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

  // ===== SCHEDULE SERVICE HANDLERS =====

  /**
   * Gets the current status of the schedule service.
   */
  ipcMain.handle("get-schedule-service-status", () => {
    return {
      isRunning: scheduleService.isServiceRunning(),
    };
  });

  /**
   * Manually triggers a schedule check.
   */
  ipcMain.handle("trigger-schedule-check", async () => {
    try {
      await scheduleService.triggerCheck();
      return { success: true };
    } catch (error) {
      log.error("Failed to trigger schedule check:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

  // ===== NOTIFICATION SERVICE HANDLERS =====

  /**
   * Gets the number of active notifications.
   */
  ipcMain.handle("get-active-notification-count", () => {
    return notificationService.getActiveNotificationCount();
  });

  /**
   * Closes all active notifications.
   */
  ipcMain.handle("close-all-notifications", () => {
    notificationService.closeAllNotifications();
    return { success: true };
  });
}
