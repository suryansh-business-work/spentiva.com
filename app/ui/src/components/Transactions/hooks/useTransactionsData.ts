import { useState, useEffect, useCallback } from 'react';
import { Expense } from '../../../types';
import { endpoints } from '../../../config/api';
import { getRequest, putRequest, deleteRequest, postRequest } from '../../../utils/http';
import { parseResponseData } from '../../../utils/response-parser';

interface UseTransactionsDataProps {
  trackerId?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseTransactionsDataReturn {
  expenses: Expense[];
  loading: boolean;
  pagination: PaginationState;
  categories: any[];
  incomeCategories: any[];
  creditSources: any[];
  snackbar: { open: boolean; message: string; severity: 'success' | 'error' };
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
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
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]);
  const [creditSources, setCreditSources] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const loadExpenses = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getRequest(endpoints.expenses.all, {
        trackerId,
        limit: limit.toString(),
        page: page.toString(),
      });
      const data = parseResponseData<any>(response, {});
      const fetchedExpenses = data?.expenses || [];
      const paginationData = data?.pagination;

      setExpenses(fetchedExpenses);
      if (paginationData) {
        setPagination({
          page: paginationData.page,
          limit: paginationData.limit,
          total: paginationData.total,
          totalPages: paginationData.totalPages,
        });
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
      setSnackbar({ open: true, message: 'Failed to load expenses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [trackerId]);

  const loadCategories = useCallback(async () => {
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
  }, [trackerId]);

  const onPageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const onRowsPerPageChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleSaveEdit = async (id: string, updatedExpense: Partial<Expense>) => {
    try {
      await putRequest(endpoints.expenses.byId(id), updatedExpense);
      await loadExpenses(pagination.page, pagination.limit);
      setSnackbar({ open: true, message: 'Expense updated successfully', severity: 'success' });
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error updating expense:', error);
      setSnackbar({ open: true, message: 'Failed to update expense', severity: 'error' });
    }
  };

  const handleConfirmDelete = async (expenseId: string) => {
    try {
      await deleteRequest(endpoints.expenses.byId(expenseId));
      await loadExpenses(pagination.page, pagination.limit);
      setSnackbar({ open: true, message: 'Expense deleted successfully', severity: 'success' });
      window.dispatchEvent(new Event('expenseUpdated'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      setSnackbar({ open: true, message: 'Failed to delete expense', severity: 'error' });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await postRequest(endpoints.expenses.bulkDelete, { ids });
      await loadExpenses(1, pagination.limit);
      setPagination(prev => ({ ...prev, page: 1 }));
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
    loadExpenses(pagination.page, pagination.limit);
  }, [pagination.page, pagination.limit, loadExpenses]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const handleExpenseUpdate = () => {
      loadExpenses(pagination.page, pagination.limit);
      loadCategories();
    };
    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    window.addEventListener('categoriesUpdated', handleExpenseUpdate);
    return () => {
      window.removeEventListener('expenseUpdated', handleExpenseUpdate);
      window.removeEventListener('categoriesUpdated', handleExpenseUpdate);
    };
  }, [pagination.page, pagination.limit, loadExpenses, loadCategories]);

  return {
    expenses,
    loading,
    pagination,
    categories,
    incomeCategories,
    creditSources,
    snackbar,
    onPageChange,
    onRowsPerPageChange,
    handleSaveEdit,
    handleConfirmDelete,
    handleBulkDelete,
    setSnackbar,
  };
};
