import { Router } from 'express';
import {
  registerController,
  loginController,
  getMeController,
  updateProfileController,
  forgotPasswordController,
  resetPasswordController,
} from './auth.controllers';
import { authenticateMiddleware } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rate-limit';

const router = Router();

// Public routes (with rate limiting)
router.post('/register', authLimiter, registerController);
router.post('/login', authLimiter, loginController);
router.post('/forgot-password', authLimiter, forgotPasswordController);
router.post('/reset-password', authLimiter, resetPasswordController);

// Protected routes
router.get('/me', authenticateMiddleware, getMeController);
router.patch('/profile', authenticateMiddleware, updateProfileController);

export default router;
