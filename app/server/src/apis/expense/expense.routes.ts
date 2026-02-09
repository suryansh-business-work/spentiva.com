import express from 'express';
import {
  parseExpenseController,
  createExpenseController,
  getAllExpensesController,
  getExpenseByIdController,
  updateExpenseController,
  deleteExpenseController,
  bulkDeleteExpenseController,
  chatController,
} from './expense.controllers';
import { authenticateMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * Expense Routes
 */

// POST /api/expense/parse - Parse expense from natural language
router.post('/parse', authenticateMiddleware, parseExpenseController);

// POST /api/expense/chat - Chat with AI for expense tracking
router.post('/chat', authenticateMiddleware, chatController);

// POST /api/expense - Create a new expense
router.post('/create', authenticateMiddleware, createExpenseController);

// POST /api/expense/bulk-delete - Bulk delete expenses
router.post('/bulk-delete', authenticateMiddleware, bulkDeleteExpenseController);

// GET /api/expense - Get all expenses with optional filtering
router.get('/all', authenticateMiddleware, getAllExpensesController);

// GET /api/expenses/:id - Get a specific expense
router.get('/:id', authenticateMiddleware, getExpenseByIdController);

// PUT /api/expenses/:id - Update an expense
router.put('/:id', authenticateMiddleware, updateExpenseController);

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', authenticateMiddleware, deleteExpenseController);

export default router;
