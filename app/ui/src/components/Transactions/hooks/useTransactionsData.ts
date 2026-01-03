import { useState, useEffect } from 'react';
import { Expense } from '../../../types';
import { endpoints } from '../../../config/api';
import { getRequest, putRequest, deleteRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';

interface UseTransactionsDataProps {
  trackerId?: string;
}

interface UseTransactionsDataReturn {
  expenses: Expense[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  limit: number;
  categories: any[];
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  loadExpenses: () => Promise<void>;
  loadMoreExpenses: () => void;
  handleSaveEdit: (id: string, updatedExpense: Partial<Expense>) => Promise<void>;
  handleConfirmDelete: (expenseId: string) => Promise<void>;
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }) => void;
}

/**
 * Custom hook to manage transactions data fetching and mutations
 */
export const useTransactionsData = ({
  trackerId,
}: UseTransactionsDataProps): UseTransactionsDataReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [limit, setLimit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const loadExpenses = async () => {
    const isInitialLoad = expenses.length === 0;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await getRequest(endpoints.expenses.all, {
        trackerId,
        limit: limit.toString(),
      });
      const data = parseResponseData<any>(response, {});
      const expenses = data?.expenses || [];
      setExpenses(expenses);

      // Check if there are more expenses to load
      setHasMore(data.length >= limit);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setSnackbar({ open: true, message: 'Failed to load expenses', severity: 'error' });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadCategories = async () => {
    if (!trackerId) return;
    try {
      const response = await getRequest(endpoints.categories.getAll(trackerId));
      const data = parseResponseData<any>(response, {});
      const categories = data?.categories || [];
      setCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadMoreExpenses = () => {
    setLimit(prevLimit => prevLimit + 20);
  };

  const handleSaveEdit = async (id: string, updatedExpense: Partial<Expense>) => {
    try {
      await putRequest(endpoints.expenses.byId(id), updatedExpense);
      await loadExpenses();
      setSnackbar({ open: true, message: 'Expense updated successfully', severity: 'success' });

      // Trigger update in parent (App.tsx) to refresh total
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error updating expense:', error);
      setSnackbar({ open: true, message: 'Failed to update expense', severity: 'error' });
    }
  };

  const handleConfirmDelete = async (expenseId: string) => {
    try {
      await deleteRequest(endpoints.expenses.byId(expenseId));
      await loadExpenses();
      setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });

      // Trigger update in parent (App.tsx) to refresh total
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSnackbar({ open: true, message: 'Failed to delete expense', severity: 'error' });
    }
  };

  useEffect(() => {
    loadExpenses();
    if (trackerId) {
      loadCategories();
    }

    // Listen for expense updates from other components
    const handleExpenseUpdate = () => {
      setLimit(20);
      loadExpenses();
      if (trackerId) {
        loadCategories();
      }
    };

    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    window.addEventListener('categoriesUpdated', handleExpenseUpdate);
    return () => {
      window.removeEventListener('expenseUpdated', handleExpenseUpdate);
      window.removeEventListener('categoriesUpdated', handleExpenseUpdate);
    };
  }, [trackerId, limit]);

  return {
    expenses,
    loading,
    loadingMore,
    hasMore,
    limit,
    categories,
    snackbar,
    loadExpenses,
    loadMoreExpenses,
    handleSaveEdit,
    handleConfirmDelete,
    setSnackbar,
  };
};
