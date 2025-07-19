import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AutoStatusTab } from "./AutoStatusTab";

describe("AutoStatusTab", () => {
  it("renders the auto status tab with header", () => {
    render(<AutoStatusTab />);

    expect(screen.getByText("Auto Status Rules")).toBeInTheDocument();
    expect(screen.getByText("Add Rule")).toBeInTheDocument();
  });

  it("renders integrations section", () => {
    render(<AutoStatusTab />);

    expect(screen.getByText("Integrations")).toBeInTheDocument();
    expect(screen.getByText("Calendar Integration")).toBeInTheDocument();
    expect(screen.getByText("Microphone/Camera Detection")).toBeInTheDocument();
  });

  it("shows disabled integration toggles", () => {
    render(<AutoStatusTab />);

    const toggles = screen.getAllByRole("checkbox");
    expect(toggles[0]).toBeDisabled(); // Calendar integration
    expect(toggles[1]).toBeDisabled(); // Microphone/Camera detection
  });

  it("renders empty state when no rules exist", () => {
    render(<AutoStatusTab />);

    expect(screen.getByText("No rules configured")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create rules to automatically change your status based on schedule"
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Add First Rule")).toBeInTheDocument();
  });

  it("opens add rule modal when Add Rule button is clicked", () => {
    render(<AutoStatusTab />);

    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    expect(screen.getByText("Add Schedule Rule")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Start Time")).toBeInTheDocument();
    expect(screen.getByText("End Time")).toBeInTheDocument();
  });

  it("opens add rule modal when Add First Rule button is clicked", () => {
    render(<AutoStatusTab />);

    const addFirstRuleButton = screen.getByText("Add First Rule");
    fireEvent.click(addFirstRuleButton);

    expect(screen.getByText("Add Schedule Rule")).toBeInTheDocument();
  });

  it("closes modal when Cancel button is clicked", () => {
    render(<AutoStatusTab />);

    // Open modal
    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    // Verify modal is open
    expect(screen.getByText("Add Schedule Rule")).toBeInTheDocument();

    // Close modal
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    // Verify modal is closed
    expect(screen.queryByText("Add Schedule Rule")).not.toBeInTheDocument();
  });

  it("renders all status options in modal", () => {
    render(<AutoStatusTab />);

    // Open modal
    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    // Check for all status options
    expect(screen.getByText("🔴 On Call")).toBeInTheDocument();
    expect(screen.getByText("🟠 Video Call")).toBeInTheDocument();
    expect(screen.getByText("🟡 Focused")).toBeInTheDocument();
    expect(screen.getByText("🟢 Available")).toBeInTheDocument();
    expect(screen.getByText("🔵 Away")).toBeInTheDocument();
  });

  it("renders all day options in modal", () => {
    render(<AutoStatusTab />);

    // Open modal
    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    // Check for all day options
    expect(screen.getByText("Monday")).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Wednesday")).toBeInTheDocument();
    expect(screen.getByText("Thursday")).toBeInTheDocument();
    expect(screen.getByText("Friday")).toBeInTheDocument();
    expect(screen.getByText("Saturday")).toBeInTheDocument();
    expect(screen.getByText("Sunday")).toBeInTheDocument();
  });

  it("renders time input fields in modal", () => {
    render(<AutoStatusTab />);

    // Open modal
    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    // Check for time inputs
    const timeInputs = screen.getAllByDisplayValue("");
    expect(timeInputs).toHaveLength(2); // Start Time and End Time
  });

  it("shows Add Rule button in modal", () => {
    render(<AutoStatusTab />);

    // Open modal
    const addRuleButton = screen.getByText("Add Rule");
    fireEvent.click(addRuleButton);

    // Check for Add Rule button in modal - use getAllByText and check the one in modal
    const addRuleButtons = screen.getAllByText("Add Rule");
    expect(addRuleButtons).toHaveLength(2); // One in header, one in modal
  });

  it("renders schedule rules section", () => {
    render(<AutoStatusTab />);

    expect(screen.getByText("Schedule Rules")).toBeInTheDocument();
  });

  it("shows empty state message for rules", () => {
    render(<AutoStatusTab />);

    expect(screen.getByText("⏰")).toBeInTheDocument(); // Emoji
    expect(screen.getByText("No rules configured")).toBeInTheDocument();
  });
});
