import { test, expect } from "@playwright/test";
import { join } from "path";
import { _electron as electron } from "@playwright/test";
import { statusColors } from "../src/shared/statusColors";

async function getTray(app: electron.ElectronApplication) {
  // In a real app, you might need a more robust way to get the tray instance.
  // For this test, we assume it's the first and only tray.
  const trayHandle = await app.evaluateHandle(() => {
    const { Tray } = require("electron");
    return Tray.getAllTrays()[0];
  });
  return trayHandle;
}

test("Changing status from tray menu should update tray icon and tooltip", async () => {
  const electronApp = await electron.launch({ args: ["."] });

  try {
    const tray = await getTray(electronApp);

    // 1. Check initial state (OFFLINE)
    const initialTooltip = await tray.evaluate((t) => t.getToolTip());
    expect(initialTooltip).toBe(statusColors.OFFLINE.tooltip);

    // 2. Click the "AVAILABLE" menu item
    await electronApp.evaluate(async () => {
      const { Tray } = require("electron");
      const trayInstance = Tray.getAllTrays()[0];
      if (!trayInstance) return;

      const contextMenu = trayInstance.getMenu();
      if (!contextMenu) return;

      const availableItem = contextMenu.items.find((item) =>
        item.label.includes("AVAILABLE")
      );

      if (availableItem) {
        availableItem.click();
      }
    });

    // 3. Verify the tooltip has updated by polling
    await expect
      .poll(
        async () => {
          const currentTray = await getTray(electronApp);
          return await currentTray.evaluate((t) => t.getToolTip());
        },
        {
          timeout: 2000,
        }
      )
      .toBe(statusColors.AVAILABLE.tooltip);
  } finally {
    await electronApp.close();
  }
});
