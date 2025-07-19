import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  it("renders headline", () => {
    render(<App />);
    const headline = screen.getByText(/Main Window/i);
    expect(headline).toBeInTheDocument();
  });
});
