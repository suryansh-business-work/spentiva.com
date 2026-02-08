import express from 'express';
import {
  getSummaryController,
  getByCategoryController,
  getByMonthController,
  getTotalController,
  getByExpenseFromController,
  emailReportController,
} from './analytics.controllers';
import { authenticateMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * Analytics Routes
 */

// GET /api/analytics/summary - Get summary statistics
router.get('/summary', getSummaryController);

// GET /api/analytics/by-category - Get expenses grouped by category
router.get('/by-category', getByCategoryController);

// GET /api/analytics/by-month - Get expenses grouped by month
router.get('/by-month', getByMonthController);

// GET /api/analytics/by-expense-from - Get expenses grouped by payment method
router.get('/by-expense-from', getByExpenseFromController);

// GET /api/analytics/total - Get total expenses
router.get('/total', getTotalController);

// POST /api/analytics/email-report - Send email report
router.post('/email-report', authenticateMiddleware, emailReportController);

export default router;
