/**
 * WiFi Manager - Handles WebSocket communication with tray app
 */

import WebSocket from "isomorphic-ws";
import { Logger } from "../utils/logger";
import {
  WebSocketMessage,
  HandshakeMessage,
  StatusUpdateMessage,
  AskToEnterRequestMessage,
  BatteryReportMessage,
  DeviceStatusMessage,
  HeartbeatMessage,
  CommunicationConfig,
  DEFAULT_COMMUNICATION_CONFIG,
} from "@wfh-indicator/domain";

/**
 * WiFi Manager class
 */
export class WiFiManager {
  private server?: WebSocket.Server;
  private clients: Set<WebSocket> = new Set();
  private port: number;
  private logger: Logger;
  private config: CommunicationConfig;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private heartbeatInterval?: NodeJS.Timeout;
  private isRunning: boolean = false;

  constructor(port: number, logger: Logger, config?: CommunicationConfig) {
    this.port = port;
    this.logger = logger;
    this.config = config || DEFAULT_COMMUNICATION_CONFIG;
  }

  /**
   * Start WebSocket server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn("WiFiManager is already running");
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.server = new WebSocket.Server({ port: this.port });

        this.server.on("listening", () => {
          this.logger.info("WebSocket server started", { port: this.port });
          this.isRunning = true;
          this.startHeartbeat();
          resolve();
        });

        this.server.on("connection", (ws: WebSocket) => {
          this.handleConnection(ws);
        });

        this.server.on("error", (error: Error) => {
          this.logger.error("WebSocket server error", error);
          reject(error);
        });
      } catch (error) {
        this.logger.error("Failed to start WebSocket server", error);
        reject(error);
      }
    });
  }

  /**
   * Stop WebSocket server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn("WiFiManager is not running");
      return;
    }

    try {
      // Stop heartbeat
      this.stopHeartbeat();

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
      this.logger.info("WiFiManager stopped");
    } catch (error) {
      this.logger.error("Failed to stop WiFiManager", error);
      throw error;
    }
  }

  /**
   * Send message to all connected clients
   */
  sendMessage(message: WebSocketMessage): void {
    if (!this.isRunning) {
      this.logger.warn("Cannot send message - WiFiManager not running");
      return;
    }

    const messageStr = JSON.stringify(message);
    this.logger.debug("Sending message", { message });

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }

  /**
   * Send message to specific client
   */
  sendToClient(client: WebSocket, message: WebSocketMessage): void {
    if (client.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message);
      client.send(messageStr);
      this.logger.debug("Sent message to client", { message });
    }
  }

  /**
   * Register message handler
   */
  onMessage(handler: (message: WebSocketMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Get connected clients count
   */
  getConnectedClientsCount(): number {
    return this.clients.size;
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
    this.logger.info("New client connected");
    this.clients.add(ws);

    // Send handshake request
    const handshake: HandshakeMessage = {
      type: "handshake",
      deviceId: "mock-device-1",
      token: "mock-token-123",
      apiVersion: "1.0",
      deviceType: "led_ring",
      capabilities: {
        display: true,
        button: true,
        battery: true,
        askToEnter: true,
        ledPatterns: ["solid", "breathing", "pulse", "blink"],
      },
      timestamp: Date.now(),
    };

    this.sendToClient(ws, handshake);

    // Handle incoming messages
    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString()) as WebSocketMessage;
        this.logger.debug("Received message", { message });

        // Notify all message handlers
        this.messageHandlers.forEach((handler) => {
          handler(message);
        });
      } catch (error) {
        this.logger.error("Failed to parse message", error);
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      this.logger.info("Client disconnected");
      this.clients.delete(ws);
    });

    // Handle client errors
    ws.on("error", (error: Error) => {
      this.logger.error("Client error", error);
      this.clients.delete(ws);
    });
  }

  /**
   * Start heartbeat to keep connections alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isRunning) {
        this.stopHeartbeat();
        return;
      }

      const heartbeat: HeartbeatMessage = {
        type: "heartbeat",
        deviceId: "mock-device-1",
        timestamp: Date.now(),
      };

      this.sendMessage(heartbeat);
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = undefined;
    }
  }
}
