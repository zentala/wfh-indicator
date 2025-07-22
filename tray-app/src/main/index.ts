import { app } from "electron";
import { stateManager } from "./stateManager";
import { createTray, updateTrayStatus } from "./tray";
import { registerIpcHandlers } from "./ipcHandlers";
import { scheduleService } from "./scheduleService";
import { WorkStatus } from "@wfh-indicator/domain";

if (require("electron-squirrel-startup")) {
  app.quit();
}

app.on("ready", () => {
  console.log("App starting...");

  // Wait for the initial status to be loaded before creating the tray
  stateManager.on("status-initialized", (initialStatus: WorkStatus) => {
    createTray(initialStatus);
    scheduleService.start();
    console.log("App is ready.");
  });

  registerIpcHandlers();

  stateManager.on("status-changed", (newStatus: WorkStatus) => {
    updateTrayStatus(newStatus);
  });
});
