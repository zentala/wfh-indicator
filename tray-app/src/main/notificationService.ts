import { Notification } from "electron";
import { EventEmitter } from "events";
import { deviceManager } from "./deviceManager";
import log from "electron-log";

/**
 * Service responsible for handling system notifications, particularly "Ask to Enter" requests.
 * Manages notification display, user interactions, and communication with devices.
 */
class NotificationService extends EventEmitter {
  private activeNotifications: Map<string, Notification> = new Map();

  /**
   * Shows an "Ask to Enter" notification from a device.
   * @param deviceId The ID of the device requesting entry
   * @param deviceName The name of the device (for display)
   * @param urgency The urgency level of the request
   */
  public showAskToEnter(
    deviceId: string,
    deviceName: string,
    urgency: "normal" | "urgent" = "normal"
  ): void {
    try {
      log.info(
        `Showing "Ask to Enter" notification from device: ${deviceName} (${deviceId})`
      );

      // Create notification
      const notification = new Notification({
        title: "Ask to Enter",
        body: `${deviceName} is requesting to enter your workspace.`,
        icon: undefined, // Will use app icon
        silent: false,
        timeoutType: "default",
        actions: [
          {
            type: "button",
            text: "Yes",
          },
          {
            type: "button",
            text: "No",
          },
          {
            type: "button",
            text: "If Urgent",
          },
        ],
        closeButtonText: "Dismiss",
      });

      // Store notification reference
      this.activeNotifications.set(deviceId, notification);

      // Handle notification actions
      notification.on("action", (event, index) => {
        this.handleNotificationAction(deviceId, index);
      });

      // Handle notification close
      notification.on("close", () => {
        this.activeNotifications.delete(deviceId);
        log.debug(`Notification closed for device: ${deviceId}`);
      });

      // Show the notification
      notification.show();

      log.info(
        `"Ask to Enter" notification displayed for device: ${deviceName}`
      );
    } catch (error) {
      log.error("Failed to show Ask to Enter notification:", error);
    }
  }

  /**
   * Handles user interaction with notification buttons.
   * @param deviceId The ID of the device that sent the request
   * @param actionIndex The index of the action button clicked (0=Yes, 1=No, 2=If Urgent)
   */
  private async handleNotificationAction(
    deviceId: string,
    actionIndex: number
  ): Promise<void> {
    try {
      const devices = await deviceManager.getDevices();
      const device = devices.find((d) => d.id === deviceId);

      if (!device) {
        log.warn(`Device ${deviceId} not found, ignoring notification action.`);
        const notification = this.activeNotifications.get(deviceId);
        if (notification) {
          notification.close();
          this.activeNotifications.delete(deviceId);
        }
        return;
      }

      const responses = ["yes", "no", "if-urgent"] as const;
      const response = responses[actionIndex];

      if (!response) {
        log.warn(`Invalid action index: ${actionIndex}`);
        return;
      }

      log.info(
        `User responded to "Ask to Enter" from device ${deviceId}: ${response}`
      );

      // Send response to device
      await this.sendResponseToDevice(deviceId, response);

      // Close the notification
      const notification = this.activeNotifications.get(deviceId);
      if (notification) {
        notification.close();
        this.activeNotifications.delete(deviceId);
      }

      // Emit event for other parts of the app
      this.emit("ask-to-enter-response", { deviceId, response });
    } catch (error) {
      log.error("Failed to handle notification action:", error);
    }
  }

  /**
   * Sends a response back to the requesting device.
   * @param deviceId The ID of the device to send the response to
   * @param response The user's response ("yes", "no", "if-urgent")
   */
  private async sendResponseToDevice(
    deviceId: string,
    response: string
  ): Promise<void> {
    try {
      log.info(`Sending response to device ${deviceId}: ${response}`);

      // Get device information
      const devices = await deviceManager.getDevices();
      const device = devices.find((d) => d.id === deviceId);

      if (!device) {
        log.warn(`Device ${deviceId} not found in paired devices`);
        return;
      }

      // In a real implementation, this would send the response via WebSocket or HTTP
      // to the device. For now, we'll log the action.
      log.info(`Response sent to device ${device.name}: ${response}`);

      // TODO: Implement actual device communication
      // This would typically involve:
      // 1. Finding the device's IP address
      // 2. Sending HTTP POST or WebSocket message
      // 3. Handling any communication errors
    } catch (error) {
      log.error(`Failed to send response to device ${deviceId}:`, error);
    }
  }

  /**
   * Closes all active notifications.
   * Useful when the app is shutting down.
   */
  public closeAllNotifications(): void {
    log.info("Closing all active notifications");

    this.activeNotifications.forEach((notification, deviceId) => {
      notification.close();
      log.debug(`Closed notification for device: ${deviceId}`);
    });

    this.activeNotifications.clear();
  }

  /**
   * Gets the number of active notifications.
   * @returns The number of currently active notifications
   */
  public getActiveNotificationCount(): number {
    return this.activeNotifications.size;
  }

  /**
   * Checks if a device has an active notification.
   * @param deviceId The device ID to check
   * @returns True if the device has an active notification
   */
  public hasActiveNotification(deviceId: string): boolean {
    return this.activeNotifications.has(deviceId);
  }

  /**
   * Shows a general system notification.
   * @param title The notification title
   * @param body The notification body text
   * @param options Additional notification options
   */
  public showNotification(
    title: string,
    body: string,
    options: {
      icon?: string;
      silent?: boolean;
      timeoutType?: "default" | "never";
      actions?: Array<{ type: "button"; text: string }>;
    } = {}
  ): void {
    try {
      const notification = new Notification({
        title,
        body,
        icon: options.icon,
        silent: options.silent ?? false,
        timeoutType: options.timeoutType ?? "default",
        actions: options.actions,
      });

      notification.show();
      log.info(`General notification shown: ${title}`);
    } catch (error) {
      log.error("Failed to show general notification:", error);
    }
  }
}

export { NotificationService };
export const notificationService = new NotificationService();
