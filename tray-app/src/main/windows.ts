import { app, BrowserWindow } from "electron";
import path from "path";

// These constants are defined by the Vite plugin
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;
declare const SETTINGS_WINDOW_VITE_DEV_SERVER_URL: string;
declare const SETTINGS_WINDOW_VITE_NAME: string;
declare const PAIRING_WINDOW_VITE_DEV_SERVER_URL: string;
declare const PAIRING_WINDOW_VITE_NAME: string;

let settingsWindow: BrowserWindow | null = null;
let pairingWindow: BrowserWindow | null = null;

const VITE_URLS = {
  main: MAIN_WINDOW_VITE_DEV_SERVER_URL,
  settings: SETTINGS_WINDOW_VITE_DEV_SERVER_URL,
  pairing: PAIRING_WINDOW_VITE_DEV_SERVER_URL,
};

const VITE_NAMES = {
  main: MAIN_WINDOW_VITE_NAME,
  settings: SETTINGS_WINDOW_VITE_NAME,
  pairing: PAIRING_WINDOW_VITE_NAME,
};

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

  // Open dev tools automatically for debugging
  win.webContents.openDevTools();

  // This logic is simplified to be more direct and correct.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    // In dev mode, load the specific HTML file from the dev server URL
    win.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/${name}.html`);
  } else {
    // In production, load the specific HTML file from the built assets
    win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/${name}.html`)
    );
  }

  return win;
}

export function openSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }
  settingsWindow = createWindow("settings", 600, 500);

  settingsWindow.on("close", (event) => {
    event.preventDefault();
    settingsWindow?.hide();
  });
}

export function openPairingWindow(): void {
  if (pairingWindow && !pairingWindow.isDestroyed()) {
    pairingWindow.focus();
    return;
  }
  pairingWindow = createWindow("pairing", 400, 600);
  pairingWindow.on("closed", () => (pairingWindow = null));
}
