import { Payment } from './payment';

// Refund status enum
export enum RefundStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// Main Refund interface
export interface Refund {
  _id: string;
  paymentId: string;
  userId: string;
  payment?: Payment;
  userName?: string;
  userEmail?: string;
  amount: number;
  reason?: string;
  status: RefundStatus;
  processedAt?: string;
  gatewayRefundId?: string;
  gatewayResponse?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types
export interface CreateRefundRequest {
  paymentId: string;
  amount: number;
  reason?: string;
}

export interface UpdateRefundStatusRequest {
  status: RefundStatus;
  processedAt?: string;
  gatewayRefundId?: string;
  gatewayResponse?: Record<string, any>;
}

export interface RefundStatistics {
  totalRefunds: number;
  successfulRefunds: number;
  failedRefunds: number;
  pendingRefunds: number;
  totalRefundedAmount: number;
  refundRate: number;
  averageRefundAmount: number;
  refundsByStatus: Record<RefundStatus, number>;
}

export interface RefundQueryParams {
  userId?: string;
  paymentId?: string;
  status?: RefundStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RefundResponse {
  success: boolean;
  refund: Refund;
  message?: string;
}

export interface RefundsListResponse {
  success: boolean;
  refunds: Refund[];
  total: number;
  page: number;
  limit: number;
}

export interface RefundStatsResponse {
  success: boolean;
  stats: RefundStatistics;
}
