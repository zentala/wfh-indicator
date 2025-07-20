/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { deviceManager } from "./deviceManager";
import settings from "electron-settings";
import { TrayDeviceInfo } from "../types/device";
import { DeviceType } from "@wfh-indicator/domain";

// Mock 'electron-settings'
vi.mock("electron-settings", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    has: vi.fn(),
  },
}));

// Use a factory to mock 'serialport' and avoid ReferenceError
vi.mock("serialport", () => {
  class SerialPortStub {
    path: string;
    options: any;

    constructor(options: { path: string; baudRate: number }) {
      this.path = options.path;
      this.options = options;
    }

    static list = vi.fn();
  }
  return { SerialPort: SerialPortStub };
});

describe("DeviceManager", () => {
  // Dynamically import SerialPort inside the test suite
  let SerialPort: any;

  beforeEach(async () => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (deviceManager as any).devices = [];
    // Import the mocked module
    const serialport = await import("serialport");
    SerialPort = serialport.SerialPort;
  });

  it("should get devices from internal cache", async () => {
    const mockDevices: TrayDeviceInfo[] = [
      {
        deviceId: "1",
        deviceType: DeviceType.LED_RING,
        name: "Test Device",
        connected: false,
        batteryLevel: 100,
        charging: false,
        lastActivity: new Date(),
        capabilities: {
          display: true,
          button: true,
          battery: true,
          askToEnter: true,
          ledPatterns: ["solid"],
          touch: false,
          wifi: true,
          bluetooth: false,
        },
      },
    ];
    (deviceManager as any).devices = mockDevices;

    const devices = await deviceManager.getDevices();

    expect(devices).toEqual(mockDevices);
    expect(settings.get).not.toHaveBeenCalled();
  });

  it("should add a new device and save to settings", async () => {
    const newDevice = {
      deviceType: DeviceType.LED_RING,
      name: "New Device",
      batteryLevel: 80,
      charging: false,
      lastActivity: new Date(),
      capabilities: {
        display: true,
        button: true,
        battery: true,
        askToEnter: true,
        ledPatterns: ["solid"],
        touch: false,
        wifi: true,
        bluetooth: false,
      },
    };

    const addedDevice = await deviceManager.addDevice(newDevice);

    expect(addedDevice.name).toBe(newDevice.name);
    expect(addedDevice.deviceId).toBeDefined();

    const devices = await deviceManager.getDevices();
    expect(devices).toHaveLength(1);
    expect(devices[0]).toEqual(expect.objectContaining(newDevice));

    expect(settings.set).toHaveBeenCalledWith("devices", [addedDevice]);
  });

  it("should remove a device and save to settings", async () => {
    const mockDevices: TrayDeviceInfo[] = [
      {
        deviceId: "1",
        deviceType: DeviceType.LED_RING,
        name: "Device 1",
        connected: false,
        batteryLevel: 100,
        charging: false,
        lastActivity: new Date(),
        capabilities: {
          display: true,
          button: true,
          battery: true,
          askToEnter: true,
          ledPatterns: ["solid"],
          touch: false,
          wifi: true,
          bluetooth: false,
        },
      },
      {
        deviceId: "2",
        deviceType: DeviceType.LED_RING,
        name: "Device 2",
        connected: false,
        batteryLevel: 90,
        charging: false,
        lastActivity: new Date(),
        capabilities: {
          display: true,
          button: true,
          battery: true,
          askToEnter: true,
          ledPatterns: ["solid"],
          touch: false,
          wifi: true,
          bluetooth: false,
        },
      },
    ];
    (deviceManager as any).devices = [...mockDevices];

    await deviceManager.removeDevice("1");

    const devices = await deviceManager.getDevices();
    expect(devices).toHaveLength(1);
    expect(devices[0].deviceId).toBe("2");

    expect(settings.set).toHaveBeenCalledWith("devices", [
      {
        deviceId: "2",
        deviceType: DeviceType.LED_RING,
        name: "Device 2",
        connected: false,
        batteryLevel: 90,
        charging: false,
        lastActivity: new Date(),
        capabilities: {
          display: true,
          button: true,
          battery: true,
          askToEnter: true,
          ledPatterns: ["solid"],
          touch: false,
          wifi: true,
          bluetooth: false,
        },
      },
    ]);
  });

  it("should detect a USB device and return a SerialPort instance", async () => {
    const mockPorts = [{ manufacturer: "espressif", path: "/dev/ttyUSB0" }];
    vi.mocked(SerialPort.list).mockResolvedValue(mockPorts);

    const port = await deviceManager.detectUSBDevice();

    expect(port).toBeInstanceOf(SerialPort);
    expect(port?.path).toBe("/dev/ttyUSB0");
    expect(SerialPort.list).toHaveBeenCalled();
  });
});
