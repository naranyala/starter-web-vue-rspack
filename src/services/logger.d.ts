// Type declarations for logger.js
declare class Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  getLogs(): Array<{
    timestamp: string;
    level: string;
    message: string;
    meta: Record<string, unknown>;
    id: number;
  }>;
  clearLogs(): void;
  setLogLevel(level: string): void;
  getLogLevel(): string;
}

declare const logger: Logger;
export default logger;
