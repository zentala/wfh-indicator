import Store from "electron-store";
import { DeviceInfo, ScheduleRule } from "../shared/types";
import { randomUUID } from "crypto";
import { SerialPort } from "serialport";
import type { PortInfo } from "serialport";

type StoreSchema = {
  devices: DeviceInfo[];
  scheduleRules: ScheduleRule[];
};

/**
 * Manages device-related logic, including pairing, storage, and communication.
 * It uses electron-store to persist device information.
 */
class DeviceManager {
  private store: Store<StoreSchema>;

  constructor() {
    this.store = new Store<StoreSchema>({
      defaults: {
        devices: [],
        scheduleRules: [],
      },
      // Migrations can be added here in the future
    });
  }

  /**
   * Retrieves all paired devices from the store.
   * @returns {DeviceInfo[]} An array of device information objects.
   */
  public getDevices(): DeviceInfo[] {
    return this.store.get("devices");
  }

  /**
   * Adds a new device to the store.
   * @param {Omit<DeviceInfo, 'id' | 'connected'>} device - The device info without an ID or connected status.
   * @returns {DeviceInfo} The full device info object with a new ID.
   */
  public addDevice(device: Omit<DeviceInfo, "id" | "connected">): DeviceInfo {
    const currentDevices = this.getDevices();
    const newDevice: DeviceInfo = {
      ...device,
      id: randomUUID(),
      connected: false, // Initial status is always disconnected
    };
    this.store.set("devices", [...currentDevices, newDevice]);
    return newDevice;
  }

  /**
   * Removes a device from the store by its ID.
   * @param {string} deviceId - The ID of the device to remove.
   */
  public removeDevice(deviceId: string): void {
    const currentDevices = this.getDevices();
    const updatedDevices = currentDevices.filter((d) => d.id !== deviceId);
    this.store.set("devices", updatedDevices);
  }

  /**
   * Detects a connected USB device by searching for a specific manufacturer.
   * @returns {Promise<SerialPort | null>} A SerialPort instance if found, otherwise null.
   */
  public async detectUSBDevice(): Promise<SerialPort | null> {
    try {
      const ports = await SerialPort.list();
      const devicePortInfo = ports.find(
        (p: PortInfo) => p.manufacturer && p.manufacturer.includes("ESP32") // Example manufacturer
      );

      if (!devicePortInfo) {
        console.log("No matching device found.");
        return null;
      }

      const port = new SerialPort({
        path: devicePortInfo.path,
        baudRate: 115200,
      });
      return port;
    } catch (error) {
      console.error("Failed to detect USB devices:", error);
      return null;
    }
  }
}

export const deviceManager = new DeviceManager();
