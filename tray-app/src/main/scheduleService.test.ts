import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  Mock,
  MockInstance,
} from "vitest";
import { ScheduleService } from "./scheduleService";
import { deviceManager } from "./deviceManager";
import { stateManager } from "./stateManager";
import { ScheduleRule } from "../shared/types";

// Mock dependencies
vi.mock("./deviceManager", () => {
  const EventEmitter = require("events");
  const mockManager = new EventEmitter();
  mockManager.getScheduleRules = vi.fn();
  mockManager.removeAllListeners = vi.fn();
  return { deviceManager: mockManager };
});

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
  let emitSpy: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    (deviceManager.getScheduleRules as Mock).mockResolvedValue([]);

    scheduleService = new ScheduleService();
    // Spy directly on the emit method of the instance
    emitSpy = vi.spyOn(scheduleService, "emit");
  });

  afterEach(() => {
    scheduleService.destroy();
  });

  describe("start()", () => {
    it("should start the service and begin checking schedule", async () => {
      vi.useFakeTimers();
      const checkScheduleSpy = vi.spyOn(
        scheduleService as any,
        "checkSchedule"
      );

      await scheduleService.start();

      expect(scheduleService.isServiceRunning()).toBe(true);
      expect(emitSpy).toHaveBeenCalledWith("started");
      expect(checkScheduleSpy).toHaveBeenCalled();

      // Should run every minute
      vi.advanceTimersByTime(60 * 1000);
      expect(checkScheduleSpy).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it("should not start if already running", async () => {
      await scheduleService.start(); // Start once
      emitSpy.mockClear();
      await scheduleService.start(); // Try to start again

      expect(emitSpy).not.toHaveBeenCalledWith("started");
    });
  });

  describe("stop()", () => {
    it("should stop the service and clear interval", async () => {
      await scheduleService.start();
      scheduleService.stop();

      expect(scheduleService.isServiceRunning()).toBe(false);
      expect(emitSpy).toHaveBeenCalledWith("stopped");
    });

    it("should not stop if not running", () => {
      scheduleService.stop();
      expect(emitSpy).not.toHaveBeenCalledWith("stopped");
    });
  });

  describe("isServiceRunning()", () => {
    it("should return true when service is running", async () => {
      await scheduleService.start();
      expect(scheduleService.isServiceRunning()).toBe(true);
    });

    it("should return false when service is stopped", () => {
      expect(scheduleService.isServiceRunning()).toBe(false);
    });
  });

  describe("triggerCheck()", () => {
    it("should manually trigger a schedule check", async () => {
      const checkScheduleSpy = vi.spyOn(
        scheduleService as any,
        "checkSchedule"
      );
      await scheduleService.triggerCheck();
      expect(checkScheduleSpy).toHaveBeenCalled();
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
    beforeEach(() => {
      vi.setSystemTime(new Date("2023-01-04T10:00:00")); // This is a Wednesday (day 3)
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const rule: ScheduleRule = {
      id: "1",
      days: [3], // Wednesday
      startTime: "09:00",
      endTime: "11:00",
      status: "FOCUSED",
      enabled: true,
    };

    it("should apply rule and change status", async () => {
      (scheduleService as any).scheduleRules = [rule];
      (stateManager.getStatus as Mock).mockReturnValue("AVAILABLE");

      await scheduleService["checkSchedule"]();

      expect(stateManager.setStatus).toHaveBeenCalledWith("FOCUSED");
    });

    it("should not change status if already set", async () => {
      (scheduleService as any).scheduleRules = [rule];
      (stateManager.getStatus as Mock).mockReturnValue("FOCUSED");

      await scheduleService["checkSchedule"]();

      expect(stateManager.setStatus).not.toHaveBeenCalled();
    });
  });

  describe("integration with DeviceManager", () => {
    it("should load rules on start", async () => {
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
      (deviceManager.getScheduleRules as Mock).mockResolvedValue(rules);

      await scheduleService.start();

      expect(deviceManager.getScheduleRules).toHaveBeenCalled();
      expect((scheduleService as any).scheduleRules).toEqual(rules);
    });

    it("should handle empty rules array", async () => {
      (stateManager.getStatus as Mock).mockReturnValue("AVAILABLE");

      await scheduleService["checkSchedule"]();

      expect(stateManager.setStatus).not.toHaveBeenCalled();
    });

    it("should handle DeviceManager errors gracefully", async () => {
      (deviceManager.getScheduleRules as Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await scheduleService.start();

      expect((scheduleService as any).scheduleRules).toEqual([]);
      await scheduleService["checkSchedule"]();
      expect(stateManager.setStatus).not.toHaveBeenCalled();
    });
  });
});
