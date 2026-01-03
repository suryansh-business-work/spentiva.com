// Analytics Types
export interface AnalyticsFilter {
  filter:
    | 'today'
    | 'yesterday'
    | 'last7days'
    | 'thisMonth'
    | 'lastMonth'
    | 'thisYear'
    | 'custom'
    | 'all';
  customStart?: string; // YYYY-MM-DD
  customEnd?: string; // YYYY-MM-DD
  trackerId?: string;
  categoryId?: string;
  year?: number;
}

export interface AnalyticsSummary {
  total: number;
  average: number;
  count: number;
}

export interface CategoryExpense {
  category: string;
  total: number;
  count: number;
}

export interface MonthlyExpense {
  month: number;
  total: number;
  count: number;
}

export interface PaymentMethodExpense {
  paymentMethod: string;
  total: number;
  count: number;
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  data: {
    stats: AnalyticsSummary;
  };
}

export interface AnalyticsByCategoryResponse {
  success: boolean;
  data: CategoryExpense[];
}

export interface AnalyticsByMonthResponse {
  success: boolean;
  data: MonthlyExpense[];
}

export interface AnalyticsByPaymentMethodResponse {
  success: boolean;
  data: PaymentMethodExpense[];
}

export interface AnalyticsTotalResponse {
  success: boolean;
  data: {
    total: number;
  };
}
