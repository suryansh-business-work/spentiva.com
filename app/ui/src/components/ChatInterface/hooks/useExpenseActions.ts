import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest, postRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';
import { ParsedExpense, CreateExpenseData, Expense } from '../../../types/expense';

/**
 * Category structure
 */
interface Category {
  _id: string;
  trackerId: string;
  name: string;
  subcategories: Array<{ id: string; name: string }>;
}

/**
 * Custom hook to handle expense-related actions
 */
export const useExpenseActions = (trackerId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  /**
   * Load categories for the current tracker
   */
  const loadCategories = useCallback(async () => {
    if (!trackerId) return;

    try {
      const response = await getRequest(endpoints.categories.getAll(trackerId));
      const data = parseResponseData<any>(response, {});
      const categories = data?.categories || [];
      setCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [trackerId]);

  /**
   * Parse expense from natural language input
   */
  const parseExpense = useCallback(
    async (input: string): Promise<ParsedExpense> => {
      try {
        const response = await postRequest(endpoints.expenses.parse, {
          input,
          trackerId,
        });

        const data = parseResponseData<any>(response, null);
        return data || {};
      } catch (error: any) {
        console.error('Error parsing expense:', error);

        // Extract error details from API response using parseResponseData
        const errorResponse = error.response || {};
        const apiData = parseResponseData<any>(errorResponse, {});
        const apiMessage =
          apiData.message ||
          error.response?.data?.message ||
          error.message ||
          'Failed to parse expense';
        const missingCategories = apiData.missingCategories || [];

        // If missing categories, add "click here" link to the API message
        if (missingCategories.length > 0) {
          const errorWithLink = `CATEGORY_ERROR:: ${apiMessage} <a href="/tracker/${trackerId}/settings" style="color: #14B8A6; text-decoration: underline; cursor: pointer;">Click here</a> to add categories.`;
          throw new Error(errorWithLink);
        }

        // For all other errors, just show the API message as-is
        throw new Error(apiMessage);
      }
    },
    [trackerId]
  );

  /**
   * Create new expense(s) - supports single or multiple
   */
  const createExpense = useCallback(
    async (parsedData: ParsedExpense): Promise<Expense[]> => {
      if (!trackerId) {
        throw new Error('Tracker ID is required');
      }

      const expenseData: CreateExpenseData = {
        expenses: parsedData.expenses,
        trackerId,
      };

      try {
        const response = await postRequest(endpoints.expenses.create, expenseData);
        const data = parseResponseData<any>(response, {});
        const expenses = data?.expenses || [];

        if (!expenses || expenses.length === 0) {
          throw new Error('Invalid response from server');
        }

        return expenses;
      } catch (error) {
        console.error('Error creating expense:', error);
        throw new Error('Failed to create expense');
      }
    },
    [trackerId]
  );

  /**
   * Load categories on mount and when tracker changes
   */
  useEffect(() => {
    if (trackerId) {
      loadCategories();
    }

    const handleCategoriesUpdate = () => {
      if (trackerId) {
        loadCategories();
      }
    };

    window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
    return () => {
      window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    };
  }, [trackerId, loadCategories]);

  return {
    categories,
    parseExpense,
    createExpense,
    loadCategories,
  };
};
