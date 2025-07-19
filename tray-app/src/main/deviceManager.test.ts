/// <reference types="vitest" />

import { describe, it, expect, vi, beforeEach } from "vitest";
import { deviceManager } from "./deviceManager";
import settings from "electron-settings";
import { SerialPort } from "serialport";

// Mock electron-settings
vi.mock("electron-settings", () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    hasSync: vi.fn(() => true),
  },
}));

// Mock serialport
vi.mock("serialport", () => {
  const mockSerialPort = {
    list: vi.fn(),
  };
  return {
    SerialPort: mockSerialPort,
  };
});

describe("DeviceManager", () => {
  let SerialPort;

  beforeEach(async () => {
    // Reset mocks before each test
    vi.clearAllMocks();
    SerialPort = (
      await vi.importActual<typeof import("serialport")>("serialport")
    ).SerialPort;
  });

  it("should get devices from settings", async () => {
    const mockDevices = [
      { id: "1", name: "Test Device", connected: false, battery: 100 },
    ];
    (settings.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockDevices);

    const devices = await deviceManager.getDevices();
    expect(settings.get).toHaveBeenCalledWith("devices");
    expect(devices).toEqual(mockDevices);
  });

  it("should add a new device", async () => {
    (settings.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    const newDevice = { name: "New Device", battery: 80 };

    const addedDevice = await deviceManager.addDevice(newDevice);
    expect(addedDevice.name).toBe(newDevice.name);
    expect(addedDevice.id).toBeDefined();
    expect(settings.set).toHaveBeenCalledWith("devices", [
      expect.objectContaining(newDevice),
    ]);
  });

  it("should remove a device", async () => {
    const mockDevices = [
      { id: "1", name: "Test Device", connected: false, battery: 100 },
    ];
    (settings.get as ReturnType<typeof vi.fn>).mockResolvedValue(mockDevices);

    await deviceManager.removeDevice("1");
    expect(settings.set).toHaveBeenCalledWith("devices", []);
  });

  it("should detect a USB device", async () => {
    const mockPorts = [{ manufacturer: "arduino", path: "/dev/ttyUSB0" }];
    (SerialPort.list as ReturnType<typeof vi.fn>).mockResolvedValue(mockPorts);

    const port = await deviceManager.detectUSBDevice();
    expect(port).toBeDefined();
    expect(port?.path).toBe("/dev/ttyUSB0");
    expect(SerialPort.list).toHaveBeenCalled();
  });
});
