import { app, BrowserWindow } from "electron";
import path from "path";

// These constants are defined by the Vite plugin
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let settingsWindow: BrowserWindow | null = null;
let pairingWindow: BrowserWindow | null = null;

function createWindow(
  name: "settings" | "pairing",
  width: number,
  height: number
): BrowserWindow {
  const windowConfig = {
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  };

  const win = new BrowserWindow(windowConfig);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/${name}.html`);
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/${name}.html`)
    );
  }

  return win;
}

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = createWindow("settings", 600, 500);
  settingsWindow.on("closed", () => (settingsWindow = null));
}

export function openPairingWindow(): void {
  if (pairingWindow && !pairingWindow.isDestroyed()) {
    pairingWindow.focus();
    return;
  }
  pairingWindow = createWindow("pairing", 400, 600);
  pairingWindow.on("closed", () => (pairingWindow = null));
}
