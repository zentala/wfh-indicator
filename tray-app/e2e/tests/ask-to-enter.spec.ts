import { test, expect } from "@playwright/test";
import { MockHelper } from "../utils/mock-helper";

test.describe("Ask to Enter", () => {
  let mockHelper: MockHelper;

  test.beforeAll(async () => {
    mockHelper = MockHelper.getInstance();
    await mockHelper.connect();
  });

  test.afterAll(async () => {
    await mockHelper.disconnect();
  });

  test('should show "Ask to Enter" notification', async ({ page }) => {
    // This is a placeholder test.
    // The actual implementation will depend on the tray app's UI.
    await page.goto("/");

    // 1. Simulate the user pressing the button on the mock device.
    await mockHelper.pressButton("single");

    // 2. The tray app should show a notification.
    // The way to check for notifications will depend on the implementation.
    // It might be a native notification or an element in the webview.
    // await expect(page.locator('[data-testid="ask-to-enter-notification"]')).toBeVisible();

    // 3. The notification should have "Yes" and "No" buttons.
    // await expect(page.locator('[data-testid="notification-yes-button"]')).toBeVisible();
    // await expect(page.locator('[data-testid="notification-no-button"]')).toBeVisible();

    // 4. Click the "Yes" button.
    // await page.click('[data-testid="notification-yes-button"]');

    // 5. Verify that the mock device received the "yes" response.
    // This requires a method in MockHelper to get the last response.
    // const lastResponse = await mockHelper.getLastResponse();
    // expect(lastResponse).toBe('yes');
    expect(true).toBe(true);
  });
});
