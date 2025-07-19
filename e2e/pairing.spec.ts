import { test, expect, _electron as electron } from "@playwright/test";
import { Page, ElectronApplication } from "playwright";

test.describe("Pairing process end-to-end flow", () => {
  let electronApp: ElectronApplication;
  let pairingWindow: Page;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ["."] });
    const appWindow = await electronApp.firstWindow();

    await appWindow.evaluate(() =>
      (window as any).ipcRenderer.send("open-pairing-window")
    );

    pairingWindow = await electronApp.waitForEvent("window");

    // Mock IPC responses
    await electronApp.evaluate(async () => {
      const { ipcMain } = require("electron");
      ipcMain.handle("pair-device", async (event) => {
        const webContents = event.sender;
        webContents.send("pairing-status", {
          step: "detecting",
          status: "success",
        });
        await new Promise((r) => setTimeout(r, 50));
        webContents.send("pairing-status", {
          step: "transferring",
          status: "success",
        });
        await new Promise((r) => setTimeout(r, 50));
        webContents.send("pairing-status", {
          step: "connecting",
          status: "success",
        });
        await new Promise((r) => setTimeout(r, 50));
        webContents.send("confirm-color-request");
      });
      ipcMain.on("confirm-color-response", (event, confirmed) => {
        event.sender.send("pairing-status", {
          step: "done",
          status: "success",
        });
      });
    });
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test("should complete the pairing flow successfully", async () => {
    await expect(pairingWindow.locator("h2")).toHaveText("Pair New Device");

    await pairingWindow
      .locator('input[aria-label="WiFi SSID"]')
      .fill("test-ssid");
    await pairingWindow
      .locator('input[aria-label="WiFi Password"]')
      .fill("test-password");
    await pairingWindow.locator('button:has-text("Start Pairing")').click();

    await expect(
      pairingWindow.locator('p:has-text("Current step: connecting...")')
    ).toBeVisible();

    await expect(
      pairingWindow.locator('h3:has-text("Confirm Color Change")')
    ).toBeVisible();
    await pairingWindow.locator('button:has-text("Yes")').click();

    await expect(
      pairingWindow.locator('h3:has-text("Device Paired Successfully!")')
    ).toBeVisible();
  });
});
