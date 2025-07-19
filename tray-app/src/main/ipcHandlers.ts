import { ipcMain, BrowserWindow } from "electron";
import { deviceManager } from "./deviceManager";
import { stateManager } from "./stateManager";
import path from "path";
import log from "electron-log";

let pairingWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

function createPairingWindow(): void {
  if (pairingWindow) {
    pairingWindow.focus();
    return;
  }
  pairingWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
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

ipcMain.on("close-window", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.handle(
  "pair-device",
  async (event, { ssid, password }: { ssid: string; password: string }) => {
    const webContents = event.sender;
    let port: any = null; // Hold the port reference

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
      port?.close();
    }
  }
);

export function registerIPCHandlers(): void {
  ipcMain.on("set-status", (_, status) => {
    stateManager.setStatus(status);
  });

  ipcMain.on("open-pairing-window", createPairingWindow);
}
