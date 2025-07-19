import settings from "electron-settings";
import { DeviceInfo } from "../shared/types";
import { randomUUID } from "crypto";

// Mock dla SerialPort - tymczasowe rozwiązanie
interface MockSerialPort {
  write: (data: string, callback?: (error?: Error) => void) => void;
}

class MockSerialPortImpl implements MockSerialPort {
  write(data: string, callback?: (error?: Error) => void) {
    console.log("Mock SerialPort write:", data);
    if (callback) callback();
  }
}

/**
 * Manages device-related logic, including pairing, storage, and communication.
 * It uses electron-settings to persist device information.
 * Currently uses mock SerialPort implementation to avoid native compilation issues.
 */
class DeviceManager {
  constructor() {
    // Ensure default values are set on initialization
    if (!settings.hasSync("devices")) {
      settings.setSync("devices", []);
    }
  }

  /**
   * Retrieves all paired devices from settings.
   * @returns {Promise<DeviceInfo[]>} An array of device information objects.
   */
  public async getDevices(): Promise<DeviceInfo[]> {
    const devices = await settings.get("devices");
    return (devices as unknown as DeviceInfo[]) || [];
  }

  /**
   * Adds a new device to the settings.
   * @param {Omit<DeviceInfo, 'id' | 'connected'>} device - The device info without an ID or connected status.
   * @returns {Promise<DeviceInfo>} The full device info object with a new ID.
   */
  public async addDevice(
    device: Omit<DeviceInfo, "id" | "connected">
  ): Promise<DeviceInfo> {
    const currentDevices = await this.getDevices();
    const newDevice: DeviceInfo = {
      ...device,
      id: randomUUID(),
      connected: false, // Initial status is always disconnected
    };
    await settings.set("devices", [...currentDevices, newDevice] as any);
    return newDevice;
  }

  /**
   * Removes a device from the settings by its ID.
   * @param {string} deviceId - The ID of the device to remove.
   */
  public async removeDevice(deviceId: string): Promise<void> {
    const currentDevices = await this.getDevices();
    const updatedDevices = currentDevices.filter((d) => d.id !== deviceId);
    await settings.set("devices", updatedDevices as any);
  }

  /**
   * Transfers WiFi credentials to a device over a serial port.
   * @param {MockSerialPort} port - The mock serial port of the device.
   * @param {string} ssid - The WiFi SSID.
   * @param {string} password - The WiFi password.
   * @returns {Promise<boolean>} True if the data was sent successfully, false otherwise.
   */
  public async transferWifiCredentials(
    port: MockSerialPort,
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
   * @param {MockSerialPort} port - The mock serial port of the device.
   * @param {'red' | 'green' | 'blue'} color - The color to set.
   * @returns {Promise<boolean>} True if the command was sent successfully.
   */
  public async setDeviceColor(
    port: MockSerialPort,
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
   * @returns {Promise<MockSerialPort | null>} A MockSerialPort instance if found, otherwise null.
   */
  public async detectUSBDevice(): Promise<MockSerialPort | null> {
    try {
      console.log("Mock USB device detection - returning mock port");
      // Simulate device detection
      return new MockSerialPortImpl();
    } catch (error) {
      console.error("Failed to detect USB devices:", error);
      return null;
    }
  }
}

export const deviceManager = new DeviceManager();
