/**
 * DeviceMock Unit Tests
 */

import { DeviceMock } from "../../src/main/deviceMock";
import { WorkStatus } from "@wfh-indicator/domain";

describe("DeviceMock", () => {
  let mock: DeviceMock;

  beforeEach(() => {
    mock = new DeviceMock({
      testMode: true,
      debug: false,
    });
  });

  afterEach(async () => {
    if (mock) {
      await mock.stop();
    }
  });

  test("should initialize with default configuration", () => {
    const status = mock.getStatus();

    expect(status.deviceId).toBeDefined();
    expect(status.connected).toBe(false);
    expect(status.batteryLevel).toBe(100);
    expect(status.charging).toBe(false);
  });

  test("should start and stop successfully", async () => {
    await expect(mock.start()).resolves.not.toThrow();
    await expect(mock.stop()).resolves.not.toThrow();
  });

  test("should get LED controller", () => {
    const ledController = mock.getLEDController();
    expect(ledController).toBeDefined();
  });

  test("should get WiFi manager", () => {
    const wifiManager = mock.getWiFiManager();
    expect(wifiManager).toBeDefined();
  });

  test("should get button handler", () => {
    const buttonHandler = mock.getButtonHandler();
    expect(buttonHandler).toBeDefined();
  });

  test("should get test controller in test mode", () => {
    const testController = mock.getTestController();
    expect(testController).toBeDefined();
  });

  test("should handle status updates", async () => {
    await mock.start();

    const ledController = mock.getLEDController();
    const initialColor = ledController.getStatus().color;

    // Simulate status update
    const statusUpdate = {
      type: "status_update",
      status: WorkStatus.AVAILABLE,
      timestamp: Date.now(),
    };

    // This would normally come through WiFi manager
    // For now, just test that LED controller can set color
    ledController.setColor("#00FF00");

    const newColor = ledController.getStatus().color;
    expect(newColor).toBe("#00FF00");
  });
});
