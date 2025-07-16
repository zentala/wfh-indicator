import { app, Menu, Tray, nativeImage } from "electron";
import path from "path";

let tray: Tray | null = null;

/**
 * @description Creates the tray icon and context menu.
 */
export function createTray(): void {
  const iconPath = path.join(
    __dirname,
    "../../../public/icons/circle-gray.svg"
  );
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    { label: "WFH Indicator", enabled: false },
    { type: "separator" },
    {
      label: "Settings",
      click: () => {
        /* To be implemented */
      },
    },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setToolTip("WFH Indicator");
  tray.setContextMenu(contextMenu);
}
