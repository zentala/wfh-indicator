import { ipcMain, BrowserWindow } from "electron";
import { deviceManager } from "./deviceManager";
import { stateManager } from "./stateManager";
import path from "path";
import log from "electron-log";
import { SerialPort } from "serialport";

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
      await deviceManager.addDevice({ name: "New LED Device", battery: 100 });
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
}
