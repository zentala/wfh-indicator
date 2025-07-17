import { WorkStatus } from "../shared/types";
import { EventEmitter } from "events";

/**
 * A simple in-memory store for the application's state with event emitting capabilities.
 */
class StateManager extends EventEmitter {
  private currentStatus: WorkStatus = "OFFLINE";

  /**
   * Gets the current work status.
   * @returns The current work status.
   */
  public getStatus(): WorkStatus {
    return this.currentStatus;
  }

  /**
   * Sets the new work status and emits a 'status-changed' event.
   * @param status The new work status.
   */
  public setStatus(status: WorkStatus): void {
    if (this.currentStatus === status) return;
    this.currentStatus = status;
    this.emit("status-changed", status);
  }
}

export const stateManager = new StateManager();
