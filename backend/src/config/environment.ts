import dotenv from 'dotenv';
import { logger } from '@utils/logger';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_NAME',
  'JWT_SECRET',
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);
    process.exit(1);
  }

  logger.info('✅ Environment variables validated');
};

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: process.env.APP_NAME || 'Syncova',

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'syncova',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'super-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key',
    expiresIn: process.env.JWT_EXPIRE || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Validation
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
};

export const initializeConfig = () => {
  validateEnv();
  logger.info('Configuration loaded', {
    env: config.nodeEnv,
    port: config.port,
    database: `${config.database.user}@${config.database.host}:${config.database.port}/${config.database.name}`,
  });
};

export default config;
