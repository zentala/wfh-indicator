/**
 * WFH Indicator Device Mock
 *
 * Simulates ESP32 + WS2812B LED ring device for testing
 */

import { LEDController } from '../components/ledController';
import { WiFiManager } from '../components/wifiManager';
import { ButtonHandler } from '../components/buttonHandler';
import { TestController } from '../components/testController';
import { Logger } from '../utils/logger';
import {
  DeviceType,
  DeviceConfig,
  DeviceStatus,
  WorkStatus,
  getWorkStatusInfo,
  getDeviceCapabilities
} from '@wfh-indicator/domain';

/**
 * Main device mock class
 */
export class DeviceMock {
  private ledController: LEDController;
  private wifiManager: WiFiManager;
  private buttonHandler: ButtonHandler;
  private testController?: TestController;
  private logger: Logger;
  private config: DeviceConfig;
  private status: DeviceStatus;
  private isRunning: boolean = false;

  constructor(options: Partial<DeviceConfig> = {}) {
    this.config = {
      deviceId: options.deviceId || `mock-device-${Date.now()}`,
      deviceType: DeviceType.LED_RING,
      port: options.port || 8080,
      serialPort: options.serialPort || '/dev/ttyUSB0',
      testMode: options.testMode || false,
      debug: options.debug || false,
      batteryLevel: options.batteryLevel || 100,
      charging: options.charging || false,
      ledConfig: options.ledConfig,
      buttonConfig: options.buttonConfig,
      ...options
    };

    this.logger = new Logger(this.config.debug);
    this.status = this.createInitialStatus();

    // Initialize components
    this.ledController = new LEDController(this.config.ledConfig);
    this.wifiManager = new WiFiManager(this.config.port, this.logger);
    this.buttonHandler = new ButtonHandler(this.config.buttonConfig, this.logger);

    // Setup test controller if in test mode
    if (this.config.testMode) {
      this.testController = new TestController(this);
    }

    this.logger.info('DeviceMock initialized', { config: this.config });
  }

  /**
   * Start the device mock
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('DeviceMock is already running');
      return;
    }

    try {
      this.logger.info('Starting DeviceMock...');

      // Start WiFi manager
      await this.wifiManager.start();
      this.logger.info('WiFi manager started');

      // Setup button handler callbacks
      this.setupButtonCallbacks();

      // Setup WiFi message handlers
      this.setupWiFiMessageHandlers();

      // Start battery monitoring
      this.startBatteryMonitoring();

      this.isRunning = true;
      this.logger.info('DeviceMock started successfully');
    } catch (error) {
      this.logger.error('Failed to start DeviceMock', error);
      throw error;
    }
  }

  /**
   * Stop the device mock
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('DeviceMock is not running');
      return;
    }

    try {
      this.logger.info('Stopping DeviceMock...');

      // Stop WiFi manager
      await this.wifiManager.stop();

      // Stop battery monitoring
      this.stopBatteryMonitoring();

      this.isRunning = false;
      this.logger.info('DeviceMock stopped successfully');
    } catch (error) {
      this.logger.error('Failed to stop DeviceMock', error);
      throw error;
    }
  }

  /**
   * Get current device status
   */
  getStatus(): DeviceStatus {
    return {
      ...this.status,
      lastActivity: new Date(),
      batteryLevel: this.status.batteryLevel,
      charging: this.status.charging
    };
  }

  /**
   * Get test controller (only available in test mode)
   */
  getTestController(): TestController | undefined {
    return this.testController;
  }

  /**
   * Get LED controller
   */
  getLEDController(): LEDController {
    return this.ledController;
  }

  /**
   * Get WiFi manager
   */
  getWiFiManager(): WiFiManager {
    return this.wifiManager;
  }

  /**
   * Get button handler
   */
  getButtonHandler(): ButtonHandler {
    return this.buttonHandler;
  }

  /**
   * Create initial device status
   */
  private createInitialStatus(): DeviceStatus {
    const capabilities = getDeviceCapabilities(this.config.deviceType);

    return {
      deviceId: this.config.deviceId,
      deviceType: this.config.deviceType,
      connected: false,
      batteryLevel: this.config.batteryLevel || 100,
      charging: this.config.charging || false,
      lastActivity: new Date(),
      firmwareVersion: '1.0.0',
      hardwareVersion: '1.0.0',
      capabilities
    };
  }

