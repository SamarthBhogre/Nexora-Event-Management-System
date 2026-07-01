type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const getLogLevel = (): LogLevel => {
  const level = process.env.LOG_LEVEL as LogLevel || 'info';
  return level;
};

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getLogLevel();
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
};

const formatTime = (): string => {
  return new Date().toISOString();
};

const log = (level: LogLevel, message: string, data?: any): void => {
  if (!shouldLog(level)) return;

  const time = formatTime();
  const colorMap: Record<LogLevel, string> = {
    debug: COLORS.dim,
    info: COLORS.cyan,
    warn: COLORS.yellow,
    error: COLORS.red,
  };

  const color = colorMap[level];
  const levelUpper = level.toUpperCase().padEnd(5);

  console.log(
    `${color}[${time}] ${levelUpper}${COLORS.reset} ${message}`,
    data ? JSON.stringify(data, null, 2) : ''
  );
};

export const logger = {
  debug: (message: string, data?: any) => log('debug', message, data),
  info: (message: string, data?: any) => log('info', message, data),
  warn: (message: string, data?: any) => log('warn', message, data),
  error: (message: string, data?: any) => log('error', message, data),
};

export default logger;
