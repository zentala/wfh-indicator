import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ScheduleService } from "./scheduleService";
import { ScheduleRule } from "../shared/types";

// Mock the dependencies
vi.mock("./deviceManager", () => ({
  deviceManager: {
    getScheduleRules: vi.fn(),
  },
}));

vi.mock("./stateManager", () => ({
  stateManager: {
    getStatus: vi.fn(),
    setStatus: vi.fn(),
  },
}));

vi.mock("electron-log", () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ScheduleService", () => {
  let scheduleService: ScheduleService;

  beforeEach(() => {
    scheduleService = new ScheduleService();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    if (scheduleService.isServiceRunning()) {
      scheduleService.stop();
    }
  });

  describe("start()", () => {
    it("should start the service and begin checking schedule", () => {
      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService.start();

      expect(scheduleService.isServiceRunning()).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith("started");
    });

    it("should not start if already running", () => {
      scheduleService.start();
      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService.start();

      expect(emitSpy).not.toHaveBeenCalled(); // No emit on second start
    });
  });

  describe("stop()", () => {
    it("should stop the service and clear interval", () => {
      scheduleService.start();
      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService.stop();

      expect(scheduleService.isServiceRunning()).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith("stopped");
    });

    it("should not stop if not running", () => {
      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService.stop();

      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe("isServiceRunning()", () => {
    it("should return true when service is running", () => {
      scheduleService.start();
      expect(scheduleService.isServiceRunning()).toBe(true);
    });

    it("should return false when service is stopped", () => {
      expect(scheduleService.isServiceRunning()).toBe(false);
    });
  });

  describe("triggerCheck()", () => {
    it("should manually trigger a schedule check", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getScheduleRules).mockResolvedValue([]);

      await scheduleService.triggerCheck();

      expect(deviceManager.getScheduleRules).toHaveBeenCalled();
    });
  });

  describe("time range validation", () => {
    it("should correctly validate time ranges", () => {
      // Test normal time range
      expect(scheduleService["isTimeInRange"]("10:30", "09:00", "17:00")).toBe(
        true
      );
      expect(scheduleService["isTimeInRange"]("08:30", "09:00", "17:00")).toBe(
        false
      );
      expect(scheduleService["isTimeInRange"]("18:00", "09:00", "17:00")).toBe(
        false
      );

      // Test overnight time range
      expect(scheduleService["isTimeInRange"]("23:30", "22:00", "06:00")).toBe(
        true
      );
      expect(scheduleService["isTimeInRange"]("03:30", "22:00", "06:00")).toBe(
        true
      );
      expect(scheduleService["isTimeInRange"]("12:00", "22:00", "06:00")).toBe(
        false
      );
    });
  });

  describe("rule matching", () => {
    it("should find matching rule for current time and day", () => {
      const rules: ScheduleRule[] = [
        {
          id: "1",
          days: [1, 2, 3, 4, 5], // Monday to Friday
          startTime: "09:00",
          endTime: "17:00",
          status: "FOCUSED",
          enabled: true,
        },
      ];

      // Mock current time to Monday 10:30
      const mockDate = new Date(2024, 0, 1, 10, 30); // Monday, 10:30 AM
      vi.setSystemTime(mockDate);

      const matchingRule = scheduleService["findMatchingRule"](
        rules,
        1,
        "10:30"
      );

      expect(matchingRule).toEqual(rules[0]);
    });

    it("should not find matching rule for disabled rule", () => {
      const rules: ScheduleRule[] = [
        {
          id: "1",
          days: [1],
          startTime: "09:00",
          endTime: "17:00",
          status: "FOCUSED",
          enabled: false,
        },
      ];

      const matchingRule = scheduleService["findMatchingRule"](
        rules,
        1,
        "10:30"
      );

      expect(matchingRule).toBeNull();
    });

    it("should not find matching rule for wrong day", () => {
      const rules: ScheduleRule[] = [
        {
          id: "1",
          days: [1], // Monday only
          startTime: "09:00",
          endTime: "17:00",
          status: "FOCUSED",
          enabled: true,
        },
      ];

      const matchingRule = scheduleService["findMatchingRule"](
        rules,
        2,
        "10:30"
      ); // Tuesday

      expect(matchingRule).toBeNull();
    });

    it("should not find matching rule for wrong time", () => {
      const rules: ScheduleRule[] = [
        {
          id: "1",
          days: [1],
          startTime: "09:00",
          endTime: "17:00",
          status: "FOCUSED",
          enabled: true,
        },
      ];

      const matchingRule = scheduleService["findMatchingRule"](
        rules,
        1,
        "18:00"
      ); // After hours

      expect(matchingRule).toBeNull();
    });
  });

  describe("rule application", () => {
    it("should apply rule and change status", async () => {
      const { stateManager } = await import("./stateManager");
      vi.mocked(stateManager.getStatus).mockReturnValue("AVAILABLE");

      const rule: ScheduleRule = {
        id: "1",
        days: [1],
        startTime: "09:00",
        endTime: "17:00",
        status: "FOCUSED",
        enabled: true,
      };

      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService["applyRule"](rule);

      expect(stateManager.setStatus).toHaveBeenCalledWith("FOCUSED");
      expect(emitSpy).toHaveBeenCalledWith("rule-applied", rule);
    });

    it("should not change status if already set", async () => {
      const { stateManager } = await import("./stateManager");
      vi.mocked(stateManager.getStatus).mockReturnValue("FOCUSED");

      const rule: ScheduleRule = {
        id: "1",
        days: [1],
        startTime: "09:00",
        endTime: "17:00",
        status: "FOCUSED",
        enabled: true,
      };

      const emitSpy = vi.spyOn(scheduleService, "emit");

      scheduleService["applyRule"](rule);

      expect(stateManager.setStatus).not.toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe("integration with DeviceManager", () => {
    it("should handle empty rules array", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getScheduleRules).mockResolvedValue([]);

      // Mock current time
      const mockDate = new Date(2024, 0, 1, 10, 30);
      vi.setSystemTime(mockDate);

      await scheduleService["checkSchedule"]();

      expect(deviceManager.getScheduleRules).toHaveBeenCalled();
    });

    it("should handle DeviceManager errors gracefully", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getScheduleRules).mockRejectedValue(
        new Error("Test error")
      );

      await expect(scheduleService["checkSchedule"]()).resolves.not.toThrow();
    });
  });
});