  /**
   * Setup button handler callbacks
   */
  private setupButtonCallbacks(): void {
    this.buttonHandler.setPressCallback(async (type: string) => {
      this.logger.info('Button pressed', { type });

      switch (type) {
        case 'single':
          await this.handleSinglePress();
          break;
        case 'double':
          await this.handleDoublePress();
          break;
        case 'long':
          await this.handleLongPress();
          break;
        default:
          this.logger.warn('Unknown button press type', { type });
      }
    });
  }

  /**
   * Setup WiFi message handlers
   */
  private setupWiFiMessageHandlers(): void {
    this.wifiManager.onMessage(async (message) => {
      this.logger.debug('Received message', { message });

      if (message.type === 'status_update') {
        await this.handleStatusUpdate(message);
      } else if (message.type === 'ask_to_enter_response') {
        await this.handleAskToEnterResponse(message);
      }
    });
  }

  /**
   * Handle status update from tray app
   */
  private async handleStatusUpdate(message: any): Promise<void> {
    try {
      const status = message.status as WorkStatus;
      const statusInfo = getWorkStatusInfo(status);

      this.logger.info('Status update received', { status, statusInfo });

      // Update LED color
      this.ledController.setColor(statusInfo.color);

      // Update device status
      this.status.connected = true;
      this.status.lastActivity = new Date();

      this.logger.info('Status update processed', { status });
    } catch (error) {
      this.logger.error('Failed to handle status update', error);
    }
  }

  /**
   * Handle ask to enter response from tray app
   */
  private async handleAskToEnterResponse(message: any): Promise<void> {
    try {
      const response = message.response;
      this.logger.info('Ask to enter response received', { response });

      // Visual feedback based on response
      switch (response) {
        case 'yes':
          this.ledController.setColor('#00FF00'); // Green
          break;
        case 'no':
          this.ledController.setColor('#FF0000'); // Red
          break;
        case 'if_urgent':
          this.ledController.setColor('#FFD700'); // Yellow
          break;
      }

      // Reset to current status after 2 seconds
      setTimeout(() => {
        // TODO: Reset to current status
      }, 2000);

    } catch (error) {
      this.logger.error('Failed to handle ask to enter response', error);
    }
  }

  /**
   * Handle single button press
   */
  private async handleSinglePress(): Promise<void> {
    this.logger.info('Handling single button press');

    // Send ask to enter request
    const message = {
      type: 'ask_to_enter',
      deviceId: this.config.deviceId,
      urgency: 'normal',
      timestamp: Date.now()
    };

    await this.wifiManager.sendMessage(message);
    this.logger.info('Ask to enter request sent');
  }

  /**
   * Handle double button press
   */
  private async handleDoublePress(): Promise<void> {
    this.logger.info('Handling double button press');

    // Toggle LED brightness
    const currentBrightness = this.ledController.getStatus().brightness;
    const newBrightness = currentBrightness > 50 ? 30 : 80;
    this.ledController.setBrightness(newBrightness);

    this.logger.info('LED brightness toggled', { newBrightness });
  }

  /**
   * Handle long button press
   */
  private async handleLongPress(): Promise<void> {
    this.logger.info('Handling long button press');

    // Reset device (simulate restart)
    this.ledController.setColor('#808080'); // Gray
    this.status.connected = false;

    // Reconnect after 3 seconds
    setTimeout(async () => {
      this.status.connected = true;
      this.logger.info('Device reset completed');
    }, 3000);

    this.logger.info('Device reset initiated');
  }

  /**
   * Start battery monitoring
   */
  private startBatteryMonitoring(): void {
    const interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(interval);
        return;
      }

      // Simulate battery drain
      if (!this.status.charging && this.status.batteryLevel > 0) {
        this.status.batteryLevel = Math.max(0, this.status.batteryLevel - 0.1);
      }

      // Send battery report
      const message = {
        type: 'battery_report',
        deviceId: this.config.deviceId,
        level: this.status.batteryLevel,
        charging: this.status.charging,
        timestamp: Date.now()
      };

      this.wifiManager.sendMessage(message);
    }, 300000); // Every 5 minutes

    // Store interval for cleanup
    (this as any).batteryInterval = interval;
  }

  /**
   * Stop battery monitoring
   */
  private stopBatteryMonitoring(): void {
    if ((this as any).batteryInterval) {
      clearInterval((this as any).batteryInterval);
      (this as any).batteryInterval = null;
    }
  }
}
