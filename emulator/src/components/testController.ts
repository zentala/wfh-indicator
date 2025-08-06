/**
 * Test Controller - Provides test interface for device mock
 */

import { DeviceMock } from "../main/deviceMock";
import { Logger } from "../utils/logger";
import {
  AskToEnterRequestMessage,
  BatteryReportMessage,
  WebSocketMessage,
  ButtonPressType,
} from "@wfh-indicator/domain";

/**
 * Test Controller class
 */
export class TestController {
  private deviceMock: DeviceMock;
  private logger: Logger;
  private lastResponse?: "yes" | "no" | "if_urgent";

  constructor(deviceMock: DeviceMock) {
    this.deviceMock = deviceMock;
    this.logger = new Logger(true); // Always debug mode for tests
  }

  /**
   * Simulate button press
   */
  async pressButton(type: "single" | "long" | "double"): Promise<void> {
    this.logger.info("Test: Simulating button press", { type });

    const buttonHandler = this.deviceMock.getButtonHandler();

    const pressTypeMap: Record<string, ButtonPressType> = {
      single: ButtonPressType.SINGLE,
      double: ButtonPressType.DOUBLE,
      long: ButtonPressType.LONG,
    };

    buttonHandler.handlePress(pressTypeMap[type]);
  }

  /**
   * Simulate receiving serial data (WiFi credentials)
   */
  async receiveSerialData(data: {
    ssid: string;
    password: string;
    security: "WPA2" | "WPA3" | "OPEN";
  }): Promise<void> {
    this.logger.info("Test: Receiving serial data", { data });

    // Simulate WiFi connection process
    setTimeout(() => {
      this.logger.info("Test: WiFi connection successful");
      // TODO: Update device status
    }, 1000);
  }

  /**
   * Send ask to enter request
   */
  async sendAskToEnterRequest(urgency: "normal" | "urgent"): Promise<void> {
    this.logger.info("Test: Sending ask to enter request", { urgency });

    const message: AskToEnterRequestMessage = {
      type: "ask_to_enter",
      deviceId: "mock-device-1",
      urgency,
      timestamp: Date.now(),
    };

    const wifiManager = this.deviceMock.getWiFiManager();
    wifiManager.sendMessage(message);
  }

  /**
   * Get LED status
   */
  async getLEDStatus(): Promise<{ color: string; brightness: number }> {
    const ledController = this.deviceMock.getLEDController();
    const status = ledController.getStatus();

    return {
      color: status.color,
      brightness: status.brightness,
    };
  }

  /**
   * Get last response to ask to enter request
   */
  async getLastResponse(): Promise<"yes" | "no" | "if_urgent" | undefined> {
    return this.lastResponse;
  }

  /**
   * Set LED color
   */
  async setLEDColor(color: string): Promise<void> {
    this.logger.info("Test: Setting LED color", { color });

    const ledController = this.deviceMock.getLEDController();
    ledController.setColor(color);
  }

  /**
   * Set LED brightness
   */
  async setLEDBrightness(brightness: number): Promise<void> {
    this.logger.info("Test: Setting LED brightness", { brightness });

    const ledController = this.deviceMock.getLEDController();
    ledController.setBrightness(brightness);
  }

  /**
   * Simulate battery level change
   */
  async setBatteryLevel(level: number): Promise<void> {
    this.logger.info("Test: Setting battery level", { level });

    // TODO: Update device status battery level
  }

  /**
   * Simulate charging state change
   */
  async setCharging(charging: boolean): Promise<void> {
    this.logger.info("Test: Setting charging state", { charging });

    // TODO: Update device status charging state
  }

  /**
   * Send battery report
   */
  async sendBatteryReport(level: number, charging: boolean): Promise<void> {
    this.logger.info("Test: Sending battery report", { level, charging });

    const message: BatteryReportMessage = {
      type: "battery_report",
      deviceId: "mock-device-1",
      level,
      charging,
      timestamp: Date.now(),
    };

    const wifiManager = this.deviceMock.getWiFiManager();
    wifiManager.sendMessage(message);
  }

  /**
   * Get device status
   */
  async getDeviceStatus(): Promise<any> {
    return this.deviceMock.getStatus();
  }

  /**
   * Simulate receiving message from tray app
   */
  async receiveMessage(message: WebSocketMessage): Promise<void> {
    this.logger.info("Test: Receiving message", { message });

    const wifiManager = this.deviceMock.getWiFiManager();

    // Simulate message handling
    if (message.type === "ask_to_enter_response") {
      this.lastResponse = (message as any).response;
    }
  }

  /**
   * Reset test state
   */
  async reset(): Promise<void> {
    this.logger.info("Test: Resetting test state");

    this.lastResponse = undefined;

    const buttonHandler = this.deviceMock.getButtonHandler();
    buttonHandler.reset();
  }

  /**
   * Get test configuration
   */
  getTestConfig(): any {
    return {
      deviceId: "mock-device-1",
      deviceType: "led_ring",
      port: 8080,
      testMode: true,
      debug: true,
    };
  }
}
