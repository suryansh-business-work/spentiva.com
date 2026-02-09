export type TransactionType = 'expense' | 'income';

export interface OpenAIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Expense {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string | null;
  categoryId: string;
  paymentMethod: string;
  creditFrom?: string;
  currency: string;
  description?: string;
  timestamp: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ParsedExpense {
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string | null;
  categoryId: string;
  paymentMethod?: string;
  creditFrom?: string;
  currency: string;
  description?: string;
  timestamp?: Date;
}
