import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken } from '@utils/jwt';
import { ERROR_CODES } from '@types/api';
import { JwtPayload } from '@types/index';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        'No authorization token provided'
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      401,
      ERROR_CODES.INVALID_TOKEN,
      'Invalid or expired token'
    );
  }
};

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export const roleAuth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        'Authentication required'
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        403,
        ERROR_CODES.FORBIDDEN,
        'Insufficient permissions'
      );
    }

    next();
  };
};
