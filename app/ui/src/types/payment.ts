// Payment-related enums matching backend implementation
export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  UPI = 'UPI',
  NET_BANKING = 'Net Banking',
  WALLET = 'Wallet',
  OTHER = 'Other',
}

export enum UserSelectedPlan {
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
  CANCELLED = 'cancelled',
}

export enum PaymentType {
  ONETIME = 'onetime',
  SUBSCRIPTION = 'subscription',
}

export enum Currency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

// GDPR-compliant card storage (tokenized, never raw card numbers)
export interface CardStore {
  token: string;
  last4: string;
  brand: string;
  expiryMonth?: number;
  expiryYear?: number;
}

// Main Payment interface matching backend response
export interface Payment {
  _id: string;
  userId: string | { _id: string; name: string; email: string };
  userName?: string;
  userEmail?: string;
  userSelectedPlan: UserSelectedPlan;
  planDuration: PlanDuration;
  amount: number;
  currency: Currency;
  paymentUsing: PaymentMethod;
  paymentType: PaymentType;
  paymentState: PaymentState;
  paymentStateReason?: string;
  cardData?: CardStore;
  paymentCountry?: string;
  paymentId?: string;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  paymentDate?: string;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types
export interface CreatePaymentRequest {
  userId: string;
  userSelectedPlan: UserSelectedPlan;
  planDuration: PlanDuration;
  amount: number;
  currency: Currency;
  paymentUsing: PaymentMethod;
  paymentType: PaymentType;
  paymentId: string;
  paymentCountry: string;
  cardData?: CardStore;
}

export interface UpdatePaymentStateRequest {
  state: PaymentState;
  stateReason?: string;
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
}

export interface PaymentStatistics {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  successRate: number;
  averageAmount: number;
  paymentsByMethod: Record<PaymentMethod, number>;
  paymentsByPlan: Record<UserSelectedPlan, number>;
  paymentsByState: Record<PaymentState, number>;
}

export interface PaymentQueryParams {
  userId?: string;
  state?: PaymentState;
  plan?: UserSelectedPlan;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentResponse {
  success: boolean;
  payment: Payment;
  message?: string;
}

export interface PaymentsListResponse {
  success: boolean;
  payments: Payment[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentStatsResponse {
  success: boolean;
  stats: PaymentStatistics;
}
