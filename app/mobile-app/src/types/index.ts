// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  accountType: 'free' | 'pro' | 'businesspro';
  avatar?: string;
  profilePhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tracker Types
export interface Tracker {
  id: string;
  userId: string;
  name: string;
  description?: string;
  currency: string;
  budget?: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  trackerId: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  trackerId: string;
  categoryId: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod?: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  trackerId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Usage Types
export interface UsageStats {
  totalRequests: number;
  limit: number;
  remaining: number;
  resetDate: string;
}

// Billing Types
export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'yearly';
  features: string[];
  limits: {
    trackers: number;
    transactions: number;
    apiCalls: number;
  };
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  planId: string;
  createdAt: string;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
}

// Support Ticket Types
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  updates?: TicketUpdate[];
}

export interface TicketUpdate {
  id: string;
  ticketId: string;
  message: string;
  isAdminResponse: boolean;
  createdAt: string;
}

// Analytics Types
export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
}

export interface DailySpending {
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface AnalyticsData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategorySpending[];
  dailyTrend: DailySpending[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation Types
export type RootStackParamList = {
  // Auth Stack
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };

  // Main Stack
  MainDrawer: undefined;
  Trackers: undefined;
  TrackerView: { trackerId: string };
  TrackerCategorySettings: { trackerId: string };
  Profile: undefined;
  Usage: undefined;
  Billing: undefined;
  UpcomingFeatures: undefined;
  Policy: undefined;

  // Admin Stack
  AdminDashboard: undefined;
  AdminSupportCreate: undefined;
  AdminSupportEdit: { ticketId: string };

  // Utility
  NotFound: undefined;
};

export type TrackerTabParamList = {
  Chat: { trackerId: string };
  Dashboard: { trackerId: string };
  Transactions: { trackerId: string };
  Settings: { trackerId: string };
};
