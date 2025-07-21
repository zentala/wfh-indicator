import { app } from "electron";
import { stateManager } from "./stateManager";
import { createTray, updateTrayStatus } from "./tray";
import { registerIpcHandlers } from "./ipcHandlers";
import { scheduleService } from "./scheduleService";

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  console.log("App starting...");
  const initialStatus = stateManager.getStatus();
  createTray(initialStatus.status);
  registerIpcHandlers();
  scheduleService.start();
  console.log("App is ready.");
  stateManager.on("status-changed", (newStatus) => {
    updateTrayStatus(newStatus);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
