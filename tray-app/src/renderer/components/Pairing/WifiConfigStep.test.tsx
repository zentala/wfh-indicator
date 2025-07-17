import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WifiConfigStep } from "./WifiConfigStep";

describe("WifiConfigStep", () => {
  it("should render the form with SSID and password fields", () => {
    render(<WifiConfigStep onComplete={() => {}} />);
    expect(screen.getByLabelText(/WiFi SSID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("should call onComplete with the entered credentials on submit", () => {
    const onComplete = vi.fn();
    render(<WifiConfigStep onComplete={onComplete} />);

    const ssidInput = screen.getByLabelText(/WiFi SSID/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(ssidInput, { target: { value: "TestNetwork" } });
    fireEvent.change(passwordInput, { target: { value: "TestPassword123" } });
    fireEvent.click(nextButton);

    expect(onComplete).toHaveBeenCalledWith("TestNetwork", "TestPassword123");
  });

  it("should not call onComplete if SSID is empty", () => {
    // Mock window.alert
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    const onComplete = vi.fn();
    render(<WifiConfigStep onComplete={onComplete} />);

    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);

    expect(onComplete).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith("WiFi SSID cannot be empty.");

    alertMock.mockRestore();
  });
});
