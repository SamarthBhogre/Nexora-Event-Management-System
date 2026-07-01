import { Router } from 'express';
import { asyncHandler } from '@middleware/errorHandler';
import { getCategories } from '@controllers/eventController';

const router = Router();

router.get('/', asyncHandler(getCategories));

export default router;
