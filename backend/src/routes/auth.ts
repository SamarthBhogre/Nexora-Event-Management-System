import { Router } from 'express';
import { authMiddleware } from '@middleware/auth';
import { validate, loginValidation, registerValidation } from '@middleware/validation';
import { asyncHandler } from '@middleware/errorHandler';
import { login, register, logout, profile } from '@controllers/authController';

const router = Router();

router.post('/register', validate(registerValidation()), asyncHandler(register));

router.post('/login', validate(loginValidation()), asyncHandler(login));

router.post('/logout', authMiddleware, asyncHandler(logout));

router.get('/profile', authMiddleware, asyncHandler(profile));

export default router;
