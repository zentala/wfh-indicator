declare module "electron-updater" {
  export const autoUpdater: {
    checkForUpdatesAndNotify(): void;
    quitAndInstall(): void;
    on(event: string, callback: (data?: any) => void): void;
  };
}
