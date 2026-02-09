import { Response } from 'express';
import ExpenseService from './expense.services';
import { successResponse, errorResponse, badRequestResponse } from '../../utils/response-object';
import TrackerModel from '../tracker/tracker.models';
import { sendTransactionNotificationEmail } from '../../services/emailService';
import { logger } from '../../utils/logger';

/**
 * Expense Controllers - Request handlers using response-object.ts
 */

/**
 * Parse expense from natural language message
 * Now supports parsing single or multiple expenses from one input
 */
export const parseExpenseController = async (req: any, res: Response) => {
  try {
    const { input, trackerId } = req.body;

    if (!input) {
      return badRequestResponse(res, null, 'User input is required');
    }

    if (!trackerId) {
      return badRequestResponse(res, null, 'Tracker ID is required');
    }

    // Get tracker information for snapshot
    let trackerSnapshot = null;
    let trackerCurrency = 'INR';
    if (req.user?.userId && trackerId) {
      try {
        const tracker = await TrackerModel.findOne({
          _id: trackerId,
          userId: req.user.userId,
        });

        if (tracker) {
          trackerCurrency = tracker.currency || 'INR';
          const { createTrackerSnapshot } = await import('../usage-log/usage-log.services');
          trackerSnapshot = createTrackerSnapshot(tracker);
        } else {
          return badRequestResponse(res, null, 'Tracker not found');
        }
      } catch (err) {
        console.error('[Parse Expense] Error fetching tracker:', err);
        return errorResponse(res, err, 'Error fetching tracker information');
      }
    }

    // Log user message with tracker snapshot
    if (trackerSnapshot) {
      try {
        const { encode } = await import('gpt-tokenizer');
        const userTokens = encode(input).length;

        const { logUsage } = await import('../usage-log/usage-log.services');
        await logUsage(req.user.userId, trackerSnapshot, 'user', input, userTokens);
        console.log('[Parse Expense] User message logged with estimated tokens:', userTokens);
      } catch (logError) {
        console.error('[Parse Expense] Error logging user message:', logError);
        // Continue processing even if logging fails
      }
    }

    const parsed = await ExpenseService.parseExpense(input, trackerId, trackerCurrency);

    // Check for errors
    if ('error' in parsed) {
      return badRequestResponse(res, parsed, 'Failed to parse expense');
    }

    // Destructure expenses and usage from the response
    const { expenses: parsedExpenses, usage } = parsed;
    const firstExpense = parsedExpenses[0];

    // Log AI response with tracker snapshot using ACTUAL OpenAI token counts
    if (trackerSnapshot && usage) {
      try {
        const { logUsage } = await import('../usage-log/usage-log.services');

        // Use actual token counts from OpenAI
        const actualUserTokens = usage.prompt_tokens || 0;
        const actualAiTokens = usage.completion_tokens || 0;

        console.log('[Parse Expense] Actual OpenAI Usage:', {
          prompt_tokens: actualUserTokens,
          completion_tokens: actualAiTokens,
          total_tokens: usage.total_tokens,
          expenses_parsed: parsedExpenses.length,
        });

        // Update the user message log with actual tokens
        await logUsage(req.user.userId, trackerSnapshot, 'user', input, actualUserTokens);

        // Create response text for logging
        const responseText =
          parsedExpenses.length === 1
            ? `Parsed 1 expense: ₹${firstExpense.amount} for ${firstExpense.subcategory} via ${firstExpense.paymentMethod}`
            : `Parsed ${parsedExpenses.length} expenses totaling ₹${parsedExpenses.reduce((sum, e) => sum + e.amount, 0)}`;

        // Log AI response with actual completion tokens
        await logUsage(req.user.userId, trackerSnapshot, 'assistant', responseText, actualAiTokens);

        console.log('[Parse Expense] Messages logged with actual OpenAI tokens');
      } catch (logError) {
        console.error('[Parse Expense] Error logging with actual tokens:', logError);
      }
    }

    return successResponse(
      res,
      { expenses: parsedExpenses, count: parsedExpenses.length, usage },
      `${parsedExpenses.length} expense${parsedExpenses.length > 1 ? 's' : ''} parsed successfully`
    );
  } catch (error: any) {
    console.error('Error parsing expense:', error);
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Create expenses (single or multiple)
 * Always expects an array of expenses
 */
export const createExpenseController = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { expenses, trackerId } = req.body;

    // Validate expenses array exists
    if (!expenses || !Array.isArray(expenses)) {
      return badRequestResponse(res, null, 'Expenses must be an array');
    }

    if (expenses.length === 0) {
      return badRequestResponse(res, null, 'Expenses array cannot be empty');
    }

    // Validate that each expense has required fields
    for (let i = 0; i < expenses.length; i++) {
      const exp = expenses[i];
      if (!exp.amount || !exp.category || !exp.subcategory || !exp.categoryId) {
        return badRequestResponse(
          res,
          null,
          `Expense at index ${i}: Missing required fields (amount, category, subcategory, categoryId)`
        );
      }
    }

    // Create expenses using bulk service
    const createdExpenses = await ExpenseService.createBulkExpenses(expenses, {
      trackerId,
      userId,
      createdBy: userId,
      createdByName: req.user?.name || req.user?.firstName || 'Unknown',
    });

    const formattedExpenses = createdExpenses.map(expense => ({
      id: expense._id.toString(),
      type: expense.type || 'expense',
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      categoryId: expense.categoryId,
      paymentMethod: expense.paymentMethod,
      creditFrom: expense.creditFrom,
      currency: expense.currency || 'INR',
      description: expense.description,
      timestamp: expense.timestamp,
      trackerId: expense.trackerId,
      createdBy: expense.createdBy,
      createdByName: expense.createdByName,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));

    // Fire-and-forget: Send email notifications to tracker members
    if (trackerId) {
      (async () => {
        try {
          const tracker = await TrackerModel.findById(trackerId);
          if (!tracker) return;

          // Collect all member emails except the person who created the expense
          const userEmail = req.user?.email || '';
          const recipients: string[] = [];

          // Add shared users who accepted the invitation
          for (const su of tracker.sharedWith || []) {
            if (su.status === 'accepted' && su.email && su.email !== userEmail) {
              recipients.push(su.email);
            }
          }

          // If creator is a collaborator (not owner), notify the owner too
          // We don't have owner email on tracker model, skip owner notification for now
          // unless we add it later

          if (!recipients.length) return;

          for (const expense of formattedExpenses) {
            sendTransactionNotificationEmail(
              recipients,
              {
                type: expense.type,
                amount: expense.amount,
                currency: expense.currency,
                category: expense.category,
                subcategory: expense.subcategory,
                paymentMethod: expense.paymentMethod || '',
                description: expense.description || '',
                createdByName: expense.createdByName || 'Someone',
                timestamp: expense.timestamp || expense.createdAt,
              },
              { id: trackerId, name: tracker.name }
            ).catch(err =>
              logger.error('Transaction notification failed', { error: err.message })
            );
          }
        } catch (err: any) {
          logger.error('Error sending transaction notifications', { error: err.message });
        }
      })();
    }

    return successResponse(
      res,
      {
        expenses: formattedExpenses,
        count: formattedExpenses.length,
      },
      `${formattedExpenses.length} expense${formattedExpenses.length > 1 ? 's' : ''} created successfully`
    );
  } catch (error: any) {
    console.error('Error creating expense:', error);
    if (
      error.message.includes('Missing required fields') ||
      error.message.includes('Expense at index')
    ) {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Get all expenses with optional filtering
 */
export const getAllExpensesController = async (req: any, res: Response) => {
  try {
    const { trackerId, limit, page } = req.query;
    const userId = req.user?.userId;

    const pageNum = page ? parseInt(page as string) : 1;
    const limitNum = limit ? parseInt(limit as string) : 20;

    const expenses = await ExpenseService.getAllExpenses({
      trackerId: trackerId as string,
      userId,
      limit: limitNum,
      page: pageNum,
    });

    const total = await ExpenseService.getExpenseCount({
      trackerId: trackerId as string,
      userId,
    });

    const formattedExpenses = expenses.map(expense => ({
      id: expense._id.toString(),
      type: expense.type || 'expense',
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      categoryId: expense.categoryId,
      paymentMethod: expense.paymentMethod,
      creditFrom: expense.creditFrom,
      currency: expense.currency || 'INR',
      description: expense.description,
      timestamp: expense.timestamp,
      trackerId: expense.trackerId || 'default',
      createdBy: expense.createdBy,
      createdByName: expense.createdByName,
      lastUpdatedBy: expense.lastUpdatedBy,
      lastUpdatedByName: expense.lastUpdatedByName,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    }));

    return successResponse(
      res,
      {
        expenses: formattedExpenses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      'Expenses retrieved successfully'
    );
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Get a single expense by ID
 */
export const getExpenseByIdController = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const expense = await ExpenseService.getExpenseById(id, userId);

    const formattedExpense = {
      id: expense._id.toString(),
      type: expense.type || 'expense',
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      categoryId: expense.categoryId,
      paymentMethod: expense.paymentMethod,
      creditFrom: expense.creditFrom,
      currency: expense.currency || 'INR',
      description: expense.description,
      timestamp: expense.timestamp,
      trackerId: expense.trackerId,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };

    return successResponse(res, { expense: formattedExpense }, 'Expense retrieved successfully');
  } catch (error: any) {
    console.error('Error fetching expense:', error);
    if (error.message === 'Expense not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Update an expense
 */
export const updateExpenseController = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      amount,
      category,
      subcategory,
      categoryId,
      paymentMethod,
      creditFrom,
      currency,
      description,
      timestamp,
      type,
    } = req.body;
    const userId = req.user?.userId;

    const expense = await ExpenseService.updateExpense(
      id,
      {
        type,
        amount,
        category,
        subcategory,
        categoryId,
        paymentMethod,
        creditFrom,
        currency,
        description,
        timestamp,
        lastUpdatedBy: userId,
        lastUpdatedByName: req.user?.name || req.user?.firstName || 'Unknown',
      },
      userId
    );

    const formattedExpense = {
      id: expense._id.toString(),
      type: expense.type || 'expense',
      amount: expense.amount,
      category: expense.category,
      subcategory: expense.subcategory,
      categoryId: expense.categoryId,
      paymentMethod: expense.paymentMethod,
      creditFrom: expense.creditFrom,
      currency: expense.currency || 'INR',
      description: expense.description,
      timestamp: expense.timestamp,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };

    return successResponse(res, { expense: formattedExpense }, 'Expense updated successfully');
  } catch (error: any) {
    console.error('Error updating expense:', error);
    if (error.message === 'Expense not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Delete an expense
 */
export const deleteExpenseController = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const result = await ExpenseService.deleteExpense(id, userId);

    return successResponse(res, { id }, result.message);
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    if (error.message === 'Expense not found') {
      return badRequestResponse(res, null, error.message);
    }
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Bulk delete expenses
 */
export const bulkDeleteExpenseController = async (req: any, res: Response) => {
  try {
    const { ids } = req.body;
    const userId = req.user?.userId;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return badRequestResponse(res, null, 'ids must be a non-empty array');
    }

    const result = await ExpenseService.bulkDeleteExpenses(ids, userId);

    // Trigger update event
    return successResponse(res, result, result.message);
  } catch (error: any) {
    console.error('Error bulk deleting expenses:', error);
    return errorResponse(res, error, 'Internal server error');
  }
};

/**
 * Chat endpoint for conversational expense tracking
 */
export const chatController = async (req: any, res: Response) => {
  try {
    const { message, history = [], trackerId } = req.body;

    if (!message) {
      return badRequestResponse(res, null, 'Message is required');
    }

    // Get tracker snapshot and log user message
    let trackerSnapshot = null;
    if (req.user?.userId && trackerId) {
      try {
        const tracker = await TrackerModel.findOne({
          _id: trackerId,
          userId: req.user.userId,
        });

        if (tracker) {
          const { createTrackerSnapshot, logUsage } =
            await import('../usage-log/usage-log.services');
          const { encode } = await import('gpt-tokenizer');

          trackerSnapshot = createTrackerSnapshot(tracker);
          const userTokens = encode(message).length;

          await logUsage(req.user.userId, trackerSnapshot, 'user', message, userTokens);
        }
      } catch (err) {
        console.error('[Chat] Error logging user message:', err);
      }
    }

    const { ExpenseParser } = await import('../../services/expenseParser');
    const chatResult = await ExpenseParser.getChatResponse(message, history);

    // Log AI response with ACTUAL OpenAI token usage
    if (trackerSnapshot && chatResult.usage) {
      try {
        const { logUsage } = await import('../usage-log/usage-log.services');

        // Use actual token counts from OpenAI
        const actualUserTokens = chatResult.usage.prompt_tokens || 0;
        const actualAiTokens = chatResult.usage.completion_tokens || 0;

        console.log('[Chat] Actual OpenAI Usage:', {
          prompt_tokens: actualUserTokens,
          completion_tokens: actualAiTokens,
          total_tokens: chatResult.usage.total_tokens,
        });

        // Update user message log with actual prompt tokens
        await logUsage(req.user.userId, trackerSnapshot, 'user', message, actualUserTokens);

        // Log AI response with actual completion tokens
        await logUsage(
          req.user.userId,
          trackerSnapshot,
          'assistant',
          chatResult.response,
          actualAiTokens
        );

        console.log('[Chat] Messages logged with actual OpenAI tokens');
      } catch (err) {
        console.error('[Chat] Error logging with actual tokens:', err);
      }
    } else if (trackerSnapshot && chatResult.response) {
      // Fallback if usage is not available
      try {
        const { logUsage } = await import('../usage-log/usage-log.services');
        const { encode } = await import('gpt-tokenizer');

        const aiTokens = encode(chatResult.response).length;

        await logUsage(
          req.user.userId,
          trackerSnapshot,
          'assistant',
          chatResult.response,
          aiTokens
        );

        console.log('[Chat] AI response logged with estimated tokens (fallback)');
      } catch (err) {
        console.error('[Chat] Error logging AI response:', err);
      }
    }

    return successResponse(res, { response: chatResult.response }, 'Chat response generated');
  } catch (error: any) {
    console.error('Error in chat:', error);
    return errorResponse(res, error, 'Internal server error');
  }
};
