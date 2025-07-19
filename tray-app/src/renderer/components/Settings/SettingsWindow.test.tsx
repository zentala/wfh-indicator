import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SettingsWindow } from "./SettingsWindow";

// Mock the child components
vi.mock("./DevicesTab", () => ({
  DevicesTab: () => <div data-testid="devices-tab">Devices Tab Content</div>,
}));

vi.mock("./AutoStatusTab", () => ({
  AutoStatusTab: () => (
    <div data-testid="auto-status-tab">Auto Status Tab Content</div>
  ),
}));

describe("SettingsWindow", () => {
  it("renders the settings window with header", () => {
    render(<SettingsWindow />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your devices and automation rules")
    ).toBeInTheDocument();
  });

  it("renders both tab buttons", () => {
    render(<SettingsWindow />);

    expect(screen.getByText("📱 Devices")).toBeInTheDocument();
    expect(screen.getByText("⏰ Auto Status")).toBeInTheDocument();
  });

  it("shows devices tab by default", () => {
    render(<SettingsWindow />);

    expect(screen.getByTestId("devices-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("auto-status-tab")).not.toBeInTheDocument();
  });

  it("switches to auto status tab when clicked", () => {
    render(<SettingsWindow />);

    const autoStatusTab = screen.getByText("⏰ Auto Status");
    fireEvent.click(autoStatusTab);

    expect(screen.getByTestId("auto-status-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("devices-tab")).not.toBeInTheDocument();
  });

  it("switches back to devices tab when clicked", () => {
    render(<SettingsWindow />);

    // First switch to auto status
    const autoStatusTab = screen.getByText("⏰ Auto Status");
    fireEvent.click(autoStatusTab);

    // Then switch back to devices
    const devicesTab = screen.getByText("📱 Devices");
    fireEvent.click(devicesTab);

    expect(screen.getByTestId("devices-tab")).toBeInTheDocument();
    expect(screen.queryByTestId("auto-status-tab")).not.toBeInTheDocument();
  });

  it("applies active tab styling correctly", () => {
    render(<SettingsWindow />);

    const devicesTab = screen.getByText("📱 Devices");
    const autoStatusTab = screen.getByText("⏰ Auto Status");

    // Devices tab should be active by default
    expect(devicesTab.closest("button")).toHaveClass("tab-active");
    expect(autoStatusTab.closest("button")).not.toHaveClass("tab-active");

    // Click auto status tab
    fireEvent.click(autoStatusTab);

    // Auto status tab should now be active
    expect(autoStatusTab.closest("button")).toHaveClass("tab-active");
    expect(devicesTab.closest("button")).not.toHaveClass("tab-active");
  });
});
