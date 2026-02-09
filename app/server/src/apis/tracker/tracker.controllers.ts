import { Response } from 'express';
import TrackerService from './tracker.services';
import { successResponse, errorResponse, badRequestResponse } from '../../utils/response-object';

/**
 * Tracker Controllers - Request handlers using response-object.ts
 */

/**
 * Get all trackers for the authenticated user
 */
export const getAllTrackersController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const trackers = await TrackerService.getAllTrackers(userId);

    return successResponse(res, { trackers }, 'Trackers retrieved successfully');
  } catch (error: any) {
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Create a new tracker
 */
export const createTrackerController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { name, type, description, currency } = req.body;

    const tracker = await TrackerService.createTracker(userId, {
      name,
      type,
      description,
      currency,
    });

    return successResponse(
      res,
      {
        tracker: {
          id: tracker.id,
          name: tracker.name,
          type: tracker.type,
          description: tracker.description,
          currency: tracker.currency,
          createdAt: tracker.createdAt,
        },
      },
      'Tracker created successfully'
    );
  } catch (error: any) {
    if (error.message.includes('Missing required fields')) {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Get a single tracker by ID
 */
export const getTrackerByIdController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const tracker = await TrackerService.getTrackerById(userId, id);

    return successResponse(res, { tracker }, 'Tracker retrieved successfully');
  } catch (error: any) {
    if (error.message === 'Tracker not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Update a tracker
 */
export const updateTrackerController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, type, description, currency, botImage } = req.body;

    const tracker = await TrackerService.updateTracker(userId, id, {
      name,
      type,
      description,
      currency,
      botImage,
    });

    return successResponse(res, { tracker }, 'Tracker updated successfully');
  } catch (error: any) {
    if (error.message === 'Tracker not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Delete a tracker
 */
export const deleteTrackerController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await TrackerService.deleteTracker(userId, id);

    return successResponse(res, result, result.message);
  } catch (error: any) {
    if (error.message === 'Tracker not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Share a tracker with another user
 */
export const shareTrackerController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { email, role } = req.body;

    if (!email) {
      return badRequestResponse(res, null, 'Email is required');
    }

    const result = await TrackerService.shareTracker(userId, id, {
      email,
      role: role || 'editor',
    });

    return successResponse(res, result, 'Tracker shared successfully');
  } catch (error: any) {
    if (error.message === 'Tracker not found' || error.message.includes('already shared')) {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Remove a shared user from tracker
 */
export const removeSharedUserController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return badRequestResponse(res, null, 'Email is required');
    }

    const result = await TrackerService.removeSharedUser(userId, id, email);

    return successResponse(res, result, 'User removed from tracker');
  } catch (error: any) {
    if (error.message === 'Tracker not found' || error.message === 'User not found in shared list') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Resend invitation to a shared user
 */
export const resendShareInviteController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return badRequestResponse(res, null, 'Email is required');
    }

    const result = await TrackerService.resendShareInvite(userId, id, email);

    return successResponse(res, result, 'Invitation re-sent successfully');
  } catch (error: any) {
    if (error.message === 'Tracker not found' || error.message === 'User not found in shared list') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Request OTP for tracker deletion
 */
export const requestDeleteOtpController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const { id } = req.params;

    // Check if email service is available before generating OTP
    const { sendEmail, isSmtpConfigured } = await import('../../services/emailService');
    if (!isSmtpConfigured()) {
      return badRequestResponse(res, null, 'Email service is not configured. OTP verification is unavailable.');
    }

    const { otp, trackerName } = await TrackerService.requestDeleteOtp(userId, id);

    // Send OTP via email (mark as critical)
    await sendEmail({
      to: email,
      subject: `Delete Tracker "${trackerName}" - Verification Code`,
      critical: true,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#d32f2f;">Tracker Deletion Verification</h2>
          <p>You requested to delete the tracker <strong>"${trackerName}"</strong>.</p>
          <p>Your verification code is:</p>
          <div style="font-size:32px;font-weight:bold;letter-spacing:8px;text-align:center;padding:16px;
            background:#f5f5f5;border-radius:8px;margin:16px 0;">${otp}</div>
          <p style="color:#757575;">This code expires in <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return successResponse(res, null, 'Verification code sent to your email');
  } catch (error: any) {
    if (error.message === 'Tracker not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Failed to send verification code');
  }
};

/**
 * Confirm tracker deletion with OTP
 */
export const confirmDeleteController = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { otp } = req.body;

    if (!otp || typeof otp !== 'string') {
      return badRequestResponse(res, null, 'OTP is required');
    }

    const result = await TrackerService.confirmDeleteWithOtp(userId, id, otp.trim());
    return successResponse(res, result, result.message);
  } catch (error: any) {
    const clientErrors = ['Tracker not found', 'Invalid OTP', 'OTP has expired', 'No OTP requested'];
    if (clientErrors.some(msg => error.message?.includes(msg))) {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};
