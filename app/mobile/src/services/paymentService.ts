import { http } from '@/utils/http';
import config from '@/config';
import type { Payment } from '@/types';

const { PAYMENT } = config.ENDPOINTS;

export const paymentService = {
  create: (data: { plan: string; planDuration: string; paymentMethod: string }) =>
    http.post<Payment>(PAYMENT.CREATE, data),

  getById: (id: string) => http.get<Payment>(PAYMENT.GET_BY_ID(id)),

  getUserPayments: (userId: string) => http.get<Payment[]>(PAYMENT.GET_USER_PAYMENTS(userId)),
};
