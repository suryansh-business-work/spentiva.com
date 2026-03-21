type LogLevel = 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  info: 0,
  warn: 1,
  error: 2,
};

const currentLevel: LogLevel = __DEV__ ? 'info' : 'error';

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatMessage = (level: LogLevel, message: string, data?: unknown): string => {
  const timestamp = new Date().toISOString();
  const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataStr}`;
};

export const logger = {
  info: (message: string, data?: unknown): void => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message, data));
    }
  },

  warn: (message: string, data?: unknown): void => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, data));
    }
  },

  error: (message: string, data?: unknown): void => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message, data));
    }
  },
};
