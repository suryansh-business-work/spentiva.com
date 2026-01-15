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
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified: boolean;
  mfaEnabled: boolean;
  provider: string;
  role?: string;
  roleSlug?: string; // Role slug from external auth (e.g., 'admin', 'user')
  createdAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
}
