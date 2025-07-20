import { EventEmitter } from "events";
import settings from "electron-settings";
import {
  DeviceStatus,
  DeviceType,
  WebSocketMessage,
  AskToEnterRequestMessage,
  BatteryReportMessage,
  DeviceStatusMessage,
  HandshakeMessage,
} from "@wfh-indicator/domain";
import { randomUUID } from "crypto";
import { SerialPort } from "serialport";
import log from "electron-log";
import { TrayDeviceInfo, ScheduleRule } from "../types/device";

/**
 * Manages device-related logic, including pairing, storage, and communication.
 * It uses electron-settings to persist device information.
 * Uses real SerialPort implementation for hardware communication.
 */
class DeviceManager extends EventEmitter {
  private devices: TrayDeviceInfo[] = [];

  constructor() {
    super();
    this.loadDevices();
  }

  private async loadDevices(): Promise<void> {
    try {
      if (await settings.has("devices")) {
        this.devices = (await settings.get(
          "devices"
        )) as unknown as TrayDeviceInfo[];
      } else {
        await settings.set("devices", []);
        this.devices = [];
      }
      log.info("Devices loaded");
    } catch (error) {
      log.error("Failed to load devices:", error);
      this.devices = [];
    }
  }

  /**
   * Retrieves all paired devices from settings.
   * @returns {Promise<TrayDeviceInfo[]>} An array of device information objects.
   */
  public async getDevices(): Promise<TrayDeviceInfo[]> {
    return this.devices;
  }

  /**
   * Adds a new device to the settings.
   * @param {Omit<TrayDeviceInfo, 'deviceId' | 'connected'>} device - The device info without an ID or connected status.
   * @returns {Promise<TrayDeviceInfo>} The full device info object with a new ID.
   */
  public async addDevice(
    device: Omit<TrayDeviceInfo, "deviceId" | "connected">
  ): Promise<TrayDeviceInfo> {
    const newDevice: TrayDeviceInfo = {
      ...device,
      deviceId: randomUUID(),
      connected: false, // Initial status is always disconnected
    };
    this.devices.push(newDevice);
    await settings.set("devices", this.devices as any);
    return newDevice;
  }

  /**
   * Removes a device from the settings by its ID.
   * @param {string} deviceId - The ID of the device to remove.
   */
  public async removeDevice(deviceId: string): Promise<void> {
    this.devices = this.devices.filter((d) => d.deviceId !== deviceId);
    await settings.set("devices", this.devices as any);
  }

