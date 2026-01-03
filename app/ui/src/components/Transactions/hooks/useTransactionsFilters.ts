import { useState, useEffect, useMemo } from 'react';
import { Expense } from '../../../types';

interface UseTransactionsFiltersProps {
  expenses: Expense[];
}

interface UseTransactionsFiltersReturn {
  filteredExpenses: Expense[];
  searchTerm: string;
  categoryFilter: string;
  paymentFilter: string;
  sortBy: string;
  filterCategories: string[];
  filterPaymentMethods: string[];
  setSearchTerm: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setPaymentFilter: (value: string) => void;
  setSortBy: (value: string) => void;
}

/**
 * Custom hook to manage filtering and sorting of transactions
 */
export const useTransactionsFilters = ({
  expenses,
}: UseTransactionsFiltersProps): UseTransactionsFiltersReturn => {
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Ensure expenses is always an array and stable reference
  const safeExpenses = useMemo(() => (Array.isArray(expenses) ? expenses : []), [expenses]);

  const filterAndSortExpenses = () => {
    let filtered = [...safeExpenses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        expense =>
          expense.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(expense => expense.paymentMethod === paymentFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'date-asc':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    filterAndSortExpenses();
  }, [safeExpenses, searchTerm, categoryFilter, paymentFilter, sortBy]);

  const filterCategories = Array.from(new Set(safeExpenses.map(e => e.category)));
  const filterPaymentMethods = Array.from(
    new Set(safeExpenses.map(e => e.paymentMethod).filter((pm): pm is string => pm !== undefined))
  );

  return {
    filteredExpenses,
    searchTerm,
    categoryFilter,
    paymentFilter,
    sortBy,
    filterCategories,
    filterPaymentMethods,
    setSearchTerm,
    setCategoryFilter,
    setPaymentFilter,
    setSortBy,
  };
};
