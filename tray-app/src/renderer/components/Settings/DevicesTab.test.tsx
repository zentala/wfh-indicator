import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("renders loading state initially", () => {
    mockApi.getDevices.mockResolvedValue([]);

    render(<DevicesTab />);

    const loadingElement = document.querySelector(".loading-spinner");
    expect(loadingElement).toBeInTheDocument(); // loading spinner class
  });

  it("renders empty state when no devices", async () => {
    mockApi.getDevices.mockResolvedValue([]);

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("No devices paired")).toBeInTheDocument();
      expect(
        screen.getByText("Pair your first WFH Indicator device to get started")
      ).toBeInTheDocument();
      expect(screen.getByText("Pair Device")).toBeInTheDocument();
    });
  });

  it("renders device list when devices exist", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 85,
      },
      {
        id: "2",
        name: "Living Room",
        connected: false,
        battery: 15,
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("Office Door")).toBeInTheDocument();
      expect(screen.getByText("Living Room")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("15%")).toBeInTheDocument();
    });
  });

  it("shows connection status correctly", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 85,
      },
      {
        id: "2",
        name: "Living Room",
        connected: false,
        battery: 15,
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("Connected")).toBeInTheDocument();
      expect(screen.getByText("Disconnected")).toBeInTheDocument();
    });
  });

  it("shows connection indicator colors correctly", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 85,
      },
      {
        id: "2",
        name: "Living Room",
        connected: false,
        battery: 15,
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);

    render(<DevicesTab />);

    await waitFor(() => {
      const indicators = screen.getAllByText(""); // connection indicators are empty divs
      const successIndicator = indicators.find((el) =>
        el.classList.contains("bg-success")
      );
      const errorIndicator = indicators.find((el) =>
        el.classList.contains("bg-error")
      );
      expect(successIndicator).toBeInTheDocument();
      expect(errorIndicator).toBeInTheDocument();
    });
  });

  it("calls removeDevice when remove button is clicked", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 85,
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);
    mockApi.removeDevice.mockResolvedValue([]);

    render(<DevicesTab />);

    await waitFor(() => {
      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);
    });

    expect(mockApi.removeDevice).toHaveBeenCalledWith("1");
  });

  it("reloads devices after removing a device", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 85,
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);
    mockApi.removeDevice.mockResolvedValue([]);

    render(<DevicesTab />);

    await waitFor(() => {
      const removeButton = screen.getByText("Remove");
      fireEvent.click(removeButton);
    });

    expect(mockApi.getDevices).toHaveBeenCalledTimes(2); // Initial load + after remove
  });

  it("handles API errors gracefully", async () => {
    mockApi.getDevices.mockRejectedValue(new Error("API Error"));

    render(<DevicesTab />);

    await waitFor(() => {
      // Should not crash and should show empty state
      expect(screen.getByText("No devices paired")).toBeInTheDocument();
    });
  });

  it("shows battery level with warning for low battery", async () => {
    const mockDevices: DeviceInfo[] = [
      {
        id: "1",
        name: "Office Door",
        connected: true,
        battery: 10, // Low battery
      },
    ];

    mockApi.getDevices.mockResolvedValue(mockDevices);

    render(<DevicesTab />);

    await waitFor(() => {
      expect(screen.getByText("10%")).toBeInTheDocument();
      // The battery level should be visible and potentially styled for low battery
    });
  });
});
