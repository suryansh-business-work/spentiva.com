import ExpenseModel from './expense.models';
import { ExpenseParser } from '../../services/expenseParser';
import TrackerModel from '../tracker/tracker.models';
import { createTrackerSnapshot, logUsage } from '../usage-log/usage-log.services';
import { encode } from 'gpt-tokenizer';
import type { ChatMessage, OpenAIUsage, ParsedExpense } from '../../types';
import { logger } from '../../utils/logger';

/**
 * Expense Service - Business logic for expenses
 */
export class ExpenseService {
  /**
   * Parse expense from natural language
   */
  static async parseExpense(message: string, trackerId?: string, trackerCurrency?: string) {
    const parsed = await ExpenseParser.parseExpense(message, trackerId, trackerCurrency);
    return parsed;
  }

  /**
   * Parse expenses for a tracker and record AI usage logs.
   * Shared by the REST controller and the GraphQL resolver so the
   * tracker-snapshot + token-logging flow lives in one place.
   */
  static async parseExpenseForTracker(params: {
    userId: string;
    trackerId: string;
    input: string;
  }): Promise<{ expenses: ParsedExpense[]; count: number; usage?: OpenAIUsage }> {
    const { userId, trackerId, input } = params;

    const tracker = await TrackerModel.findOne({ _id: trackerId, userId });
    if (!tracker) {
      throw new Error('Tracker not found');
    }

    const trackerCurrency = tracker.currency || 'INR';
    const trackerSnapshot = createTrackerSnapshot(tracker);

    // Log the user message with estimated tokens first.
    try {
      await logUsage(userId, trackerSnapshot, 'user', input, encode(input).length);
    } catch (error) {
      logger.error('[Parse Expense] Error logging user message', {
        error: (error as Error).message,
      });
    }

    const parsed = await ExpenseParser.parseExpense(input, trackerId, trackerCurrency);
    if ('error' in parsed) {
      throw new Error(parsed.message || parsed.error || 'Failed to parse expense');
    }

    const { expenses, usage } = parsed;

    // Re-log with the ACTUAL OpenAI token counts.
    if (usage) {
      try {
        await logUsage(userId, trackerSnapshot, 'user', input, usage.prompt_tokens || 0);
        const first = expenses[0];
        const responseText =
          expenses.length === 1 && first
            ? `Parsed 1 expense: ${first.amount} for ${first.subcategory || first.category} via ${first.paymentMethod}`
            : `Parsed ${expenses.length} expenses totaling ${expenses.reduce((sum, e) => sum + e.amount, 0)}`;
        await logUsage(userId, trackerSnapshot, 'assistant', responseText, usage.completion_tokens || 0);
      } catch (error) {
        logger.error('[Parse Expense] Error logging actual tokens', {
          error: (error as Error).message,
        });
      }
    }

    return { expenses, count: expenses.length, usage };
  }

  /**
   * Conversational chat for a tracker, recording AI usage logs.
   * Shared by the REST controller and the GraphQL resolver.
   */
  static async chatForTracker(params: {
    userId: string;
    trackerId?: string;
    message: string;
    history?: ChatMessage[];
  }): Promise<{ response: string }> {
    const { userId, trackerId, message, history = [] } = params;

    let trackerSnapshot: ReturnType<typeof createTrackerSnapshot> | null = null;
    if (trackerId) {
      const tracker = await TrackerModel.findOne({ _id: trackerId, userId });
      if (tracker) {
        trackerSnapshot = createTrackerSnapshot(tracker);
        try {
          await logUsage(userId, trackerSnapshot, 'user', message, encode(message).length);
        } catch (error) {
          logger.error('[Chat] Error logging user message', { error: (error as Error).message });
        }
      }
    }

    const chatResult = await ExpenseParser.getChatResponse(message, history);

    if (trackerSnapshot && chatResult.usage) {
      try {
        await logUsage(userId, trackerSnapshot, 'user', message, chatResult.usage.prompt_tokens || 0);
        await logUsage(
          userId,
          trackerSnapshot,
          'assistant',
          chatResult.response,
          chatResult.usage.completion_tokens || 0
        );
      } catch (error) {
        logger.error('[Chat] Error logging actual tokens', { error: (error as Error).message });
      }
    } else if (trackerSnapshot && chatResult.response) {
      try {
        await logUsage(
          userId,
          trackerSnapshot,
          'assistant',
          chatResult.response,
          encode(chatResult.response).length
        );
      } catch (error) {
        logger.error('[Chat] Error logging AI response', { error: (error as Error).message });
      }
    }

    return { response: chatResult.response };
  }

