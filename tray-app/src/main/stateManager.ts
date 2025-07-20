import { WorkStatus, getWorkStatusInfo } from "@wfh-indicator/domain";
import { EventEmitter } from "events";

/**
 * A simple in-memory store for the application's state with event emitting capabilities.
 */
class StateManager extends EventEmitter {
  private currentStatus: WorkStatus = WorkStatus.OFFLINE;

  /**
   * Gets the current work status.
   * @returns The current work status.
   */
  public getStatus(): WorkStatus {
    return this.currentStatus;
  }

  /**
   * Gets the current work status with full information.
   * @returns The current work status info.
   */
  public getStatusInfo() {
    return getWorkStatusInfo(this.currentStatus);
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

  /**
   * Gets all available work statuses.
   * @returns Array of all work statuses.
   */
  public getAllStatuses(): WorkStatus[] {
    return Object.values(WorkStatus);
  }
}

export const stateManager = new StateManager();
