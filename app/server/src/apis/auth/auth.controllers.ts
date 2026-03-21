import { Request, Response } from 'express';
import { AuthService } from './auth.services';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from './auth.validators';
import { successResponse, badRequestResponse, errorResponse } from '../../utils/response-object';
import { logger } from '../../utils/logger';

export const registerController = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return badRequestResponse(res, parsed.error.errors, firstError);
    }

    const { user, token } = await AuthService.register(parsed.data);
    return successResponse(res, { user, token }, 'Registration successful');
  } catch (error: any) {
    if (error.message === 'An account with this email already exists') {
      return badRequestResponse(res, null, error.message);
    }
    logger.error('Register error', { error: error.message });
    return errorResponse(res, null, 'Registration failed');
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return badRequestResponse(res, parsed.error.errors, firstError);
    }

    const ip = req.ip || req.socket.remoteAddress;
    const { user, token } = await AuthService.login(parsed.data.email, parsed.data.password, ip);
    return successResponse(res, { user, token }, 'Login successful');
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return badRequestResponse(res, null, error.message);
    }
    logger.error('Login error', { error: error.message });
    return errorResponse(res, null, 'Login failed');
  }
};

export const getMeController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return badRequestResponse(res, null, 'User not found');
    }

    const user = await AuthService.getUserById(userId);
    if (!user) {
      return badRequestResponse(res, null, 'User not found');
    }

    return successResponse(res, { user }, 'User fetched successfully');
  } catch (error: any) {
    logger.error('Get me error', { error: error.message });
    return errorResponse(res, null, 'Failed to fetch user');
  }
};

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return badRequestResponse(res, null, 'User not found');
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return badRequestResponse(res, parsed.error.errors, firstError);
    }

    const user = await AuthService.updateProfile(userId, parsed.data);
    if (!user) {
      return badRequestResponse(res, null, 'User not found');
    }

    return successResponse(res, { user }, 'Profile updated successfully');
  } catch (error: any) {
    logger.error('Update profile error', { error: error.message });
    return errorResponse(res, null, 'Failed to update profile');
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return badRequestResponse(res, parsed.error.errors, firstError);
    }

    await AuthService.generateResetToken(parsed.data.email);

    // Always return success to prevent email enumeration
    return successResponse(
      res,
      null,
      'If an account with that email exists, a password reset link has been sent'
    );
  } catch (error: any) {
    logger.error('Forgot password error', { error: error.message });
    return errorResponse(res, null, 'Failed to process request');
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Validation failed';
      return badRequestResponse(res, parsed.error.errors, firstError);
    }

    await AuthService.resetPassword(parsed.data.token, parsed.data.password);
    return successResponse(res, null, 'Password reset successful');
  } catch (error: any) {
    if (error.message === 'Invalid or expired reset token') {
      return badRequestResponse(res, null, error.message);
    }
    logger.error('Reset password error', { error: error.message });
    return errorResponse(res, null, 'Failed to reset password');
  }
};
