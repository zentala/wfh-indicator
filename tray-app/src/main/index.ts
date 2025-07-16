// This allows TypeScript to pick up the magic constants that's run via webpack
// in production environments.
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

import { app } from "electron";
import { createTray } from "./tray";
import log from "electron-log";

// Configure logging
log.initialize();

Object.assign(console, log.functions);

console.log("App starting...");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createTray();
  console.log("Tray created, app is ready.");
});

// We are a tray app, so we'll never quit automatically.
app.on("window-all-closed", () => {});
