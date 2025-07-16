import { _electron, test, expect, ElectronApplication } from "@playwright/test";
import path from "path";

test("App launches successfully in dev mode", async () => {
  // Launch the electron app in dev mode.
  const electronApp = await _electron.launch({
    args: [path.join(__dirname, "..")],
  });

  // App should launch without errors.
  expect(electronApp).toBeDefined();

  // Check that the main process is ready.
  const isReady = await electronApp.evaluate(async ({ app }) => app.isReady());
  expect(isReady).toBeTruthy();

  // Exit the app.
  await electronApp.close();
});
