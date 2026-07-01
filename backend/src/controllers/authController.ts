import { Request, Response } from 'express';
import { authService } from '@services/authService';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, userType } = req.body;
  const data = await authService.register({ name, email, password, userType });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    statusCode: 201,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const data = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    statusCode: 200,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  const user = await authService.getProfile(req.user!.id);

  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    statusCode: 200,
    data: user,
    timestamp: new Date().toISOString(),
  });
};
