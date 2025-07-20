/**
 * LED Controller - Simulates WS2812B LED ring behavior
 */

import { LEDConfig, LEDPattern, LEDPatternType, DEFAULT_LED_CONFIG } from '@wfh-indicator/domain';

/**
 * LED status interface
 */
export interface LEDStatus {
  color: string;
  brightness: number;
  pattern: LEDPattern;
  animated: boolean;
  isOn: boolean;
}

/**
 * LED Controller class
 */
export class LEDController {
  private currentColor: string = '#00FF00';
  private brightness: number = 80;
  private pattern: LEDPattern;
  private animated: boolean = false;
  private isOn: boolean = true;
  private animationInterval?: NodeJS.Timeout;
  private config: LEDConfig;

  constructor(config?: LEDConfig) {
    this.config = config || DEFAULT_LED_CONFIG;
    this.pattern = {
      type: LEDPatternType.SOLID,
      color: this.currentColor,
      brightness: this.brightness
    };
  }

  /**
   * Set LED color
   */
  setColor(color: string): void {
    this.currentColor = color;
    this.pattern.color = color;
    this.logStatus('Color set', { color });
  }

  /**
   * Set LED brightness (0-100)
   */
  setBrightness(level: number): void {
    if (level < 0 || level > 100) {
      throw new Error('Brightness must be between 0 and 100');
    }

    this.brightness = level;
    this.pattern.brightness = level;
    this.logStatus('Brightness set', { level });
  }

  /**
   * Set LED pattern
   */
  setPattern(pattern: LEDPattern): void {
    this.pattern = pattern;
    this.currentColor = pattern.color;
    this.brightness = pattern.brightness;

    // Stop current animation
    this.stopAnimation();

    // Start new animation if needed
    if (pattern.type !== LEDPatternType.SOLID) {
      this.startAnimation(pattern);
    }

    this.logStatus('Pattern set', { pattern });
  }

  /**
   * Turn LED on
   */
  turnOn(): void {
    this.isOn = true;
    this.logStatus('LED turned on');
  }

  /**
   * Turn LED off
   */
  turnOff(): void {
    this.isOn = false;
    this.stopAnimation();
    this.logStatus('LED turned off');
  }

  /**
   * Toggle LED state
   */
  toggle(): void {
    this.isOn = !this.isOn;
    if (!this.isOn) {
      this.stopAnimation();
    }
    this.logStatus('LED toggled', { isOn: this.isOn });
  }

  /**
   * Get current LED status
   */
  getStatus(): LEDStatus {
    return {
      color: this.currentColor,
      brightness: this.brightness,
      pattern: this.pattern,
      animated: this.animated,
      isOn: this.isOn
    };
  }

  /**
   * Start LED animation
   */
  private startAnimation(pattern: LEDPattern): void {
    this.stopAnimation();
    this.animated = true;

    switch (pattern.type) {
      case LEDPatternType.BREATHING:
        this.startBreathingAnimation(pattern);
        break;
      case LEDPatternType.PULSE:
        this.startPulseAnimation(pattern);
        break;
      case LEDPatternType.BLINK:
        this.startBlinkAnimation(pattern);
        break;
      case LEDPatternType.FADE:
        this.startFadeAnimation(pattern);
        break;
      default:
        this.animated = false;
    }
  }

  /**
   * Stop LED animation
   */
  private stopAnimation(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = undefined;
    }
    this.animated = false;
  }

  /**
   * Start breathing animation
   */
  private startBreathingAnimation(pattern: LEDPattern): void {
    let direction = -1;
    let currentBrightness = pattern.brightness;
    const speed = pattern.speed || 2000;
    const step = 2;

    this.animationInterval = setInterval(() => {
      currentBrightness += direction * step;

      if (currentBrightness <= 10) {
        direction = 1;
        currentBrightness = 10;
      } else if (currentBrightness >= pattern.brightness) {
        direction = -1;
        currentBrightness = pattern.brightness;
      }

      this.brightness = currentBrightness;
    }, speed / 100);
  }

  /**
   * Start pulse animation
   */
  private startPulseAnimation(pattern: LEDPattern): void {
    let isOn = true;
    const speed = pattern.speed || 500;

    this.animationInterval = setInterval(() => {
      isOn = !isOn;
      this.brightness = isOn ? pattern.brightness : 0;
    }, speed);
  }

  /**
   * Start blink animation
   */
  private startBlinkAnimation(pattern: LEDPattern): void {
    let isOn = true;
    const speed = pattern.speed || 1000;

    this.animationInterval = setInterval(() => {
      isOn = !isOn;
      this.brightness = isOn ? pattern.brightness : 0;
    }, speed);
  }

  /**
   * Start fade animation
   */
  private startFadeAnimation(pattern: LEDPattern): void {
    let currentBrightness = 0;
    const targetBrightness = pattern.brightness;
    const speed = pattern.speed || 1000;
    const step = targetBrightness / (speed / 50);

    this.animationInterval = setInterval(() => {
      currentBrightness = Math.min(targetBrightness, currentBrightness + step);
      this.brightness = currentBrightness;

      if (currentBrightness >= targetBrightness) {
        this.stopAnimation();
      }
    }, 50);
  }

  /**
   * Log LED status changes
   */
  private logStatus(message: string, data?: any): void {
    // In a real implementation, this would use a proper logger
    if (process.env.MOCK_DEBUG === 'true') {
      console.log(`[LEDController] ${message}`, data || '');
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopAnimation();
  }
}
