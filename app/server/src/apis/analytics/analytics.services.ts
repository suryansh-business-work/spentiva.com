import ExpenseModel from '../expense/expense.models';
import { AnalyticsQueryDto, DateFilter, TransactionTypeFilter } from './analytics.validators';
import { logger } from '../../utils/logger';

export class AnalyticsService {
  /**
   * Get date range based on filter
   */
  static getDateRange(query: AnalyticsQueryDto): { startDate: Date; endDate: Date } {
    const { filter, customStart, customEnd } = query;
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (filter) {
      case DateFilter.TODAY:
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case DateFilter.YESTERDAY:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case DateFilter.LAST_7_DAYS:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case DateFilter.THIS_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case DateFilter.LAST_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case DateFilter.THIS_YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case DateFilter.CUSTOM:
        if (customStart && customEnd) {
          startDate = new Date(customStart);
          endDate = new Date(customEnd);
        } else {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { startDate, endDate };
  }

  /**
   * Build match query from DTO and date range
   */
  private static buildMatchQuery(
    queryDto: AnalyticsQueryDto,
    dateRange: { startDate: Date; endDate: Date }
  ) {
    const matchQuery: Record<string, unknown> = {
      timestamp: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    };

    if (queryDto.trackerId) {
      matchQuery.trackerId = queryDto.trackerId;
    }

    if (queryDto.categoryId) {
      matchQuery.categoryId = queryDto.categoryId;
    }

    // Filter by transaction type
    if (queryDto.type && queryDto.type !== TransactionTypeFilter.ALL) {
      matchQuery.type = queryDto.type;
    }

    logger.info('[Analytics] Match query built', { matchQuery });
    return matchQuery;
  }

  /**
   * Get summary statistics with income/expense breakdown
   */
  static async getSummaryStats(queryDto: AnalyticsQueryDto) {
    const dateRange = this.getDateRange(queryDto);
    const baseMatch: Record<string, unknown> = {
      timestamp: { $gte: dateRange.startDate, $lte: dateRange.endDate },
    };

    if (queryDto.trackerId) {
      baseMatch.trackerId = queryDto.trackerId;
    }
    if (queryDto.categoryId) {
      baseMatch.categoryId = queryDto.categoryId;
    }

    const stats = await ExpenseModel.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: [{ $ifNull: ['$type', 'expense'] }, 'expense'] }, '$amount', 0],
            },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          expenseCount: {
            $sum: {
              $cond: [{ $eq: [{ $ifNull: ['$type', 'expense'] }, 'expense'] }, 1, 0],
            },
          },
          incomeCount: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, 1, 0],
            },
          },
          transactionCount: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalExpenses: 0,
        totalIncome: 0,
        netBalance: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        averageExpense: 0,
        averageIncome: 0,
      };
    }

    const s = stats[0];
    return {
      totalExpenses: s.totalExpenses,
      totalIncome: s.totalIncome,
      netBalance: s.totalIncome - s.totalExpenses,
      transactionCount: s.transactionCount,
      expenseCount: s.expenseCount,
      incomeCount: s.incomeCount,
      averageExpense: s.expenseCount > 0 ? s.totalExpenses / s.expenseCount : 0,
      averageIncome: s.incomeCount > 0 ? s.totalIncome / s.incomeCount : 0,
    };
  }

  /**
   * Get transactions grouped by category
   */
  static async getExpensesByCategory(queryDto: AnalyticsQueryDto) {
    const dateRange = this.getDateRange(queryDto);
    const matchQuery = this.buildMatchQuery(queryDto, dateRange);

    const categoryData = await ExpenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { category: '$category', type: { $ifNull: ['$type', 'expense'] } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    return categoryData;
  }

  /**
   * Get transactions grouped by month with income/expense split
   */
  static async getExpensesByMonth(queryDto: AnalyticsQueryDto) {
    const targetYear = queryDto.year || new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    const matchQuery: Record<string, unknown> = {
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (queryDto.trackerId) {
      matchQuery.trackerId = queryDto.trackerId;
    }

    const monthlyData = await ExpenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { $month: '$timestamp' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          expenses: {
            $sum: {
              $cond: [{ $eq: [{ $ifNull: ['$type', 'expense'] }, 'expense'] }, '$amount', 0],
            },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: 1,
          count: 1,
          expenses: 1,
          income: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    return monthlyData;
  }

  /**
   * Get expenses grouped by payment method (source)
   */
  static async getExpensesBySource(queryDto: AnalyticsQueryDto) {
    const dateRange = this.getDateRange(queryDto);
    const matchQuery = this.buildMatchQuery(queryDto, dateRange);

    // For source/payment method analysis, only look at expenses
    matchQuery.type = { $in: ['expense', null] } as unknown;

    const sourceData = await ExpenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    return sourceData;
  }

  /**
   * Get total expenses (and optionally income) for a period
   */
  static async getTotalExpenses(queryDto: AnalyticsQueryDto) {
    let startDate = new Date(0);
    let endDate = new Date();

    if (queryDto.filter) {
      const range = this.getDateRange(queryDto);
      startDate = range.startDate;
      endDate = range.endDate;
    }

    const matchQuery: Record<string, unknown> = {
      timestamp: { $gte: startDate, $lte: endDate },
    };

    if (queryDto.trackerId) {
      matchQuery.trackerId = queryDto.trackerId;
    }

    const result = await ExpenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalExpenses: {
            $sum: {
              $cond: [{ $eq: [{ $ifNull: ['$type', 'expense'] }, 'expense'] }, '$amount', 0],
            },
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0],
            },
          },
          total: { $sum: '$amount' },
        },
      },
    ]);

    if (result.length === 0) {
      return { total: 0, totalExpenses: 0, totalIncome: 0 };
    }

    return {
      total: result[0].total,
      totalExpenses: result[0].totalExpenses,
      totalIncome: result[0].totalIncome,
    };
  }
}

export default AnalyticsService;
