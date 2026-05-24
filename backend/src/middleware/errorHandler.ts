import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse, ERROR_CODES } from '@types/api';
import { logger } from '@utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string | string[]>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  // Handle AppError
  if (err instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      message: err.message,
      error: {
        code: err.code,
        details: err.details,
      },
      statusCode: err.statusCode,
      timestamp: new Date().toISOString(),
    };
    return res.status(err.statusCode).json(response);
  }

  // Handle validation errors
  if (err instanceof SyntaxError && 'body' in err) {
    const response: ApiErrorResponse = {
      success: false,
      message: 'Invalid JSON',
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
      },
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(response);
  }

  // Handle unknown errors
  const response: ApiErrorResponse = {
    success: false,
    message: 'Internal server error',
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    },
    statusCode: 500,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
