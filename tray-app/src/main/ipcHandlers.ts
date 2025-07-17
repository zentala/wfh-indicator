import { ipcMain, BrowserWindow } from "electron";
import { WorkStatus } from "../shared/types";
import { stateManager } from "./stateManager";
import log from "electron-log";
import path from "path";

/**
 * Creates and displays the pairing window.
 */
export function createPairingWindow(): void {
  const pairingWindow = new BrowserWindow({
    width: 450,
    height: 600,
    title: "Pair New Device",
    modal: true,
    // parent: // we can set a parent if we have a main window
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"), // Correct path to preload
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Pass a query parameter to the renderer to identify the window type
  pairingWindow.loadFile(path.join(__dirname, "../../../renderer/index.html"), {
    query: { window: "pairing" },
  });
}

/**
 * Registers all IPC handlers for the application.
 */
export function registerIPCHandlers(): void {
  /**
   * Handles the 'set-status' event from the renderer process.
   * It updates the application's work status.
   */
  ipcMain.on("set-status", (_, status: WorkStatus) => {
    log.info(`Received set-status event with status: ${status}`);
    stateManager.setStatus(status);
  });

  ipcMain.handle("open-pairing-window", createPairingWindow);

  ipcMain.on("close-window", (event) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    window?.close();
  });

  // Future handlers will be added here, e.g., for settings, devices.
}
