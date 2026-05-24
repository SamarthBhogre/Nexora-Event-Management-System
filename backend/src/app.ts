import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRoutes from '@routes/index';
import { errorHandler, asyncHandler } from '@middleware/errorHandler';
import { config } from '@config/environment';
import { logger } from '@utils/logger';

export const createApp = (): Express => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(cors(config.cors));

  // Logging Middleware
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    })
  );

  // Body Parser Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Request ID Middleware (for tracking)
  app.use((req, res, next) => {
    req.id = Math.random().toString(36).substring(7);
    next();
  });

  // API Routes
  app.use('/api', apiRoutes);

  // 404 Handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });

  // Error Handler (must be last)
  app.use(errorHandler);

  return app;
};

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
