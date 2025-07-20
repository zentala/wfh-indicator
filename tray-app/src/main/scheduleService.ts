import { EventEmitter } from "events";
import { ScheduleRule, WorkStatus } from "../shared/types";
import { stateManager } from "./stateManager";
import { deviceManager } from "./deviceManager";
import log from "electron-log";

/**
 * Service responsible for automatically changing work status based on schedule rules.
 * Checks rules every minute and applies them if conditions are met.
 */
class ScheduleService extends EventEmitter {
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private scheduleRules: ScheduleRule[] = [];

  constructor() {
    super();
    // Bind the method to ensure 'this' context is correct
    this.loadScheduleRules = this.loadScheduleRules.bind(this);
    deviceManager.on("schedule-rules-changed", this.loadScheduleRules);
  }

  /**
   * Starts the schedule service.
   * Begins checking schedule rules every minute.
   */
  public async start(): Promise<void> {
    if (this.isRunning) {
      log.warn("ScheduleService is already running");
      return;
    }

    log.info("Starting ScheduleService");
    this.isRunning = true;

    await this.loadScheduleRules();
    this.checkSchedule();

    // Then check every minute
    this.interval = setInterval(() => {
      this.checkSchedule();
    }, 60000); // 60 seconds

    this.emit("started");
  }

  /**
   * Stops the schedule service.
   * Clears the interval and stops checking rules.
   */
  public stop(): void {
    if (!this.isRunning) {
      log.warn("ScheduleService is not running");
      return;
    }

    log.info("Stopping ScheduleService");
    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.emit("stopped");
  }

  /**
   * Checks if the service is currently running.
   * @returns True if the service is running, false otherwise.
   */
  public isServiceRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Cleans up the service, removing listeners and intervals.
   */
  public destroy(): void {
    this.stop();
    deviceManager.removeListener(
      "schedule-rules-changed",
      this.loadScheduleRules
    );
    log.info("ScheduleService destroyed and listeners removed.");
  }

  private async loadScheduleRules(): Promise<void> {
    try {
      this.scheduleRules = await deviceManager.getScheduleRules();
      log.info("Schedule rules reloaded");
    } catch (error) {
      log.error("Failed to load schedule rules:", error);
    }
  }

  /**
   * Checks all schedule rules and applies them if conditions are met.
   * This method is called every minute by the interval.
   */
  private async checkSchedule(): Promise<void> {
    try {
      log.debug("Checking schedule rules");

      // Get current time
      const now = new Date();
      const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
      const currentTime = now.toTimeString().slice(0, 5); // "HH:mm" format

      log.debug(`Current time: ${currentTime}, day: ${currentDay}`);

      // Get schedule rules from DeviceManager
      const matchingRule = this.findMatchingRule(
        this.scheduleRules,
        currentDay,
        currentTime
      );

      if (matchingRule) {
        log.info(
          `Applying schedule rule: ${matchingRule.id} -> ${matchingRule.status}`
        );
        this.applyRule(matchingRule);
      } else {
        log.debug("No matching schedule rules found");
      }
    } catch (error) {
      log.error("Error checking schedule:", error);
    }
  }

  /**
   * Finds the first schedule rule that matches the current time and day.
   * @param rules Array of schedule rules to check
   * @param currentDay Current day of week (0=Sunday, 1=Monday, etc.)
   * @param currentTime Current time in "HH:mm" format
   * @returns The first matching rule, or null if none found
   */
  private findMatchingRule(
    rules: ScheduleRule[],
    currentDay: number,
    currentTime: string
  ): ScheduleRule | null {
    // Convert Sunday=0 to Monday=1 format for our rules
    const ruleDay = currentDay === 0 ? 7 : currentDay;

    for (const rule of rules) {
      if (!rule.enabled) continue;

      // Check if current day is in the rule's days
      if (!rule.days.includes(ruleDay as 1 | 2 | 3 | 4 | 5 | 6 | 7)) continue;

      // Check if current time is within the rule's time range
      if (this.isTimeInRange(currentTime, rule.startTime, rule.endTime)) {
        return rule;
      }
    }

    return null;
  }

  /**
   * Checks if a time is within a given range.
   * @param time Time to check in "HH:mm" format
   * @param startTime Start time in "HH:mm" format
   * @param endTime End time in "HH:mm" format
   * @returns True if time is within range, false otherwise
   */
  private isTimeInRange(
    time: string,
    startTime: string,
    endTime: string
  ): boolean {
    // Handle overnight ranges (e.g., 22:00 to 06:00)
    if (startTime > endTime) {
      return time >= startTime || time <= endTime;
    }

    return time >= startTime && time <= endTime;
  }

  /**
   * Applies a schedule rule by changing the work status.
   * @param rule The schedule rule to apply
   */
  private applyRule(rule: ScheduleRule): void {
    const currentStatus = stateManager.getStatus();

    if (currentStatus === rule.status) {
      log.debug(`Status already set to ${rule.status}, no change needed`);
      return;
    }

    log.info(
      `Changing status from ${currentStatus} to ${rule.status} (rule: ${rule.id})`
    );
    stateManager.setStatus(rule.status);

    this.emit("rule-applied", rule);
  }

  /**
   * Manually triggers a schedule check.
   * Useful for testing or immediate rule application.
   */
  public async triggerCheck(): Promise<void> {
    log.info("Manually triggering schedule check");
    await this.checkSchedule();
  }
}

export { ScheduleService };
export const scheduleService = new ScheduleService();
