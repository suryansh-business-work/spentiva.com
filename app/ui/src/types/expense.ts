/**
 * Expense-related type definitions
 * Based on the backend API response structure
 */

import type { TransactionType } from './index';

/**
 * Single expense item (base structure)
 */
export interface ExpenseItem {
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency: string;
  description?: string;
}

/**
 * Expense object as returned by the API
 */
export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency: string;
  description?: string;
  timestamp: string;
  trackerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * API response when creating expense(s)
 */
export interface ExpenseResponse {
  success: boolean;
  message: string;
  data: {
    expenses: Expense[];
    count: number;
  };
}

/**
 * Parsed expense data from the AI parsing endpoint (supports multiple)
 */
export interface ParsedExpense {
  expenses: ExpenseItem[];
  error?: string;
}

/**
 * Expense data to be sent when creating (array format)
 */
export interface CreateExpenseData {
  expenses: ExpenseItem[];
  trackerId: string;
}
