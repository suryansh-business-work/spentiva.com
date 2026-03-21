import { http } from '@/utils/http';
import config from '@/config';
import type { AnalyticsSummary, CategoryExpense, MonthlyExpense, PaymentMethodExpense } from '@/types';

const { ANALYTICS } = config.ENDPOINTS;

export const analyticsService = {
  getSummary: (trackerId: string, params?: { period?: string }) => {
    const query = params?.period ? `?period=${params.period}` : '';
    return http.get<AnalyticsSummary>(`${ANALYTICS.SUMMARY(trackerId)}${query}`);
  },

  getByCategory: (trackerId: string, params?: { period?: string }) => {
    const query = params?.period ? `?period=${params.period}` : '';
    return http.get<CategoryExpense[]>(`${ANALYTICS.BY_CATEGORY(trackerId)}${query}`);
  },

  getByMonth: (trackerId: string, params?: { period?: string }) => {
    const query = params?.period ? `?period=${params.period}` : '';
    return http.get<MonthlyExpense[]>(`${ANALYTICS.BY_MONTH(trackerId)}${query}`);
  },

  getByPaymentMethod: (trackerId: string, params?: { period?: string }) => {
    const query = params?.period ? `?period=${params.period}` : '';
    return http.get<PaymentMethodExpense[]>(`${ANALYTICS.BY_PAYMENT_METHOD(trackerId)}${query}`);
  },

  getTotal: (trackerId: string) =>
    http.get<{ total: number }>(ANALYTICS.TOTAL(trackerId)),

  emailReport: (trackerId: string) =>
    http.post<{ success: boolean; message: string }>(ANALYTICS.EMAIL_REPORT(trackerId)),
};
