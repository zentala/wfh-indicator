/**
 * Tray App Device Types
 *
 * Local types that extend domain types for tray-app specific functionality
 */

import { DeviceStatus, DeviceType, WorkStatus } from "@wfh-indicator/domain";

/**
 * Extended device info for tray-app
 * Adds user-friendly name and other tray-app specific fields
 */
export interface TrayDeviceInfo extends DeviceStatus {
  name: string; // User-defined name (e.g., "Office Door")
  location?: string; // Optional location description
  notes?: string; // Optional user notes
}

/**
 * Schedule rule for automatic status changes
 */
export interface ScheduleRule {
  id: string;
  days: (1 | 2 | 3 | 4 | 5 | 6 | 7)[]; // Days of the week (1=Monday, 7=Sunday)
  startTime: string; // Start time in "HH:mm" format
  endTime: string; // End time in "HH:mm" format
  status: WorkStatus; // Work status to set
  enabled: boolean; // Is the rule active
}

/**
 * Device pairing information
 */
export interface DevicePairingInfo {
  ssid: string;
  password: string;
  deviceType: DeviceType;
  deviceName: string;
}

/**
 * Device connection status
 */
export interface DeviceConnectionStatus {
  deviceId: string;
  connected: boolean;
  lastSeen: Date;
  batteryLevel: number;
  charging: boolean;
}

/**
 * Ask to enter request from device
 */
export interface AskToEnterRequest {
  deviceId: string;
  deviceName: string;
  urgency: "normal" | "urgent";
  message?: string;
  timestamp: number;
}

/**
 * Ask to enter response from user
 */
export interface AskToEnterResponse {
  deviceId: string;
  response: "yes" | "no" | "if_urgent";
  message?: string;
  timestamp: number;
}
