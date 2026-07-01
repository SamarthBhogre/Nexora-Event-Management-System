import { Router } from 'express';
import { authMiddleware, roleAuth } from '@middleware/auth';
import { asyncHandler } from '@middleware/errorHandler';
import {
  getUserProfile,
  updateUserProfile,
  listUsers,
  changeUserRole,
  changeUserStatus,
  deleteUser,
  getUserEvents,
  getUserRegisteredEvents,
  getUserDashboard,
} from '@controllers/userController';

const router = Router();

router.get('/', authMiddleware, roleAuth('admin'), asyncHandler(listUsers));

router.patch('/:id/role', authMiddleware, roleAuth('admin'), asyncHandler(changeUserRole));

router.patch('/:id/status', authMiddleware, roleAuth('admin'), asyncHandler(changeUserStatus));

router.delete('/:id', authMiddleware, roleAuth('admin'), asyncHandler(deleteUser));

// GET /users/:id - Get user profile
router.get('/:id', authMiddleware, asyncHandler(getUserProfile));

// PUT /users/:id - Update user profile
router.put('/:id', authMiddleware, asyncHandler(updateUserProfile));

// GET /users/:id/events - Get organizer's own events, or admin moderation view
router.get('/:id/events', authMiddleware, roleAuth('organizer', 'admin'), asyncHandler(getUserEvents));

// GET /users/:id/registered-events - Get events user registered for
router.get('/:id/registered-events', authMiddleware, asyncHandler(getUserRegisteredEvents));
router.get('/:id/dashboard', authMiddleware, asyncHandler(getUserDashboard));

export default router;
