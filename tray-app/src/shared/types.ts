// src/shared/types.ts

/**
 * Defines the possible work statuses for the user.
 */
export type WorkStatus =
  | "ON_CALL"
  | "VIDEO_CALL"
  | "FOCUSED"
  | "AVAILABLE"
  | "AWAY"
  | "OFFLINE";

/**
 * Represents a single paired indicator device.
 */
export interface DeviceInfo {
  id: string; // Unique device identifier (e.g., serial number)
  name: string; // User-defined name (e.g., "Office Door")
  connected: boolean; // Connection status (online/offline)
  battery: number; // Battery level in percentage (0-100)
}

/**
 * Defines the structure of a single schedule rule.
 */
export interface ScheduleRule {
  id: string; // Unique rule identifier
  days: (1 | 2 | 3 | 4 | 5 | 6 | 7)[]; // Days of the week (1=Monday, 7=Sunday)
  startTime: string; // Start time in "HH:mm" format
  endTime: string; // End time in "HH:mm" format
  status: WorkStatus; // Status to set
  enabled: boolean; // Is the rule active
}
