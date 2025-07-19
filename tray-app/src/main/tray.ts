import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import { WorkStatus } from "../shared/types";
import { statusColors } from "../renderer/utils/statusColors";
import { stateManager } from "./stateManager";
import { createPairingWindow, createSettingsWindow } from "./ipcHandlers";

let tray: Tray | null = null;

/**
 * Creates the tray icon and subscribes to status changes.
 */
export function createTray(): void {
  // Initial icon creation
  const initialStatus = stateManager.getStatus();
  const icon = createIcon(initialStatus);
  tray = new Tray(icon);

  // Initial state setup
  updateTray(initialStatus);

  // Subscribe to future status changes
  stateManager.on("status-changed", (newStatus: WorkStatus) => {
    updateTray(newStatus);
  });
}

/**
 * Updates the tray icon, tooltip, and context menu based on the current status.
 * @param status The current work status.
 */
function updateTray(status: WorkStatus): void {
  if (!tray) return;

  const { tooltip } = statusColors[status];
  const icon = createIcon(status);

  tray.setImage(icon);
  tray.setToolTip(tooltip);
  tray.setContextMenu(buildContextMenu(status));
}

/**
 * Builds the context menu dynamically based on the current status.
 * @param currentStatus The current work status to mark as checked.
 * @returns A Menu object.
 */
function buildContextMenu(currentStatus: WorkStatus): Menu {
  const statusMenuItems: MenuItemConstructorOptions[] = (
    Object.keys(statusColors) as WorkStatus[]
  ).map((status) => ({
    label: `${statusColors[status].emoji} ${status.replace(/_/g, " ")}`,
    type: "radio",
    checked: currentStatus === status,
    click: () => {
      stateManager.setStatus(status);
    },
  }));

  const template: MenuItemConstructorOptions[] = [
    { label: "WFH Indicator", enabled: false },
    { type: "separator" },
    ...statusMenuItems,
    { type: "separator" },
    {
      label: "Devices",
      submenu: [
        {
          label: "Pair New Device...",
          click: () => {
            createPairingWindow(); // Direct function call
          },
        },
        { type: "separator" },
        // Device list will be populated here later
      ],
    },
    { type: "separator" },
    {
      label: "Settings",
      click: () => {
        createSettingsWindow();
      },
    },
    { label: "Quit", click: () => app.quit() },
  ];

  return Menu.buildFromTemplate(template);
}

/**
 * Creates a native image for the tray icon.
 * @param status The work status to get the color from.
 * @returns A NativeImage object.
 */
function createIcon(status: WorkStatus): Electron.NativeImage {
  const { color } = statusColors[status];
  // Using PNGs now as they are more reliable across platforms than SVG for tray icons.
  const iconPath = path.join(
    __dirname,
    `../../../public/icons/circle-${color}.png`
  );
  return nativeImage.createFromPath(iconPath);
}
