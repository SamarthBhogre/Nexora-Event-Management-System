import { Request, Response } from 'express';
import { userService } from '@services/userService';
import { eventService } from '@services/eventService';
import { AppError } from '@middleware/errorHandler';
import { ERROR_CODES } from '@/types/api';

const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

const assertCanAccessUser = (requesterId: string, requesterRole: string, targetUserId: string): void => {
  if (requesterRole === 'admin' || requesterId === targetUserId) {
    return;
  }
  throw new AppError(403, ERROR_CODES.FORBIDDEN, 'You are not allowed to access this resource');
};

const parseRole = (value: unknown): 'user' | 'organizer' | 'admin' | undefined => {
  return value === 'user' || value === 'organizer' || value === 'admin' ? value : undefined;
};

const parseStatus = (value: unknown): 'active' | 'suspended' | undefined => {
  return value === 'active' || value === 'suspended' ? value : undefined;
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  assertCanAccessUser(req.user.id, req.user.role, req.params.id);
  const profile = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    statusCode: 200,
    data: profile,
    timestamp: new Date().toISOString(),
  });
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  assertCanAccessUser(req.user.id, req.user.role, req.params.id);
  if (req.user.role !== 'admin' && (req.body.role !== undefined || req.body.accountStatus !== undefined)) {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'You cannot change role or account status');
  }
  const profile = await userService.updateUserById(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User profile updated successfully',
    statusCode: 200,
    data: profile,
    timestamp: new Date().toISOString(),
  });
};

export const listUsers = async (req: Request, res: Response): Promise<void> => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const role = parseRole(req.query.role);
  const status = parseStatus(req.query.status);
  const { items, total } = await userService.listUsers({ page, limit, search, role, status });

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    statusCode: 200,
    data: {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    },
    timestamp: new Date().toISOString(),
  });
};

export const changeUserRole = async (req: Request, res: Response): Promise<void> => {
  const role = parseRole(req.body?.role);
  if (!role) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid role');
  }

  const profile = await userService.changeUserRole(req.params.id, role);
  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    statusCode: 200,
    data: profile,
    timestamp: new Date().toISOString(),
  });
};

export const changeUserStatus = async (req: Request, res: Response): Promise<void> => {
  const status = parseStatus(req.body?.status);
  if (!status) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid account status');
  }

  const profile = await userService.changeUserStatus(req.params.id, status);
  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    statusCode: 200,
    data: profile,
    timestamp: new Date().toISOString(),
  });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  await userService.deleteUserById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
};

export const getUserEvents = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  assertCanAccessUser(req.user.id, req.user.role, req.params.id);
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
  const { items, total } = await eventService.getOrganizerEvents(req.params.id, page, limit);

  res.status(200).json({
    success: true,
    message: 'User events retrieved successfully',
    statusCode: 200,
    data: {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    },
    timestamp: new Date().toISOString(),
  });
};

export const getUserRegisteredEvents = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  assertCanAccessUser(req.user.id, req.user.role, req.params.id);
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
  const { items, total } = await eventService.getRegisteredEvents(req.params.id, page, limit);

  res.status(200).json({
    success: true,
    message: 'Registered events retrieved successfully',
    statusCode: 200,
    data: {
      items,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    },
    timestamp: new Date().toISOString(),
  });
};

export const getUserDashboard = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  assertCanAccessUser(req.user.id, req.user.role, req.params.id);
  const stats = await userService.getDashboardCounts(req.params.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Dashboard summary retrieved successfully',
    statusCode: 200,
    data: stats,
    timestamp: new Date().toISOString(),
  });
};
