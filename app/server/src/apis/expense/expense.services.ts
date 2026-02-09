import ExpenseModel from './expense.models';
import { ExpenseParser } from '../../services/expenseParser';

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
