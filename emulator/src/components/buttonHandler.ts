/**
 * Button Handler - Simulates physical button behavior
 */

import { ButtonConfig, ButtonPressType, DEFAULT_BUTTON_CONFIG } from '@wfh-indicator/domain';
import { Logger } from '../utils/logger';

/**
 * Button Handler class
 */
export class ButtonHandler {
  private config: ButtonConfig;
  private logger: Logger;
  private pressCallback?: (type: string) => void;
  private pressTimeout?: NodeJS.Timeout;
  private pressCount: number = 0;
  private lastPressTime: number = 0;
  private longPressTimeout?: NodeJS.Timeout;
  private isLongPressActive: boolean = false;

  constructor(config?: ButtonConfig, logger?: Logger) {
    this.config = config || DEFAULT_BUTTON_CONFIG;
    this.logger = logger || new Logger();
  }

  /**
   * Handle button press
   */
  handlePress(type: ButtonPressType): void {
    const now = Date.now();
    this.logger.debug('Button press detected', { type, timestamp: now });

    switch (type) {
      case ButtonPressType.SINGLE:
        this.handleSinglePress(now);
        break;
      case ButtonPressType.DOUBLE:
        this.handleDoublePress(now);
        break;
      case ButtonPressType.LONG:
        this.handleLongPress(now);
        break;
      case ButtonPressType.TRIPLE:
        this.handleTriplePress(now);
        break;
      default:
        this.logger.warn('Unknown button press type', { type });
    }
  }

  /**
   * Set press callback
   */
  setPressCallback(callback: (type: string) => void): void {
    this.pressCallback = callback;
  }

  /**
   * Handle single press
   */
  private handleSinglePress(timestamp: number): void {
    // Clear existing timeouts
    this.clearTimeouts();

    // Check for double press
    if (timestamp - this.lastPressTime < this.config.doublePressTime) {
      this.pressCount++;

      if (this.pressCount === 2) {
        this.triggerCallback('double');
        this.pressCount = 0;
        return;
      }
    } else {
      this.pressCount = 1;
    }

    this.lastPressTime = timestamp;

    // Set timeout for single press
    this.pressTimeout = setTimeout(() => {
      if (this.pressCount === 1) {
        this.triggerCallback('single');
      }
      this.pressCount = 0;
    }, this.config.doublePressTime);

    // Set timeout for long press
    this.longPressTimeout = setTimeout(() => {
      if (this.pressCount === 1) {
        this.isLongPressActive = true;
        this.triggerCallback('long');
      }
    }, this.config.longPressTime);
  }

  /**
   * Handle double press
   */
  private handleDoublePress(timestamp: number): void {
    this.clearTimeouts();
    this.pressCount = 2;
    this.lastPressTime = timestamp;
    this.triggerCallback('double');
    this.pressCount = 0;
  }

  /**
   * Handle long press
   */
  private handleLongPress(timestamp: number): void {
    this.clearTimeouts();
    this.isLongPressActive = true;
    this.lastPressTime = timestamp;
    this.triggerCallback('long');
  }

  /**
   * Handle triple press
   */
  private handleTriplePress(timestamp: number): void {
    this.clearTimeouts();
    this.pressCount = 3;
    this.lastPressTime = timestamp;
    this.triggerCallback('triple');
    this.pressCount = 0;
  }

  /**
   * Clear all timeouts
   */
  private clearTimeouts(): void {
    if (this.pressTimeout) {
      clearTimeout(this.pressTimeout);
      this.pressTimeout = undefined;
    }
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = undefined;
    }
  }

  /**
   * Trigger callback if set
   */
  private triggerCallback(type: string): void {
    if (this.pressCallback) {
      this.logger.debug('Triggering button callback', { type });
      this.pressCallback(type);
    } else {
      this.logger.warn('No button callback set');
    }
  }

  /**
   * Reset button state
   */
  reset(): void {
    this.clearTimeouts();
    this.pressCount = 0;
    this.lastPressTime = 0;
    this.isLongPressActive = false;
    this.logger.debug('Button handler reset');
  }

  /**
   * Get current button state
   */
  getState(): {
    pressCount: number;
    lastPressTime: number;
    isLongPressActive: boolean;
  } {
    return {
      pressCount: this.pressCount,
      lastPressTime: this.lastPressTime,
      isLongPressActive: this.isLongPressActive
    };
  }
}
