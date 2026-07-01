import { Request, Response } from 'express';
import { eventService } from '@services/eventService';
import { AppError } from '@middleware/errorHandler';
import { ERROR_CODES } from '@/types/api';

type EventSortBy = 'date' | 'popularity' | 'title';

const parsePositiveInt = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
};

const parseSortBy = (value: unknown): EventSortBy => {
  if (value === 'title' || value === 'popularity') {
    return value;
  }
  return 'date';
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = Math.min(parsePositiveInt(req.query.limit, 10), 50);
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : undefined;
  const sortBy = parseSortBy(req.query.sortBy);

  const { items, total } = await eventService.listEvents({
    page,
    limit,
    search: search || undefined,
    category: category || undefined,
    sortBy,
  });

  res.status(200).json({
    success: true,
    message: 'Events retrieved successfully',
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

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const event = await eventService.getEvent(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Event retrieved successfully',
    statusCode: 200,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }
  if (req.user.role !== 'organizer') {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Only organizers can create events');
  }

  const event = await eventService.createEvent(req.body, req.user.id);
  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    statusCode: 201,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }
  if (req.user.role !== 'organizer') {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Only organizers can edit events');
  }

  const event = await eventService.updateEvent(req.params.id, req.body, req.user.id, 'organizer');
  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    statusCode: 200,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  await eventService.deleteEvent(req.params.id, req.user.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
};

export const duplicateEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const event = await eventService.duplicateEvent(req.params.id, req.user.id);
  res.status(201).json({
    success: true,
    message: 'Event duplicated successfully',
    statusCode: 201,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const publishEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const event = await eventService.setEventStatus(
    req.params.id,
    req.body?.published === false ? 'cancelled' : 'upcoming',
    req.user.id,
    'organizer'
  );
  res.status(200).json({
    success: true,
    message: 'Event publication status updated successfully',
    statusCode: 200,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const cancelEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const event = await eventService.setEventStatus(req.params.id, 'cancelled', req.user.id, 'organizer');
  res.status(200).json({
    success: true,
    message: 'Event cancelled successfully',
    statusCode: 200,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const moderateEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const action = req.body?.action as string | undefined;
  const status = action === 'archive' || action === 'remove'
    ? 'cancelled'
    : action === 'restore' || action === 'feature'
    ? 'upcoming'
    : req.body?.status;

  if (!['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
    throw new AppError(400, ERROR_CODES.VALIDATION_ERROR, 'Invalid moderation action');
  }

  const event = await eventService.setEventStatus(req.params.id, status, req.user.id, 'admin');
  res.status(200).json({
    success: true,
    message: 'Event moderated successfully',
    statusCode: 200,
    data: event,
    timestamp: new Date().toISOString(),
  });
};

export const registerEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }
  if (req.user.role !== 'user') {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Only users can register for events');
  }

  const data = await eventService.registerForEvent(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Registered for event successfully',
    statusCode: 200,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const unregisterEvent = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }
  if (req.user.role !== 'user') {
    throw new AppError(403, ERROR_CODES.FORBIDDEN, 'Only users can cancel registrations');
  }

  await eventService.unregisterFromEvent(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Unregistered from event successfully',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
};

export const getEventAttendees = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const search = typeof req.query.search === 'string' ? req.query.search.trim() : undefined;
  const attendees = await eventService.getEventAttendees(req.params.id, req.user.id, req.user.role, search);
  res.status(200).json({
    success: true,
    message: 'Attendees retrieved successfully',
    statusCode: 200,
    data: attendees,
    timestamp: new Date().toISOString(),
  });
};

export const removeAttendee = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  await eventService.removeAttendee(req.params.id, req.params.userId, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Attendee removed successfully',
    statusCode: 200,
    timestamp: new Date().toISOString(),
  });
};

export const getRegistrationStats = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required');
  }

  const stats = await eventService.getRegistrationStats(req.params.id, req.user.id, req.user.role);
  res.status(200).json({
    success: true,
    message: 'Registration statistics retrieved successfully',
    statusCode: 200,
    data: stats,
    timestamp: new Date().toISOString(),
  });
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await eventService.listCategories();
  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    statusCode: 200,
    data: categories,
    timestamp: new Date().toISOString(),
  });
};
