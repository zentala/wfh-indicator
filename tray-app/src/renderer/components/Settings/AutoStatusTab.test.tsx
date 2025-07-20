import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AutoStatusTab } from "./AutoStatusTab";

// Mock the API calls for a cleaner test environment
vi.mock("../../../shared/api", () => ({
  getScheduleRules: () => Promise.resolve([]),
  addScheduleRule: (rule: any) => Promise.resolve(rule),
  removeScheduleRule: (id: string) => Promise.resolve(),
}));

describe("AutoStatusTab", () => {
  it("renders the auto status tab with header", () => {
    render(<AutoStatusTab />);
    expect(screen.getByText("Auto Status Rules")).toBeInTheDocument();
    expect(screen.getByText("Add Rule")).toBeInTheDocument();
  });

  it("renders integrations section with disabled toggles", () => {
    render(<AutoStatusTab />);
    expect(screen.getByText("Integrations")).toBeInTheDocument();
    const toggles = screen.getAllByRole("checkbox");
    expect(toggles[0]).toBeDisabled();
    expect(toggles[1]).toBeDisabled();
  });

  it("renders empty state when no rules exist", () => {
    render(<AutoStatusTab />);
    expect(screen.getByText("No rules configured")).toBeInTheDocument();
    expect(screen.getByText("Add First Rule")).toBeInTheDocument();
  });

  it("opens add rule modal when 'Add Rule' button is clicked", async () => {
    render(<AutoStatusTab />);
    fireEvent.click(screen.getByText("Add Rule"));
    expect(
      await screen.findByText("Add New Schedule Rule")
    ).toBeInTheDocument();
  });

  it("opens add rule modal when 'Add First Rule' button is clicked", async () => {
    render(<AutoStatusTab />);
    fireEvent.click(screen.getByText("Add First Rule"));
    expect(
      await screen.findByText("Add New Schedule Rule")
    ).toBeInTheDocument();
  });

  it("closes modal when 'Cancel' button is clicked", async () => {
    render(<AutoStatusTab />);
    fireEvent.click(screen.getByText("Add Rule"));
    expect(
      await screen.findByText("Add New Schedule Rule")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Add New Schedule Rule")).not.toBeInTheDocument();
  });

  it("renders all status and day options in the modal", async () => {
    render(<AutoStatusTab />);
    fireEvent.click(screen.getByText("Add Rule"));
    await screen.findByText("Add New Schedule Rule");

    expect(screen.getByText("🔴 On Call")).toBeInTheDocument();
    expect(screen.getByText("Monday")).toBeInTheDocument();
  });
});
