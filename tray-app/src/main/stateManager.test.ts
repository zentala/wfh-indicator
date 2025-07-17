import { describe, it, expect, vi } from "vitest";
import { stateManager } from "./stateManager";
import { WorkStatus } from "../shared/types";

describe("StateManager", () => {
  it("should initialize with OFFLINE status", () => {
    expect(stateManager.getStatus()).toBe("OFFLINE");
  });

  it("should set a new status and emit an event", () => {
    const listener = vi.fn();
    stateManager.on("status-changed", listener);

    const newStatus: WorkStatus = "AVAILABLE";
    stateManager.setStatus(newStatus);

    expect(stateManager.getStatus()).toBe(newStatus);
    expect(listener).toHaveBeenCalledWith(newStatus);
    expect(listener).toHaveBeenCalledTimes(1);

    stateManager.off("status-changed", listener);
  });

  it("should not emit an event if the status is the same", () => {
    const listener = vi.fn();
    stateManager.setStatus("FOCUSED"); // Set initial state
    stateManager.on("status-changed", listener);

    stateManager.setStatus("FOCUSED"); // Set the same status

    expect(listener).not.toHaveBeenCalled();

    stateManager.off("status-changed", listener);
  });
});
