import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key';
const JWT_EXPIRE = (process.env.JWT_EXPIRE ?? '24h') as jwt.SignOptions['expiresIn'];
const JWT_REFRESH_EXPIRE = (process.env.JWT_REFRESH_EXPIRE ?? '7d') as jwt.SignOptions['expiresIn'];

export const generateToken = (payload: Partial<JwtPayload>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const generateRefreshToken = (payload: Partial<JwtPayload>): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

export const generateTokenPair = (payload: Partial<JwtPayload>) => {
  return {
    token: generateToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
