import { Router } from 'express';
import authRoutes from './auth';
import eventRoutes from './events';
import userRoutes from './users';
import categoryRoutes from './categories';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);

export default router;
