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
   * Add a missing category to the tracker
   */
  const addCategory = useCallback(
    async (categoryName: string, type: string = 'expense') => {
      if (!trackerId) return;

      try {
        await postRequest(endpoints.categories.create, {
          trackerId,
          name: categoryName,
          type,
          subcategories: [{ id: `${Date.now()}`, name: categoryName }],
        });
        // Reload categories and notify other components
        await loadCategories();
        window.dispatchEvent(new Event('categoriesUpdated'));
      } catch (error) {
        console.error('Error adding category:', error);
        throw error;
      }
    },
    [trackerId, loadCategories]
  );

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
        const missingCategories: string[] = apiData.missingCategories || [];

        // If missing categories, return a special error with missingCategories info
        if (missingCategories.length > 0) {
          const err = new Error(apiMessage) as any;
          err.missingCategories = missingCategories;
          throw err;
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
    addCategory,
    loadCategories,
  };
};
