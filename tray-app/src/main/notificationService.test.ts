import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NotificationService } from "./notificationService";

// Mock the dependencies
vi.mock("./deviceManager", () => ({
  deviceManager: {
    getDevices: vi.fn(),
  },
}));

// Mock electron with proper structure
const mockNotification = vi.fn().mockImplementation(() => ({
  show: vi.fn(),
  close: vi.fn(),
  on: vi.fn(),
}));

vi.mock("electron", () => ({
  Notification: mockNotification,
}));

vi.mock("electron-log", () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

describe("NotificationService", () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    notificationService.closeAllNotifications();
  });

  describe("showAskToEnter()", () => {
    it("should create and show an Ask to Enter notification", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showAskToEnter("device-1", "Test Device");

      expect(Notification).toHaveBeenCalledWith({
        title: "Ask to Enter",
        body: "Test Device is requesting to enter your workspace.",
        icon: undefined,
        silent: false,
        timeoutType: "default",
        actions: [
          { type: "button", text: "Yes" },
          { type: "button", text: "No" },
          { type: "button", text: "If Urgent" },
        ],
        closeButtonText: "Dismiss",
      });
      expect(mockNotificationInstance.show).toHaveBeenCalled();
    });

    it("should handle urgency parameter", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showAskToEnter("device-1", "Test Device", "urgent");

      expect(Notification).toHaveBeenCalled();
      expect(mockNotificationInstance.show).toHaveBeenCalled();
    });

    it("should store notification reference", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showAskToEnter("device-1", "Test Device");

      expect(notificationService.hasActiveNotification("device-1")).toBe(true);
    });

    it("should handle errors gracefully", () => {
      const { Notification } = require("electron");
      mockNotification.mockImplementation(() => {
        throw new Error("Notification creation failed");
      });

      expect(() => {
        notificationService.showAskToEnter("device-1", "Test Device");
      }).not.toThrow();
    });
  });

  describe("handleNotificationAction()", () => {
    it("should handle Yes response correctly", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getDevices).mockResolvedValue([
        { id: "device-1", name: "Test Device", connected: true, battery: 100 },
      ]);

      // Create a notification first
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);
      notificationService.showAskToEnter("device-1", "Test Device");

      const emitSpy = vi.spyOn(notificationService, "emit");

      await notificationService["handleNotificationAction"]("device-1", 0);

      expect(emitSpy).toHaveBeenCalledWith("ask-to-enter-response", {
        deviceId: "device-1",
        response: "yes",
      });
    });

    it("should handle No response correctly", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getDevices).mockResolvedValue([
        { id: "device-1", name: "Test Device", connected: true, battery: 100 },
      ]);

      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);
      notificationService.showAskToEnter("device-1", "Test Device");

      const emitSpy = vi.spyOn(notificationService, "emit");

      await notificationService["handleNotificationAction"]("device-1", 1);

      expect(emitSpy).toHaveBeenCalledWith("ask-to-enter-response", {
        deviceId: "device-1",
        response: "no",
      });
    });

    it("should handle If Urgent response correctly", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getDevices).mockResolvedValue([
        { id: "device-1", name: "Test Device", connected: true, battery: 100 },
      ]);

      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);
      notificationService.showAskToEnter("device-1", "Test Device");

      const emitSpy = vi.spyOn(notificationService, "emit");

      await notificationService["handleNotificationAction"]("device-1", 2);

      expect(emitSpy).toHaveBeenCalledWith("ask-to-enter-response", {
        deviceId: "device-1",
        response: "if-urgent",
      });
    });

    it("should handle invalid action index", async () => {
      await notificationService["handleNotificationAction"]("device-1", 999);

      // Should not throw and should not emit any events
      expect(true).toBe(true);
    });

    it("should handle device not found", async () => {
      const { deviceManager } = await import("./deviceManager");
      vi.mocked(deviceManager.getDevices).mockResolvedValue([]);

      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);
      notificationService.showAskToEnter("device-1", "Test Device");

      const emitSpy = vi.spyOn(notificationService, "emit");

      await notificationService["handleNotificationAction"]("device-1", 0);

      // Should not emit any events if device not found
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe("closeAllNotifications()", () => {
    it("should close all active notifications", () => {
      const { Notification } = require("electron");
      const mockNotification1 = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      const mockNotification2 = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification
        .mockReturnValueOnce(mockNotification1)
        .mockReturnValueOnce(mockNotification2);

      notificationService.showAskToEnter("device-1", "Test Device 1");
      notificationService.showAskToEnter("device-2", "Test Device 2");

      notificationService.closeAllNotifications();

      expect(mockNotification1.close).toHaveBeenCalled();
      expect(mockNotification2.close).toHaveBeenCalled();
      expect(notificationService.getActiveNotificationCount()).toBe(0);
    });
  });

  describe("getActiveNotificationCount()", () => {
    it("should return correct count of active notifications", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      expect(notificationService.getActiveNotificationCount()).toBe(0);

      notificationService.showAskToEnter("device-1", "Test Device");

      expect(notificationService.getActiveNotificationCount()).toBe(1);
    });
  });

  describe("hasActiveNotification()", () => {
    it("should return true for device with active notification", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showAskToEnter("device-1", "Test Device");

      expect(notificationService.hasActiveNotification("device-1")).toBe(true);
      expect(notificationService.hasActiveNotification("device-2")).toBe(false);
    });
  });

  describe("showNotification()", () => {
    it("should show a general notification", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showNotification("Test Title", "Test Body");

      expect(Notification).toHaveBeenCalledWith({
        title: "Test Title",
        body: "Test Body",
        icon: undefined,
        silent: false,
        timeoutType: "default",
      });
      expect(mockNotificationInstance.show).toHaveBeenCalled();
    });

    it("should handle notification options", () => {
      const { Notification } = require("electron");
      const mockNotificationInstance = {
        show: vi.fn(),
        close: vi.fn(),
        on: vi.fn(),
      };
      mockNotification.mockReturnValue(mockNotificationInstance);

      notificationService.showNotification("Test Title", "Test Body", {
        icon: "test-icon.png",
        silent: true,
      });

      expect(Notification).toHaveBeenCalledWith({
        title: "Test Title",
        body: "Test Body",
        icon: "test-icon.png",
        silent: true,
        timeoutType: "default",
      });
    });

    it("should handle errors gracefully", () => {
      const { Notification } = require("electron");
      mockNotification.mockImplementation(() => {
        throw new Error("Notification creation failed");
      });

      expect(() => {
        notificationService.showNotification("Test Title", "Test Body");
      }).not.toThrow();
    });
  });
});
