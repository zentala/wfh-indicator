/**
 * Communication Types - Shared across all WFH Indicator components
 */

import { WorkStatus } from './workStatus';

/**
 * Base message interface for all WebSocket communications
 */
export interface BaseMessage {
  type: string;
  timestamp: number;
}

/**
 * Handshake message sent by device upon connection
 */
export interface HandshakeMessage extends BaseMessage {
  type: 'handshake';
  deviceId: string;
  token: string;
  apiVersion: string;
  deviceType: 'mobile' | 'led_ring' | 'smart_mirror';
  capabilities: CommunicationDeviceCapabilities;
}

/**
 * Device capabilities interface for communication
 */
export interface CommunicationDeviceCapabilities {
  display: boolean;
  button: boolean;
  battery: boolean;
  askToEnter: boolean;
  ledPatterns: string[];
}

/**
 * Status update message from tray app to device
 */
export interface StatusUpdateMessage extends BaseMessage {
  type: 'status_update';
  status: WorkStatus;
  duration?: number; // Optional duration in milliseconds
}

/**
 * Ask to enter request from device to tray app
 */
export interface AskToEnterRequestMessage extends BaseMessage {
  type: 'ask_to_enter';
  deviceId: string;
  urgency: 'normal' | 'urgent';
  message?: string; // Optional custom message
}

/**
 * Ask to enter response from tray app to device
 */
export interface AskToEnterResponseMessage extends BaseMessage {
  type: 'ask_to_enter_response';
  deviceId: string;
  response: 'yes' | 'no' | 'if_urgent';
  message?: string; // Optional response message
}

/**
 * Battery report message from device to tray app
 */
export interface BatteryReportMessage extends BaseMessage {
  type: 'battery_report';
  deviceId: string;
  level: number; // 0-100
  charging: boolean;
  estimatedTimeRemaining?: number; // Optional in minutes
}

/**
 * Device status message from device to tray app
 */
export interface DeviceStatusMessage extends BaseMessage {
  type: 'device_status';
  deviceId: string;
  connected: boolean;
  lastActivity: number;
  firmwareVersion?: string;
  hardwareVersion?: string;
}

/**
 * Error message for communication errors
 */
export interface ErrorMessage extends BaseMessage {
  type: 'error';
  code: string;
  message: string;
  details?: any;
}

/**
 * Heartbeat message for connection monitoring
 */
export interface HeartbeatMessage extends BaseMessage {
  type: 'heartbeat';
  deviceId: string;
}

/**
 * Union type for all possible WebSocket messages
 */
export type WebSocketMessage =
  | HandshakeMessage
  | StatusUpdateMessage
  | AskToEnterRequestMessage
  | AskToEnterResponseMessage
  | BatteryReportMessage
  | DeviceStatusMessage
  | ErrorMessage
  | HeartbeatMessage;

/**
 * Message type guards for type safety
 */
export const isHandshakeMessage = (message: any): message is HandshakeMessage =>
  message.type === 'handshake';

export const isStatusUpdateMessage = (message: any): message is StatusUpdateMessage =>
  message.type === 'status_update';

export const isAskToEnterRequestMessage = (message: any): message is AskToEnterRequestMessage =>
  message.type === 'ask_to_enter';

export const isAskToEnterResponseMessage = (message: any): message is AskToEnterResponseMessage =>
  message.type === 'ask_to_enter_response';

export const isBatteryReportMessage = (message: any): message is BatteryReportMessage =>
  message.type === 'battery_report';

export const isDeviceStatusMessage = (message: any): message is DeviceStatusMessage =>
  message.type === 'device_status';

export const isErrorMessage = (message: any): message is ErrorMessage =>
  message.type === 'error';

export const isHeartbeatMessage = (message: any): message is HeartbeatMessage =>
  message.type === 'heartbeat';

/**
 * Communication configuration
 */
export interface CommunicationConfig {
  heartbeatInterval: number; // milliseconds
  reconnectAttempts: number;
  reconnectDelay: number; // milliseconds
  messageTimeout: number; // milliseconds
}

/**
 * Default communication configuration
 */
export const DEFAULT_COMMUNICATION_CONFIG: CommunicationConfig = {
  heartbeatInterval: 30000, // 30 seconds
  reconnectAttempts: 5,
  reconnectDelay: 1000, // 1 second
  messageTimeout: 5000 // 5 seconds
};
