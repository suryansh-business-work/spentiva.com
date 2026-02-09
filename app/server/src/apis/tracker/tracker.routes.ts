import express from 'express';
import {
  getAllTrackersController,
  createTrackerController,
  getTrackerByIdController,
  updateTrackerController,
  deleteTrackerController,
  shareTrackerController,
  removeSharedUserController,
  resendShareInviteController,
  requestDeleteOtpController,
  confirmDeleteController,
  respondToInviteController,
} from './tracker.controllers';
import { authenticateMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * Tracker Routes
 * All routes require authentication
 */

// Get all trackers for authenticated user
router.get('/all', authenticateMiddleware, getAllTrackersController);

// Create a new tracker
router.post('/create', authenticateMiddleware, createTrackerController);

// Get a single tracker by ID
router.get('/get/:id', authenticateMiddleware, getTrackerByIdController);

// Update a tracker
router.put('/update/:id', authenticateMiddleware, updateTrackerController);

// Delete a tracker (direct — kept for backward compat)
router.delete('/delete/:id', authenticateMiddleware, deleteTrackerController);

// Request OTP for tracker deletion
router.post('/delete-request/:id', authenticateMiddleware, requestDeleteOtpController);

// Confirm tracker deletion with OTP
router.post('/delete-confirm/:id', authenticateMiddleware, confirmDeleteController);

// Share tracker with another user
router.post('/share/:id', authenticateMiddleware, shareTrackerController);

// Remove a shared user from tracker
router.post('/unshare/:id', authenticateMiddleware, removeSharedUserController);

// Resend share invitation
router.post('/resend-invite/:id', authenticateMiddleware, resendShareInviteController);
router.post('/respond-invite/:id', authenticateMiddleware, respondToInviteController);

export default router;
