import { ipcMain } from "electron";
import { WorkStatus } from "../shared/types";
import { stateManager } from "./stateManager";
import log from "electron-log";

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

  // Future handlers will be added here, e.g., for settings, devices.
}
