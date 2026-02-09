import { useState, useEffect } from 'react';
import { Expense } from '../../../types';
import { endpoints } from '../../../config/api';
import { getRequest, putRequest, deleteRequest, postRequest } from '../../../utils/http';
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
  incomeCategories: any[];
  creditSources: any[];
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  loadExpenses: () => Promise<void>;
  loadMoreExpenses: () => void;
  handleSaveEdit: (id: string, updatedExpense: Partial<Expense>) => Promise<void>;
  handleConfirmDelete: (expenseId: string) => Promise<void>;
  handleBulkDelete: (ids: string[]) => Promise<void>;
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
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [creditSources, setCreditSources] = useState<string[]>([]);
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
      const [expenseRes, incomeRes, creditRes] = await Promise.all([
        getRequest(endpoints.categories.getAll(trackerId, 'expense')),
        getRequest(endpoints.categories.getAll(trackerId, 'income')),
        getRequest(endpoints.categories.getAll(trackerId, 'credit_mode')),
      ]);
      const expenseCats = parseResponseData<any>(expenseRes, {})?.categories || [];
      const incomeCats = parseResponseData<any>(incomeRes, {})?.categories || [];
      const creditCats = parseResponseData<any>(creditRes, {})?.categories || [];
      setCategories(expenseCats.map((c: any) => ({ id: c._id, name: c.name, subcategories: c.subcategories || [] })));
      setIncomeCategories(incomeCats.map((c: any) => ({ id: c._id, name: c.name, subcategories: c.subcategories || [] })));
      setCreditSources(creditCats.flatMap((c: any) => c.subcategories?.map((s: any) => s.name) || []));
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

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await postRequest(endpoints.expenses.bulkDelete, { ids });
      await loadExpenses();
      setSnackbar({
        open: true,
        message: `${ids.length} transaction(s) deleted successfully`,
        severity: 'success',
      });
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error bulk deleting expenses:', error);
      setSnackbar({ open: true, message: 'Failed to delete transactions', severity: 'error' });
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
    incomeCategories,
    creditSources,
    snackbar,
    loadExpenses,
    loadMoreExpenses,
    handleSaveEdit,
    handleConfirmDelete,
    handleBulkDelete,
    setSnackbar,
  };
};
