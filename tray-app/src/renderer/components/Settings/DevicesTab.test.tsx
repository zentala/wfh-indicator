import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DevicesTab } from "./DevicesTab";
import { DeviceInfo } from "../../../shared/types";

// Mock the API
const mockApi = {
  getDevices: vi.fn(),
  removeDevice: vi.fn(),
};

// Mock window.api
Object.defineProperty(window, "api", {
  value: mockApi,
  writable: true,
});

describe("DevicesTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially and then empty state", async () => {
    mockApi.getDevices.mockResolvedValue([]);
    render(<DevicesTab />);
    expect(document.querySelector(".loading-spinner")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("No devices paired")).toBeInTheDocument();
    });
  });

  it("renders device list when devices exist", async () => {
    const mockDevices: DeviceInfo[] = [
      { id: "1", name: "Office Door", connected: true, battery: 85 },
      { id: "2", name: "Living Room", connected: false, battery: 15 },
    ];
    mockApi.getDevices.mockResolvedValue(mockDevices);

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("Office Door")).toBeInTheDocument();
      expect(screen.getByText("Living Room")).toBeInTheDocument();
    });
  });

  it("calls removeDevice and reloads devices", async () => {
    const mockDevices: DeviceInfo[] = [
      { id: "1", name: "Office Door", connected: true, battery: 85 },
    ];
    mockApi.getDevices.mockResolvedValue(mockDevices);
    mockApi.removeDevice.mockResolvedValue(undefined);

    render(<DevicesTab />);

    // Wait for initial render
    await screen.findByText("Office Door");

    // Using act to wrap state update
    await act(async () => {
      const removeButton = await screen.findByTestId("remove-device-1");
      fireEvent.click(removeButton);
    });

    expect(mockApi.removeDevice).toHaveBeenCalledWith("1");
    await waitFor(() => {
      expect(mockApi.getDevices).toHaveBeenCalledTimes(2); // Initial load + after remove
    });
  });

  it("handles API errors gracefully", async () => {
    mockApi.getDevices.mockRejectedValue(new Error("API Error"));

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("No devices paired")).toBeInTheDocument();
    });
  });
});
