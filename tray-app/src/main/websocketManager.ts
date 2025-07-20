/**
 * WebSocket Manager for Tray App
 *
 * Handles WebSocket communication with WFH Indicator devices
 */

import { WebSocket, WebSocketServer } from "ws";
import { EventEmitter } from "events";
import log from "electron-log";
import {
  WebSocketMessage,
  HandshakeMessage,
  StatusUpdateMessage,
  AskToEnterRequestMessage,
  BatteryReportMessage,
  DeviceStatusMessage,
  HeartbeatMessage,
  DeviceType,
  WorkStatus,
} from "@wfh-indicator/domain";

/**
 * WebSocket Manager class
 */
export class WebSocketManager extends EventEmitter {
  private server?: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private port: number;
  private isRunning: boolean = false;

  constructor(port: number = 8080) {
    super();
    this.port = port;
  }

  /**
   * Start WebSocket server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      log.warn("WebSocketManager is already running");
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.server = new WebSocketServer({ port: this.port });

        this.server.on("listening", () => {
          log.info("WebSocket server started", { port: this.port });
          this.isRunning = true;
          resolve();
        });

        this.server.on("connection", (ws: WebSocket) => {
          this.handleConnection(ws);
        });

        this.server.on("error", (error) => {
          log.error("WebSocket server error", error);
          reject(error);
        });
      } catch (error) {
        log.error("Failed to start WebSocket server", error);
        reject(error);
      }
    });
  }

  /**
   * Stop WebSocket server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      log.warn("WebSocketManager is not running");
      return;
    }

    try {
      // Close all client connections
      this.clients.forEach((client) => {
        client.close();
      });
      this.clients.clear();

      // Close server
      if (this.server) {
        this.server.close();
        this.server = undefined;
      }

      this.isRunning = false;
      log.info("WebSocketManager stopped");
    } catch (error) {
      log.error("Failed to stop WebSocketManager", error);
      throw error;
    }
  }

  /**
   * Broadcast message to all connected devices
   */
  async broadcast(message: WebSocketMessage): Promise<void> {
    if (!this.isRunning) {
      log.warn("Cannot broadcast message - WebSocketManager not running");
      return;
    }

    const messageStr = JSON.stringify(message);
    log.debug("Broadcasting message", { message });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  /**
   * Send message to specific device
   */
  async sendToDevice(
    deviceId: string,
    message: WebSocketMessage
  ): Promise<void> {
    const client = this.clients.get(deviceId);
    if (client && client.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message);
      client.send(messageStr);
      log.debug("Sent message to device", { deviceId, message });
    } else {
      log.warn("Device not connected", { deviceId });
    }
  }

  /**
   * Get connected devices count
   */
  getConnectedDevicesCount(): number {
    return this.clients.size;
  }

  /**
   * Get connected device IDs
   */
  getConnectedDeviceIds(): string[] {
    return Array.from(this.clients.keys());
  }

  /**
   * Check if server is running
   */
  isServerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Handle new WebSocket connection
   */
  private handleConnection(ws: WebSocket): void {
    log.info("New device connected");

    let deviceId: string | null = null;

    // Handle incoming messages
    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as WebSocketMessage;
        log.debug("Received message", { message });

        // Handle handshake
        if (message.type === "handshake") {
          const handshake = message as HandshakeMessage;
          deviceId = handshake.deviceId;
          this.clients.set(deviceId, ws);

          log.info("Device handshake received", {
            deviceId,
            deviceType: handshake.deviceType,
            apiVersion: handshake.apiVersion,
          });

          // Emit device connected event
          this.emit("deviceConnected", {
            deviceId,
            deviceType: handshake.deviceType,
            capabilities: handshake.capabilities,
          });
        }

        // Handle other message types
        if (deviceId) {
          this.handleMessage(deviceId, message);
        }
      } catch (error) {
        log.error("Failed to parse message", error);
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      if (deviceId) {
        log.info("Device disconnected", { deviceId });
        this.clients.delete(deviceId);

        // Emit device disconnected event
        this.emit("deviceDisconnected", { deviceId });
      }
    });

    // Handle client errors
    ws.on("error", (error) => {
      log.error("Device connection error", { deviceId, error });
      if (deviceId) {
        this.clients.delete(deviceId);
        this.emit("deviceDisconnected", { deviceId });
      }
    });
  }

  /**
   * Handle incoming messages from devices
   */
  private handleMessage(deviceId: string, message: WebSocketMessage): void {
    switch (message.type) {
      case "ask_to_enter":
        this.handleAskToEnterRequest(
          deviceId,
          message as AskToEnterRequestMessage
        );
        break;

      case "battery_report":
        this.handleBatteryReport(deviceId, message as BatteryReportMessage);
        break;

      case "device_status":
        this.handleDeviceStatus(deviceId, message as DeviceStatusMessage);
        break;

      case "heartbeat":
        this.handleHeartbeat(deviceId, message as HeartbeatMessage);
        break;

      default:
        log.warn("Unknown message type", { deviceId, type: message.type });
    }
  }

  /**
   * Handle ask to enter request
   */
  private handleAskToEnterRequest(
    deviceId: string,
    message: AskToEnterRequestMessage
  ): void {
    log.info("Ask to enter request received", {
      deviceId,
      urgency: message.urgency,
    });

    // Emit event for notification service
    this.emit("askToEnterRequest", {
      deviceId,
      urgency: message.urgency,
      message: message.message,
      timestamp: message.timestamp,
    });
  }

  /**
   * Handle battery report
   */
  private handleBatteryReport(
    deviceId: string,
    message: BatteryReportMessage
  ): void {
    log.debug("Battery report received", {
      deviceId,
      level: message.level,
      charging: message.charging,
    });

    // Emit event for device manager
    this.emit("batteryReport", {
      deviceId,
      level: message.level,
      charging: message.charging,
      estimatedTimeRemaining: message.estimatedTimeRemaining,
      timestamp: message.timestamp,
    });
  }

  /**
   * Handle device status update
   */
  private handleDeviceStatus(
    deviceId: string,
    message: DeviceStatusMessage
  ): void {
    log.debug("Device status received", {
      deviceId,
      connected: message.connected,
      lastActivity: message.lastActivity,
    });

    // Emit event for device manager
    this.emit("deviceStatus", {
      deviceId,
      connected: message.connected,
      lastActivity: message.lastActivity,
      firmwareVersion: message.firmwareVersion,
      hardwareVersion: message.hardwareVersion,
      timestamp: message.timestamp,
    });
  }

  /**
   * Handle heartbeat
   */
  private handleHeartbeat(deviceId: string, message: HeartbeatMessage): void {
    log.debug("Heartbeat received", { deviceId });

    // Emit event for connection monitoring
    this.emit("heartbeat", {
      deviceId,
      timestamp: message.timestamp,
    });
  }

  /**
   * Send status update to all devices
   */
  async broadcastStatusUpdate(status: WorkStatus): Promise<void> {
    const message: StatusUpdateMessage = {
      type: "status_update",
      status,
      timestamp: Date.now(),
    };

    await this.broadcast(message);
  }

  /**
   * Send ask to enter response to specific device
   */
  async sendAskToEnterResponse(
    deviceId: string,
    response: "yes" | "no" | "if_urgent",
    message?: string
  ): Promise<void> {
    const responseMessage = {
      type: "ask_to_enter_response" as const,
      deviceId,
      response,
      message,
      timestamp: Date.now(),
    };

    await this.sendToDevice(deviceId, responseMessage);
  }
}
