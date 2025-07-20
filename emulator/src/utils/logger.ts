/**
 * Simple Logger Utility
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
}

/**
 * Logger class
 */
export class Logger {
  private debugMode: boolean;
  private logLevel: LogLevel;

  constructor(debug: boolean = false) {
    this.debugMode = debug;
    this.logLevel = debug ? LogLevel.DEBUG : LogLevel.INFO;
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      this.log(LogLevel.ERROR, message, error);
    }
  }

  /**
   * Check if should log at given level
   */
  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  /**
   * Log message
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level];

    let logMessage = `[${timestamp}] [${levelStr}] ${message}`;

    if (data) {
      if (data instanceof Error) {
        logMessage += `\n${data.stack || data.message}`;
      } else {
        logMessage += `\n${JSON.stringify(data, null, 2)}`;
      }
    }

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
    }
  }
}