  /**
   * Get all expenses with optional filtering
   */
  static async getAllExpenses(filters: {
    trackerId?: string;
    userId?: string;
    limit?: number;
    page?: number;
  }) {
    const { trackerId, userId, limit = 20, page = 1 } = filters;
    const query: any = {};

    if (trackerId) query.trackerId = trackerId;
    if (userId) query.userId = userId;

    const skip = (page - 1) * limit;
    const expenses = await ExpenseModel.find(query).sort({ timestamp: -1 }).skip(skip).limit(limit);

    return expenses;
  }

  /**
   * Get count of expenses matching filters
   */
  static async getExpenseCount(filters: { trackerId?: string; userId?: string }) {
    const { trackerId, userId } = filters;
    const query: any = {};

    if (trackerId) query.trackerId = trackerId;
    if (userId) query.userId = userId;

    return ExpenseModel.countDocuments(query);
  }

  /**
   * Get a specific expense by ID
   */
  static async getExpenseById(expenseId: string, userId?: string) {
    const query: any = { _id: expenseId };
    if (userId) query.userId = userId;

    const expense = await ExpenseModel.findOne(query);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  /**
   * Create a new expense
   */
  static async createExpense(data: {
    type?: string;
    amount: number;
    category: string;
    subcategory?: string | null;
    categoryId: string;
    paymentMethod?: string;
    creditFrom?: string;
    currency?: string;
    description?: string;
    timestamp?: Date;
    trackerId?: string;
    userId?: string;
  }) {
    const {
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
      trackerId,
      userId,
    } = data;

    if (!amount || !category || !categoryId) {
      throw new Error('Missing required fields: amount, category, categoryId');
    }

    const expense = await ExpenseModel.create({
      type: type || 'expense',
      amount,
      category,
      subcategory: subcategory || null,
      categoryId,
      paymentMethod,
      creditFrom,
      currency: currency || 'INR',
      description,
      timestamp: timestamp || new Date(),
      trackerId: trackerId || 'default',
      userId,
    });

    return expense;
  }

  /**
   * Create multiple expenses at once
   */
  static async createBulkExpenses(
    expensesData: Array<{
      type?: string;
      amount: number;
      category: string;
      subcategory?: string | null;
      categoryId: string;
      paymentMethod?: string;
      creditFrom?: string;
      currency?: string;
      description?: string;
      timestamp?: Date;
    }>,
    commonData: { trackerId?: string; userId?: string; createdBy?: string; createdByName?: string }
  ) {
    const { trackerId, userId, createdBy, createdByName } = commonData;

    // Validate each expense before attempting to insert
    const validatedExpenses = expensesData.map((expense, index) => {
      const { amount, category, subcategory, categoryId } = expense;

      if (!amount || !category || !categoryId) {
        throw new Error(
          `Expense at index ${index}: Missing required fields (amount, category, categoryId)`
        );
      }

      return {
        type: expense.type || 'expense',
        amount,
        category,
        subcategory: subcategory || null,
        categoryId,
        paymentMethod: expense.paymentMethod,
        creditFrom: expense.creditFrom,
        currency: expense.currency || 'INR',
        description: expense.description,
        timestamp: expense.timestamp || new Date(),
        trackerId: trackerId || 'default',
        userId,
        createdBy,
        createdByName,
      };
    });

    try {
      // Use insertMany for efficient bulk insertion
      const createdExpenses = await ExpenseModel.insertMany(validatedExpenses, {
        ordered: true, // Stop on first error
        lean: false,
      });

      return createdExpenses;
    } catch (error: any) {
      console.error('Error in bulk expense creation:', error);
      throw new Error(`Failed to create expenses: ${error.message}`);
    }
  }

  /**
   * Update an expense
   */
  static async updateExpense(
    expenseId: string,
    updates: {
      type?: string;
      amount?: number;
      category?: string;
      subcategory?: string;
      categoryId?: string;
      paymentMethod?: string;
      creditFrom?: string;
      currency?: string;
      description?: string;
      timestamp?: Date;
      lastUpdatedBy?: string;
      lastUpdatedByName?: string;
    },
    userId?: string
  ) {
    const query: any = { _id: expenseId };
    if (userId) query.userId = userId;

    const expense = await ExpenseModel.findOneAndUpdate(query, updates, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  /**
   * Delete an expense
   */
  static async deleteExpense(expenseId: string, userId?: string) {
    const query: any = { _id: expenseId };
    if (userId) query.userId = userId;

    const expense = await ExpenseModel.findOneAndDelete(query);

    if (!expense) {
      throw new Error('Expense not found');
    }

    return { message: 'Expense deleted successfully' };
  }

  /**
   * Bulk delete expenses by IDs
   */
  static async bulkDeleteExpenses(expenseIds: string[], userId?: string) {
    const query: any = { _id: { $in: expenseIds } };
    if (userId) query.userId = userId;

    const result = await ExpenseModel.deleteMany(query);

    return {
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} expense(s) deleted successfully`,
    };
  }
}

export default ExpenseService;
