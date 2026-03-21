import { http } from '@/utils/http';
import config from '@/config';
import type { Expense, PaginatedResponse } from '@/types';

const { EXPENSES } = config.ENDPOINTS;

export const expenseService = {
  getAll: (trackerId: string, params?: { page?: number; limit?: number; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.sort) query.set('sort', params.sort);
    const qs = query.toString();
    const url = `${EXPENSES.ALL(trackerId)}${qs ? `?${qs}` : ''}`;
    return http.get<PaginatedResponse<Expense>['data']>(url);
  },

  getById: (trackerId: string, id: string) =>
    http.get<Expense>(EXPENSES.BY_ID(trackerId, id)),

  create: (data: {
    trackerId: string;
    type: string;
    amount: number;
    category: string;
    description: string;
    paymentMethod: string;
    currency: string;
  }) => http.post<Expense>(EXPENSES.CREATE, data),

  update: (id: string, data: Partial<Expense>) =>
    http.put<Expense>(EXPENSES.UPDATE(id), data),

  delete: (id: string) =>
    http.delete<{ success: boolean; message: string }>(EXPENSES.DELETE(id)),

  bulkDelete: (ids: string[]) =>
    http.post<{ success: boolean; message: string }>(EXPENSES.BULK_DELETE, { ids }),

  parse: (data: { message: string; trackerId: string }) =>
    http.post<{ expenses: Expense[]; message: string }>(EXPENSES.PARSE, data),
};
