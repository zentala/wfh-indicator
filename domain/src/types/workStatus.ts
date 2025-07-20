/**
 * Work Status Types - Shared across all WFH Indicator components
 */

/**
 * Work status values representing different availability states
 */
export enum WorkStatus {
  ON_CALL = 'ON_CALL',           // 🔴 Audio/video calls - do not disturb
  VIDEO_CALL = 'VIDEO_CALL',      // 🟠 Video calls only - do not enter
  FOCUSED = 'FOCUSED',           // 🟡 Deep work - interrupt only if urgent
  AVAILABLE = 'AVAILABLE',        // 🟢 Available - come on in
  AWAY = 'AWAY',                 // 🔵 Not at desk
  MEETING_SOON = 'MEETING_SOON', // ⏰ Meeting starting soon (5 min countdown)
  OFFLINE = 'OFFLINE'            // ⚫ Device offline/unavailable
}

/**
 * Color mapping for each work status
 */
export const WORK_STATUS_COLORS: Record<WorkStatus, string> = {
  [WorkStatus.ON_CALL]: '#FF0000',      // Red
  [WorkStatus.VIDEO_CALL]: '#FF8C00',   // Orange
  [WorkStatus.FOCUSED]: '#FFD700',      // Yellow
  [WorkStatus.AVAILABLE]: '#00FF00',    // Green
  [WorkStatus.AWAY]: '#0080FF',         // Blue
  [WorkStatus.MEETING_SOON]: '#FFA500', // Orange (blinking)
  [WorkStatus.OFFLINE]: '#808080'       // Gray
};

/**
 * Emoji mapping for each work status
 */
export const WORK_STATUS_EMOJIS: Record<WorkStatus, string> = {
  [WorkStatus.ON_CALL]: '🔴',
  [WorkStatus.VIDEO_CALL]: '🟠',
  [WorkStatus.FOCUSED]: '🟡',
  [WorkStatus.AVAILABLE]: '🟢',
  [WorkStatus.AWAY]: '🔵',
  [WorkStatus.MEETING_SOON]: '⏰',
  [WorkStatus.OFFLINE]: '⚫'
};

/**
 * Description mapping for each work status
 */
export const WORK_STATUS_DESCRIPTIONS: Record<WorkStatus, string> = {
  [WorkStatus.ON_CALL]: 'On call - do not disturb',
  [WorkStatus.VIDEO_CALL]: 'Video call - do not enter',
  [WorkStatus.FOCUSED]: 'Focused work - interrupt only if urgent',
  [WorkStatus.AVAILABLE]: 'Available - come on in',
  [WorkStatus.AWAY]: 'Away from desk',
  [WorkStatus.MEETING_SOON]: 'Meeting starting soon',
  [WorkStatus.OFFLINE]: 'Device offline'
};

/**
 * Interface for work status with metadata
 */
export interface WorkStatusInfo {
  status: WorkStatus;
  color: string;
  emoji: string;
  description: string;
  timestamp: number;
  duration?: number; // Optional duration in milliseconds
}

/**
 * Get complete work status information
 */
export function getWorkStatusInfo(status: WorkStatus): WorkStatusInfo {
  return {
    status,
    color: WORK_STATUS_COLORS[status],
    emoji: WORK_STATUS_EMOJIS[status],
    description: WORK_STATUS_DESCRIPTIONS[status],
    timestamp: Date.now()
  };
}

/**
 * Check if status indicates "do not disturb"
 */
export function isDoNotDisturb(status: WorkStatus): boolean {
  return status === WorkStatus.ON_CALL || status === WorkStatus.VIDEO_CALL;
}

/**
 * Check if status indicates "available for interaction"
 */
export function isAvailable(status: WorkStatus): boolean {
  return status === WorkStatus.AVAILABLE;
}

/**
 * Check if status indicates "focused work"
 */
export function isFocused(status: WorkStatus): boolean {
  return status === WorkStatus.FOCUSED;
}
