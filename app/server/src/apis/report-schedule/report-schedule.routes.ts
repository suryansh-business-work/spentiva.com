import express from 'express';
import {
  createScheduleController,
  getMySchedulesController,
  getScheduleByTrackerController,
  updateScheduleController,
  deleteScheduleController,
} from './report-schedule.controllers';
import { authenticateMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

// All routes require authentication
router.post('/create', authenticateMiddleware, createScheduleController);
router.get('/all', authenticateMiddleware, getMySchedulesController);
router.get('/tracker/:trackerId', authenticateMiddleware, getScheduleByTrackerController);
router.put('/update/:id', authenticateMiddleware, updateScheduleController);
router.delete('/delete/:id', authenticateMiddleware, deleteScheduleController);

export default router;
