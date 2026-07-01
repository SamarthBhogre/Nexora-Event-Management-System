import { Router } from 'express';
import { authMiddleware, optionalAuth, roleAuth } from '@middleware/auth';
import { validate, createEventValidation, updateEventValidation } from '@middleware/validation';
import { asyncHandler } from '@middleware/errorHandler';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  duplicateEvent,
  publishEvent,
  cancelEvent,
  moderateEvent,
  registerEvent,
  unregisterEvent,
  getEventAttendees,
  removeAttendee,
  getRegistrationStats,
} from '@controllers/eventController';

const router = Router();

router.get('/', optionalAuth, asyncHandler(getEvents));

router.get('/:id', optionalAuth, asyncHandler(getEventById));

// POST /events - Create new event
router.post('/', authMiddleware, roleAuth('organizer'), validate(createEventValidation()), asyncHandler(createEvent));

// PUT /events/:id - Update event
router.put('/:id', authMiddleware, roleAuth('organizer'), validate(updateEventValidation()), asyncHandler(updateEvent));

router.delete('/:id', authMiddleware, roleAuth('organizer'), asyncHandler(deleteEvent));

router.post('/:id/duplicate', authMiddleware, roleAuth('organizer'), asyncHandler(duplicateEvent));

router.patch('/:id/publish', authMiddleware, roleAuth('organizer'), asyncHandler(publishEvent));

router.patch('/:id/cancel', authMiddleware, roleAuth('organizer'), asyncHandler(cancelEvent));

router.patch('/:id/moderation', authMiddleware, roleAuth('admin'), asyncHandler(moderateEvent));

router.get('/:id/attendees', authMiddleware, roleAuth('organizer', 'admin'), asyncHandler(getEventAttendees));

router.delete('/:id/attendees/:userId', authMiddleware, roleAuth('organizer'), asyncHandler(removeAttendee));

router.get('/:id/registration-stats', authMiddleware, roleAuth('organizer', 'admin'), asyncHandler(getRegistrationStats));

router.post('/:id/register', authMiddleware, roleAuth('user'), asyncHandler(registerEvent));

router.delete('/:id/unregister', authMiddleware, roleAuth('user'), asyncHandler(unregisterEvent));

export default router;
