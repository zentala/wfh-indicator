import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UsbDetectionStep } from "./UsbDetectionStep";

describe("UsbDetectionStep", () => {
  it("should render instructions and a button", () => {
    render(<UsbDetectionStep onComplete={() => {}} />);
    expect(screen.getByText("Connect Your Device")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Please connect your WFH Indicator device to your computer using a USB cable."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Detect Device/i })
    ).toBeInTheDocument();
  });

  it("should call onComplete when the button is clicked", () => {
    const onComplete = vi.fn();
    render(<UsbDetectionStep onComplete={onComplete} />);

    const detectButton = screen.getByRole("button", { name: /Detect Device/i });
    fireEvent.click(detectButton);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
