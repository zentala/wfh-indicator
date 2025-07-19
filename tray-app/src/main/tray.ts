import {
  app,
  Menu,
  Tray,
  nativeImage,
  MenuItemConstructorOptions,
} from "electron";
import path from "path";
import { WorkStatus, DeviceInfo } from "../shared/types";
import { statusColors } from "../shared/statusColors";
import { stateManager } from "./stateManager";
import { createPairingWindow, createSettingsWindow } from "./ipcHandlers";
import { deviceManager } from "./deviceManager";

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
async function updateTray(status: WorkStatus): Promise<void> {
  if (!tray) return;

  const { tooltip } = statusColors[status];
  const icon = createIcon(status);

  tray.setImage(icon);
  tray.setToolTip(tooltip);

  // Get devices with warnings and build context menu
  const lowBatteryDevices = await getDevicesWithWarnings();
  const contextMenu = buildContextMenu(status, lowBatteryDevices);
  tray.setContextMenu(contextMenu);
}

/**
 * Gets devices with battery warnings for tray menu.
 * @returns Promise<DeviceInfo[]> Array of devices with low battery warnings.
 */
async function getDevicesWithWarnings(): Promise<DeviceInfo[]> {
  try {
    const devices = await deviceManager.getDevices();
    return devices.filter((device) => device.battery <= 20);
  } catch (error) {
    console.error("Failed to get devices for tray menu:", error);
    return [];
  }
}

/**
 * Builds the context menu dynamically based on the current status.
 * @param currentStatus The current work status to mark as checked.
 * @param lowBatteryDevices Array of devices with low battery warnings.
 * @returns A Menu object.
 */
function buildContextMenu(
  currentStatus: WorkStatus,
  lowBatteryDevices: DeviceInfo[]
): Menu {
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

  // Build device submenu items
  const deviceSubmenuItems: MenuItemConstructorOptions[] = [
    {
      label: "Pair New Device...",
      click: () => {
        createPairingWindow();
      },
    },
  ];

  // Add separator if there are devices with low battery
  if (lowBatteryDevices.length > 0) {
    deviceSubmenuItems.push({ type: "separator" });

    // Add warning header
    deviceSubmenuItems.push({
      label: "⚠️ Low Battery Warnings",
      enabled: false,
    });

    // Add each device with low battery
    lowBatteryDevices.forEach((device) => {
      deviceSubmenuItems.push({
        label: `🔋 ${device.name} - ${device.battery}%`,
        enabled: false,
      });
    });

    deviceSubmenuItems.push({ type: "separator" });
  }

  const template: MenuItemConstructorOptions[] = [
    { label: "WFH Indicator", enabled: false },
    { type: "separator" },
    ...statusMenuItems,
    { type: "separator" },
    {
      label: "Devices",
      submenu: deviceSubmenuItems,
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
