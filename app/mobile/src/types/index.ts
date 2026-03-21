/** Transaction type */
export type TransactionType = 'expense' | 'income';

/** Expense item within a parsed message */
export interface ExpenseItem {
  type: TransactionType;
  amount: number;
  category: string;
  subcategory: string;
  categoryId: string;
  paymentMethod: string;
  currency: string;
  description: string;
}

/** Full expense record */
export interface Expense extends ExpenseItem {
  _id: string;
  trackerId: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

/** Parsed expense from AI */
export interface ParsedExpense {
  expenses: ExpenseItem[];
  message: string;
}

/** Chat message */
export interface Message {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  expenses?: Expense[];
  createdAt: string;
}

/** User */
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  roleSlug: string;
  isVerified: boolean;
  mfaEnabled: boolean;
}

/** Organization */
export interface Organization {
  _id: string;
  name: string;
  slug: string;
}

/** Role */
export interface Role {
  _id: string;
  name: string;
  slug: string;
  permissions: Permission[];
}

/** Permission */
export interface Permission {
  resource: string;
  actions: string[];
}

/** Shared user on a tracker */
export interface SharedUser {
  userId: string;
  email: string;
  name: string;
  role: 'viewer' | 'editor';
  status: 'pending' | 'accepted' | 'rejected';
}

/** Tracker */
export interface Tracker {
  _id: string;
  name: string;
  type: 'personal' | 'business';
  description?: string;
  currency: string;
  botImage?: string;
  sharedWith: SharedUser[];
  createdAt: string;
  updatedAt: string;
}

/** Category */
export interface Category {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
  subcategories: string[];
  trackerId: string;
}

/** Analytics filter periods */
export type AnalyticsFilter =
  | 'today'
  | 'yesterday'
  | 'last7days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom'
  | 'all';

/** Analytics summary */
export interface AnalyticsSummary {
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  transactionCount: number;
  averageExpense: number;
  averageIncome: number;
}

/** Category-wise expense */
export interface CategoryExpense {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

/** Monthly expense */
export interface MonthlyExpense {
  month: string;
  expense: number;
  income: number;
}

/** Payment method expense */
export interface PaymentMethodExpense {
  method: string;
  amount: number;
  count: number;
}

/** Payment enums */
export enum PaymentMethod {
  CARD = 'card',
  UPI = 'upi',
  BANK_TRANSFER = 'bank_transfer',
}

export enum UserSelectedPlan {
  FREE = 'free',
  PRO = 'pro',
  BUSINESS_PRO = 'businesspro',
}

export enum PlanDuration {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum PaymentState {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

/** Payment record */
export interface Payment {
  _id: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentState: PaymentState;
  plan: UserSelectedPlan;
  planDuration: PlanDuration;
  timestamp: string;
}

/** Support ticket */
export type TicketType = 'PaymentRelated' | 'BugInApp' | 'DataLoss' | 'FeatureRequest' | 'Other';
export type TicketStatus = 'Open' | 'InProgress' | 'Closed' | 'Escalated';

export interface SupportTicket {
  _id: string;
  ticketId: string;
  type: TicketType;
  subject: string;
  description: string;
  status: TicketStatus;
  attachments: string[];
  updates: TicketUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketUpdate {
  message: string;
  by: string;
  createdAt: string;
}

/** Usage */
export interface UsageOverview {
  totalMessages: number;
  totalTokens: number;
  userMessages: number;
  aiMessages: number;
}

export interface DailyUsageData {
  date: string;
  messageCount: number;
  tokenCount: number;
}

/** Generic API response */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Refund */
export enum RefundStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export interface Refund {
  _id: string;
  paymentId: string;
  userId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  processedAt?: string;
  createdAt: string;
}
