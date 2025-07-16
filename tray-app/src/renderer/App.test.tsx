import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from "vitest";

describe("App component", () => {
  it("renders headline", () => {
    render(<App />);
    const headline = screen.getByText(/WFH Indicator Tray App/i);
    expect(headline).toBeInTheDocument();
  });
});
