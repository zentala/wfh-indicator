import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { WifiConfigStep } from "./WifiConfigStep";

describe("WifiConfigStep", () => {
  it("should render the form with SSID and password fields", () => {
    render(<WifiConfigStep onComplete={() => {}} />);
    expect(screen.getByPlaceholderText("YourNetworkName")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("YourPassword")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("should call onComplete with the entered credentials on submit", () => {
    const onComplete = vi.fn();
    render(<WifiConfigStep onComplete={onComplete} />);

    const ssidInput = screen.getByPlaceholderText("YourNetworkName");
    const passwordInput = screen.getByPlaceholderText("YourPassword");
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(ssidInput, { target: { value: "TestNetwork" } });
    fireEvent.change(passwordInput, { target: { value: "TestPassword" } });
    fireEvent.click(nextButton);

    expect(onComplete).toHaveBeenCalledWith("TestNetwork", "TestPassword");
  });

  it("should not call onComplete if SSID is empty", () => {
    const onComplete = vi.fn();
    render(<WifiConfigStep onComplete={onComplete} />);

    const passwordInput = screen.getByPlaceholderText("YourPassword");
    const nextButton = screen.getByRole("button", { name: /Next/i });

    fireEvent.change(passwordInput, { target: { value: "TestPassword" } });
    fireEvent.click(nextButton);

    expect(onComplete).not.toHaveBeenCalled();
  });
});
