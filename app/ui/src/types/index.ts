export interface Expense {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  description?: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  expense?: Expense; // Legacy support
  expenses?: Expense[]; // New array support
  timestamp: Date;
}

export interface ParsedExpense {
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod?: string;
  description?: string;
  timestamp?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  role?: string;
  accountType?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
