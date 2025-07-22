import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
  BrowserWindow,
} from "electron";
import path from "path";
import log from "electron-log";
import {
  WorkStatus,
  WORK_STATUS_EMOJIS,
  WORK_STATUS_ICON_COLORS,
} from "@wfh-indicator/domain";
import { stateManager } from "./stateManager";
import { openSettingsWindow, openPairingWindow } from "./windows";

let tray: Tray | null = null;

const getIconPath = (status: WorkStatus = WorkStatus.AWAY): string => {
  const color = WORK_STATUS_ICON_COLORS[status] || "gray";
  const iconName = `circle-${color}.png`;
  let iconPath;
  if (app.isPackaged) {
    iconPath = path.join(process.resourcesPath, "renderer", iconName);
  } else {
    iconPath = path.join(__dirname, "../../public/icons", iconName);
  }
  log.info(`[Tray] Getting icon path: ${iconPath}`);
  return iconPath;
};

const buildContextMenu = (currentStatus: WorkStatus): Menu => {
  const template: MenuItemConstructorOptions[] = [
    { label: "WFH Indicator", enabled: false },
    { type: "separator" },
    ...Object.values(WorkStatus).map((statusValue) => ({
      label: `${WORK_STATUS_EMOJIS[statusValue]} ${statusValue.replace(
        /_/g,
        " "
      )}`,
      type: "radio" as const,
      checked: currentStatus === statusValue,
      click: () => {
        stateManager.setStatus(statusValue);
      },
    })),
    { type: "separator" },
    {
      label: "Settings",
      click: openSettingsWindow,
    },
    {
      label: "Pair New Device",
      click: openPairingWindow,
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        // Destroy all windows before quitting to ensure a clean exit
        BrowserWindow.getAllWindows().forEach((win) => win.destroy());
        app.quit();
      },
    },
  ];

  return Menu.buildFromTemplate(template);
};

export function createTray(initialStatus: WorkStatus): void {
  log.info("[Tray] Creating tray icon...");
  try {
    const icon = nativeImage.createFromPath(getIconPath(initialStatus));
    tray = new Tray(icon);

    const contextMenu = buildContextMenu(initialStatus);
    tray.setContextMenu(contextMenu);
    tray.setToolTip(`WFH Status: ${initialStatus}`);
    log.info("[Tray] Tray icon created successfully.");
  } catch (error) {
    log.error("[Tray] Failed to create tray icon:", error);
  }
}

export function updateTrayStatus(status: WorkStatus): void {
  if (tray) {
    log.info(`[Tray] Updating tray status to: ${status}`);
    const icon = nativeImage.createFromPath(getIconPath(status));
    tray.setImage(icon);
    tray.setToolTip(`WFH Status: ${status}`);

    const newContextMenu = buildContextMenu(status);
    tray.setContextMenu(newContextMenu);
    log.info("[Tray] Tray status updated.");
  } else {
    log.warn("[Tray] Attempted to update tray, but tray object is null.");
  }
}
