/**
 * Device Types - Shared across all WFH Indicator components
 */

import { WorkStatus } from './workStatus';

/**
 * Device types supported by WFH Indicator
 */
export enum DeviceType {
  MOBILE = 'mobile',           // React Native app on smartphone
  LED_RING = 'led_ring',       // ESP32 + WS2812B LED ring
  SMART_MIRROR = 'smart_mirror' // Home Assistant integration
}

/**
 * Device status information
 */
export interface DeviceStatus {
  deviceId: string;
  deviceType: DeviceType;
  connected: boolean;
  batteryLevel: number; // 0-100
  charging: boolean;
  lastActivity: Date;
  firmwareVersion?: string;
  hardwareVersion?: string;
  capabilities: DeviceCapabilities;
}

/**
 * Device capabilities
 */
export interface DeviceCapabilities {
  display: boolean;           // Can display status
  button: boolean;            // Has physical button
  battery: boolean;           // Has battery monitoring
  askToEnter: boolean;        // Can send ask to enter requests
  ledPatterns: string[];      // Supported LED patterns
  touch: boolean;             // Has touch interface
  wifi: boolean;              // Has WiFi connectivity
  bluetooth: boolean;         // Has Bluetooth connectivity
}

/**
 * LED pattern types
 */
export enum LEDPatternType {
  SOLID = 'solid',
  BREATHING = 'breathing',
  PULSE = 'pulse',
  BLINK = 'blink',
  FADE = 'fade',
  RAINBOW = 'rainbow'
}

/**
 * LED pattern configuration
 */
export interface LEDPattern {
  type: LEDPatternType;
  color: string;              // HEX color
  brightness: number;         // 0-100
  speed?: number;             // Animation speed in ms
  duration?: number;          // Pattern duration in ms
}

/**
 * Button press types
 */
export enum ButtonPressType {
  SINGLE = 'single',
  DOUBLE = 'double',
  LONG = 'long',
  TRIPLE = 'triple'
}

/**
 * Button configuration
 */
export interface ButtonConfig {
  debounceTime: number;       // Debounce time in ms
  longPressTime: number;      // Long press threshold in ms
  doublePressTime: number;    // Double press window in ms
}

/**
 * Device configuration
 */
export interface DeviceConfig {
  deviceId: string;
  deviceType: DeviceType;
  port?: number;              // WebSocket port
  serialPort?: string;        // Serial port path
  testMode?: boolean;         // Test mode flag
  debug?: boolean;            // Debug mode flag
  batteryLevel?: number;      // Initial battery level
  charging?: boolean;         // Charging state
  ledConfig?: LEDConfig;
  buttonConfig?: ButtonConfig;
}

/**
 * LED configuration
 */
export interface LEDConfig {
  defaultBrightness: number;  // Default brightness (0-100)
  animationSpeed: number;     // Default animation speed in ms
  patterns: LEDPattern[];     // Available patterns
}

/**
 * Default device configurations
 */
export const DEFAULT_LED_CONFIG: LEDConfig = {
  defaultBrightness: 80,
  animationSpeed: 1000,
  patterns: [
    { type: LEDPatternType.SOLID, color: '#00FF00', brightness: 80 },
    { type: LEDPatternType.BREATHING, color: '#00FF00', brightness: 80, speed: 2000 },
    { type: LEDPatternType.PULSE, color: '#00FF00', brightness: 80, speed: 500 },
    { type: LEDPatternType.BLINK, color: '#00FF00', brightness: 80, speed: 1000 }
  ]
};

export const DEFAULT_BUTTON_CONFIG: ButtonConfig = {
  debounceTime: 200,
  longPressTime: 2000,
  doublePressTime: 500
};

/**
 * Device capabilities by type
 */
export const DEVICE_CAPABILITIES: Record<DeviceType, DeviceCapabilities> = {
  [DeviceType.MOBILE]: {
    display: true,
    button: false,
    battery: true,
    askToEnter: true,
    ledPatterns: ['solid', 'breathing', 'pulse', 'blink'],
    touch: true,
    wifi: true,
    bluetooth: true
  },
  [DeviceType.LED_RING]: {
    display: true,
    button: true,
    battery: true,
    askToEnter: true,
    ledPatterns: ['solid', 'breathing', 'pulse', 'blink', 'fade'],
    touch: false,
    wifi: true,
    bluetooth: false
  },
  [DeviceType.SMART_MIRROR]: {
    display: true,
    button: false,
    battery: false,
    askToEnter: false,
    ledPatterns: ['solid'],
    touch: false,
    wifi: true,
    bluetooth: false
  }
};

/**
 * Get device capabilities for a specific device type
 */
export function getDeviceCapabilities(deviceType: DeviceType): DeviceCapabilities {
  return DEVICE_CAPABILITIES[deviceType];
}

/**
 * Check if device supports a specific capability
 */
export function hasCapability(deviceType: DeviceType, capability: keyof DeviceCapabilities): boolean {
  const capabilities = getDeviceCapabilities(deviceType);
  const value = capabilities[capability];
  return typeof value === 'boolean' ? value : value.length > 0;
}
