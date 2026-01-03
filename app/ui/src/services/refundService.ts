import { endpoints } from '../config/api';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../utils/http';
import { parseResponseData, parsePaginatedResponse } from '../utils/response-parser';
import {
  CreateRefundRequest,
  UpdateRefundStatusRequest,
  RefundQueryParams,
  RefundResponse,
  RefundsListResponse,
  RefundStatsResponse,
  Refund,
  RefundStatistics,
} from '../types/refund';

/**
 * Create a new refund
 */
export const createRefund = async (data: CreateRefundRequest): Promise<RefundResponse> => {
  const response = await postRequest(endpoints.refund.create, data);
  return {
    success: true,
    refund: parseResponseData(response, {}) as Refund,
  };
};

/**
 * Get refund by ID
 */
export const getRefundById = async (refundId: string): Promise<RefundResponse> => {
  const response = await getRequest(endpoints.refund.getById(refundId));
  return {
    success: true,
    refund: parseResponseData(response, {}) as Refund,
  };
};

/**
 * Get all refunds for a specific payment
 */
export const getRefundsByPayment = async (paymentId: string): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getByPayment(paymentId));
  const paginatedData = parsePaginatedResponse(response, 'refunds');

  return {
    success: true,
    refunds: paginatedData.items,
    total: paginatedData.total,
    page: 1,
    limit: 10,
  };
};

/**
 * Get all refunds for a specific user
 */
export const getUserRefunds = async (
  userId: string,
  params?: RefundQueryParams
): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getUserRefunds(userId), params);
  const paginatedData = parsePaginatedResponse(response, 'refunds');

  return {
    success: true,
    refunds: paginatedData.items,
    total: paginatedData.total,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Get all refunds (Admin only)
 */
export const getAllRefunds = async (params?: RefundQueryParams): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getAll, params);
  const paginatedData = parsePaginatedResponse(response, 'refunds');

  return {
    success: true,
    refunds: paginatedData.items,
    total: paginatedData.total,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Update refund status
 */
export const updateRefundStatus = async (
  refundId: string,
  data: UpdateRefundStatusRequest
): Promise<RefundResponse> => {
  const response = await patchRequest(endpoints.refund.updateStatus(refundId), data);
  return {
    success: true,
    refund: parseResponseData(response, {}) as Refund,
  };
};

/**
 * Delete refund
 */
export const deleteRefund = async (refundId: string): Promise<{ success: boolean }> => {
  const response = await deleteRequest(endpoints.refund.delete(refundId));
  return {
    success: parseResponseData(response, true) ?? true,
  };
};

/**
 * Get refund statistics
 */
export const getRefundStats = async (): Promise<RefundStatsResponse> => {
  const response = await getRequest(endpoints.refund.stats);
  return {
    success: true,
    stats: parseResponseData(response, {}) as RefundStatistics,
  };
};
