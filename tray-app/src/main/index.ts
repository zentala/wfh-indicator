// This allows TypeScript to pick up the magic constants that's run via webpack
// in production environments.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

import { app, BrowserWindow } from "electron";
import path from "path";
import { autoUpdater } from "electron-updater";
import { createTray } from "./tray";
import { registerIPCHandlers } from "./ipcHandlers";
import { scheduleService } from "./scheduleService";
import log from "electron-log";

// Configure logging
log.initialize();

Object.assign(console, log.functions);

console.log("App starting...");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  createTray();
  registerIPCHandlers();

  // Start the schedule service for automatic status changes
  scheduleService.start();

  console.log(
    "Tray created, IPC handlers registered, and schedule service started. App is ready."
  );
};

app.whenReady().then(() => {
  createWindow();

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

autoUpdater.on("update-available", () => {
  log.info("Update available.");
});

autoUpdater.on("update-downloaded", () => {
  log.info("Update downloaded; will install now");
  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (err) => {
  log.error("Error in auto-updater.", err);
});

// We are a tray app, so we'll never quit automatically.
app.on("window-all-closed", () => {});
