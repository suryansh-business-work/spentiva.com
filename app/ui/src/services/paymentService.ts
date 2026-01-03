import { endpoints } from '../config/api';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../utils/http';
import { parseResponseData, parsePaginatedResponse } from '../utils/response-parser';
import {
  Payment,
  PaymentStatistics,
  CreatePaymentRequest,
  UpdatePaymentStateRequest,
  PaymentQueryParams,
  PaymentResponse,
  PaymentsListResponse,
  PaymentStatsResponse,
} from '../types/payment';

/**
 * Create a new payment
 */
export const createPayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
  const response = await postRequest(endpoints.payment.create, data);
  return {
    success: true,
    payment: parseResponseData(response, {}) as Payment,
  };
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await getRequest(endpoints.payment.getById(paymentId));
  return {
    success: true,
    payment: parseResponseData(response, {}) as Payment,
  };
};

/**
 * Get all payments for a specific user
 */
export const getUserPayments = async (
  userId: string,
  params?: PaymentQueryParams
): Promise<PaymentsListResponse> => {
  const response = await getRequest(endpoints.payment.getUserPayments(userId), params);
  const paginatedData = parsePaginatedResponse(response, 'payments');

  return {
    success: true,
    payments: paginatedData.items,
    total: paginatedData.total,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Get all payments (Admin only)
 */
export const getAllPayments = async (
  params?: PaymentQueryParams
): Promise<PaymentsListResponse> => {
  const response = await getRequest(endpoints.payment.getAll, params);
  const paginatedData = parsePaginatedResponse(response, 'payments');

  return {
    success: true,
    payments: paginatedData.items,
    total: paginatedData.total,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Update payment state
 */
export const updatePaymentState = async (
  paymentId: string,
  data: UpdatePaymentStateRequest
): Promise<PaymentResponse> => {
  const response = await patchRequest(endpoints.payment.updateState(paymentId), data);
  return {
    success: true,
    payment: parseResponseData(response, {}) as Payment,
  };
};

/**
 * Delete payment (GDPR - Right to be forgotten)
 */
export const deletePayment = async (paymentId: string): Promise<{ success: boolean }> => {
  const response = await deleteRequest(endpoints.payment.delete(paymentId));
  return {
    success: parseResponseData(response, true) ?? true,
  };
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<PaymentStatsResponse> => {
  const response = await getRequest(endpoints.payment.stats);
  return {
    success: true,
    stats: parseResponseData(response, {}) as PaymentStatistics,
  };
};

/**
 * Expire pending payments older than specified minutes
 */
export const expirePendingPayments = async (
  expiryMinutes: number = 30
): Promise<{ success: boolean; expiredCount: number }> => {
  const response = await postRequest(endpoints.payment.expirePending, { expiryMinutes });
  const data = parseResponseData(response, { expiredCount: 0 });
  return {
    success: true,
    expiredCount: data?.expiredCount || 0,
  };
};