  /**
   * Transfers WiFi credentials to a device over a serial port.
   * @param {SerialPort} port - The serial port of the device.
   * @param {string} ssid - The WiFi SSID.
   * @param {string} password - The WiFi password.
   * @returns {Promise<boolean>} True if the data was sent successfully, false otherwise.
   */
  public async transferWifiCredentials(
    port: SerialPort,
    ssid: string,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const credentials = JSON.stringify({ ssid, password });
      port.write(credentials, (err) => {
        if (err) {
          console.error("Failed to write to serial port:", err);
          return resolve(false);
        }
        console.log("WiFi credentials sent successfully.");
        resolve(true);
      });
    });
  }

  /**
   * Waits for the device to connect to WiFi and tests the connection.
   * This is a simplified version using a timeout.
   * @returns {Promise<boolean>} True if the device is considered connected.
   */
  public async testDeviceConnection(): Promise<boolean> {
    console.log("Waiting for device to connect to WiFi...");
    // In a real scenario, you might ping the device or wait for a WebSocket connection.
    // Here, we'll just simulate a delay.
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Device connection test successful (simulated).");
        resolve(true);
      }, 5000); // 5-second delay to allow the device to connect
    });
  }

  /**
   * Sends a command to the device to set its color.
   * @param {SerialPort} port - The serial port of the device.
   * @param {'red' | 'green' | 'blue'} color - The color to set.
   * @returns {Promise<boolean>} True if the command was sent successfully.
   */
  public async setDeviceColor(
    port: SerialPort,
    color: "red" | "green" | "blue"
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const command = JSON.stringify({ color });
      port.write(command, (err) => {
        if (err) {
          console.error("Failed to write color command to serial port:", err);
          return resolve(false);
        }
        console.log(`Set color command ('${color}') sent successfully.`);
        resolve(true);
      });
    });
  }

  /**
   * Detects a connected USB device by searching for a specific manufacturer.
   * @returns {Promise<SerialPort | null>} A SerialPort instance if found, otherwise null.
   */
  public async detectUSBDevice(): Promise<SerialPort | null> {
    try {
      console.log("Detecting USB devices...");

      // List all available ports
      const ports = await SerialPort.list();
      console.log("Available ports:", ports);

      // Look for ESP32 device (common manufacturer IDs)
      const esp32Port = ports.find(
        (port) =>
          port.manufacturer?.toLowerCase().includes("silicon labs") ||
          port.manufacturer?.toLowerCase().includes("espressif") ||
          port.manufacturer?.toLowerCase().includes("esp32") ||
          port.vendorId === "10c4" || // Silicon Labs CP210x
          port.vendorId === "1a86" // CH340
      );

      if (esp32Port) {
        console.log("ESP32 device found:", esp32Port.path);
        return new SerialPort({
          path: esp32Port.path,
          baudRate: 115200,
          autoOpen: false,
        });
      }

      console.log("No ESP32 device found");
      return null;
    } catch (error) {
      console.error("Failed to detect USB devices:", error);
      return null;
    }
  }

  /**
   * Opens a serial port connection.
   * @param {SerialPort} port - The serial port to open.
   * @returns {Promise<boolean>} True if the port was opened successfully.
   */
  public async openSerialPort(port: SerialPort): Promise<boolean> {
    return new Promise((resolve) => {
      port.open((err) => {
        if (err) {
          console.error("Failed to open serial port:", err);
          resolve(false);
        } else {
          console.log("Serial port opened successfully");
          resolve(true);
        }
      });
    });
  }

  /**
   * Closes a serial port connection.
   * @param {SerialPort} port - The serial port to close.
   */
  public async closeSerialPort(port: SerialPort): Promise<void> {
    return new Promise((resolve) => {
      port.close((err) => {
        if (err) {
          console.error("Failed to close serial port:", err);
        } else {
          console.log("Serial port closed successfully");
        }
        resolve();
      });
    });
  }

  // ===== SCHEDULE RULES MANAGEMENT =====

  /**
   * Retrieves all schedule rules from settings.
   * @returns {Promise<ScheduleRule[]>} An array of schedule rule objects.
   */
  public async getScheduleRules(): Promise<ScheduleRule[]> {
    const rules = await settings.get("scheduleRules");
    return (rules as unknown as ScheduleRule[]) || [];
  }

  /**
   * Adds a new schedule rule to the settings.
   * @param {Omit<ScheduleRule, 'id'>} rule - The schedule rule without an ID.
   * @returns {Promise<ScheduleRule>} The full schedule rule object with a new ID.
   */
  public async addScheduleRule(
    rule: Omit<ScheduleRule, "id">
  ): Promise<ScheduleRule> {
    const currentRules = await this.getScheduleRules();
    const newRule: ScheduleRule = {
      ...rule,
      id: randomUUID(),
    };
    await settings.set("scheduleRules", [...currentRules, newRule] as any);
    this.emit("schedule-rules-changed");
    return newRule;
  }

  /**
   * Updates an existing schedule rule by its ID.
   * @param {string} id - The ID of the rule to update.
   * @param {Partial<ScheduleRule>} updates - The partial updates to apply.
   * @returns {Promise<ScheduleRule>} The updated schedule rule object.
   */
  public async updateScheduleRule(
    id: string,
    updates: Partial<ScheduleRule>
  ): Promise<ScheduleRule> {
    const currentRules = await this.getScheduleRules();
    const ruleIndex = currentRules.findIndex((rule) => rule.id === id);

    if (ruleIndex === -1) {
      throw new Error(`Schedule rule with ID ${id} not found`);
    }

    const updatedRule = { ...currentRules[ruleIndex], ...updates };
    currentRules[ruleIndex] = updatedRule;

    await settings.set("scheduleRules", currentRules as any);
    this.emit("schedule-rules-changed");
    return updatedRule;
  }

  /**
   * Removes a schedule rule from the settings by its ID.
   * @param {string} id - The ID of the rule to remove.
   */
  public async deleteScheduleRule(id: string): Promise<void> {
    const currentRules = await this.getScheduleRules();
    const updatedRules = currentRules.filter((rule) => rule.id !== id);
    await settings.set("scheduleRules", updatedRules as any);
    this.emit("schedule-rules-changed");
  }

  /**
   * Validates a schedule rule to ensure it has valid data.
   * @param {ScheduleRule} rule - The rule to validate.
   * @returns {boolean} True if the rule is valid, false otherwise.
   */
  public validateScheduleRule(rule: ScheduleRule): boolean {
    // Check if days array is not empty
    if (!rule.days || rule.days.length === 0) {
      return false;
    }

    // Check if days are valid (1-7)
    if (!rule.days.every((day) => day >= 1 && day <= 7)) {
      return false;
    }

    // Check if time format is valid (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(rule.startTime) || !timeRegex.test(rule.endTime)) {
      return false;
    }

    // Check if status is valid
    const validStatuses = [
      "ON_CALL",
      "VIDEO_CALL",
      "FOCUSED",
      "AVAILABLE",
      "AWAY",
    ];
    if (!validStatuses.includes(rule.status)) {
      return false;
    }

    return true;
  }
}

export const deviceManager = new DeviceManager();
