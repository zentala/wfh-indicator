import { app, BrowserWindow } from "electron";
import path from "path";

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

  const url = app.isPackaged
    ? `file://${path.join(__dirname, `../renderer/main_window/${name}.html`)}`
    : `${process.env.MAIN_WINDOW_VITE_DEV_SERVER_URL}/${name}.html`;

  console.log(`[Windows] Loading window "${name}" from:`, url);
  win.loadURL(url);

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
