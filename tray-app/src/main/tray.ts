import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import {
  WorkStatus,
  WORK_STATUS_EMOJIS,
} from "@wfh-indicator/domain/dist/types/workStatus";
import { stateManager } from "./stateManager";
import { openSettingsWindow, openPairingWindow } from "./windows";

let tray: Tray | null = null;

const getIconPath = (status: WorkStatus = WorkStatus.AWAY): string => {
  const iconName = `circle-${status.toLowerCase()}.png`;
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "renderer", iconName);
  }
  return path.join(__dirname, "../../public/icons", iconName);
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
        app.quit();
      },
    },
  ];

  return Menu.buildFromTemplate(template);
};

export function createTray(initialStatus: WorkStatus): void {
  const icon = nativeImage.createFromPath(getIconPath(initialStatus));
  tray = new Tray(icon);

  const contextMenu = buildContextMenu(initialStatus);
  tray.setContextMenu(contextMenu);
  tray.setToolTip(`WFH Status: ${initialStatus}`);
}

export function updateTrayStatus(status: WorkStatus): void {
  if (tray) {
    const icon = nativeImage.createFromPath(getIconPath(status));
    tray.setImage(icon);
    tray.setToolTip(`WFH Status: ${status}`);

    const newContextMenu = buildContextMenu(status);
    tray.setContextMenu(newContextMenu);
  }
}
