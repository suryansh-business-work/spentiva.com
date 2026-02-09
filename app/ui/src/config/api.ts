import { getAuthEndpoint } from './auth-config';

export const getApiUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8002/v1/api';
  }
  return 'https://server.spentiva.com/v1/api';
};

// All endpoint URLs organized by domain
export const endpoints = {
  auth: {
    // External auth server endpoints (from auth-config)
    me: getAuthEndpoint('me'),
    role: getAuthEndpoint('role'),
  },
  trackers: {
    getAll: `${getApiUrl()}/tracker/all`,
    create: `${getApiUrl()}/tracker/create`,
    update: (id: string) => `${getApiUrl()}/tracker/update/${id}`,
    delete: (id: string) => `${getApiUrl()}/tracker/delete/${id}`,
    deleteRequest: (id: string) => `${getApiUrl()}/tracker/delete-request/${id}`,
    deleteConfirm: (id: string) => `${getApiUrl()}/tracker/delete-confirm/${id}`,
    byId: (id: string) => `${getApiUrl()}/tracker/get/${id}`,
    share: (id: string) => `${getApiUrl()}/tracker/share/${id}`,
    unshare: (id: string) => `${getApiUrl()}/tracker/unshare/${id}`,
    resendInvite: (id: string) => `${getApiUrl()}/tracker/resend-invite/${id}`,
    respondInvite: (id: string) => `${getApiUrl()}/tracker/respond-invite/${id}`,
  },
  categories: {
    getAll: (trackerId: string, type?: string) =>
      `${getApiUrl()}/category/all?trackerId=${trackerId}${type ? `&type=${type}` : ''}`,
    create: `${getApiUrl()}/category/create`,
    getById: (id: string) => `${getApiUrl()}/category/${id}`,
    update: (id: string) => `${getApiUrl()}/category/${id}`,
    delete: (id: string) => `${getApiUrl()}/category/${id}`,
  },
  expenses: {
    base: `${getApiUrl()}/expenses`,
    all: `${getApiUrl()}/expense/all`,
    byId: (id: string) => `${getApiUrl()}/expense/${id}`,
    parse: `${getApiUrl()}/expense/parse`,
    create: `${getApiUrl()}/expense/create`,
    update: (id: string) => `${getApiUrl()}/expense/${id}`,
    delete: (id: string) => `${getApiUrl()}/expense/${id}`,
    bulkDelete: `${getApiUrl()}/expense/bulk-delete`,
  },
  analytics: {
    summary: `${getApiUrl()}/analytics/summary`,
    byCategory: `${getApiUrl()}/analytics/by-category`,
    byMonth: `${getApiUrl()}/analytics/by-month`,
    byPaymentMethod: `${getApiUrl()}/analytics/by-expense-from`,
    total: `${getApiUrl()}/analytics/total`,
    emailReport: `${getApiUrl()}/analytics/email-report`,
  },
  usage: {
    overview: `${getApiUrl()}/usage/overview`,
    graphs: `${getApiUrl()}/usage/graphs`,
    trackerStats: (trackerId: string) => `${getApiUrl()}/usage/tracker/${trackerId}/stats`,
    trackerGraphs: (trackerId: string) => `${getApiUrl()}/usage/tracker/${trackerId}/graphs`,
    trackerLogs: (trackerId: string) => `${getApiUrl()}/usage/tracker/${trackerId}/logs`,
  },
  usageLogs: {
    getAll: `${getApiUrl()}/usage-logs`,
    deleteByTracker: (trackerId: string) => `${getApiUrl()}/usage-logs/tracker/${trackerId}`,
    deleteAllUser: `${getApiUrl()}/usage-logs/user`,
  },
  admin: {
    stats: `${getApiUrl()}/admin/stats`,
    users: `${getApiUrl()}/admin/users`,
    userById: (userId: string) => `${getApiUrl()}/admin/users/${userId}`,
    updateUser: (userId: string) => `${getApiUrl()}/admin/users/${userId}`,
    deleteUser: (userId: string) => `${getApiUrl()}/admin/users/${userId}`,
  },
  support: {
    createTicket: `${getApiUrl()}/support/tickets`,
    getTickets: `${getApiUrl()}/support/tickets`,
    getStats: `${getApiUrl()}/support/tickets/stats`,
    getTicketById: (ticketId: string) => `${getApiUrl()}/support/tickets/${ticketId}`,
    updateStatus: (ticketId: string) => `${getApiUrl()}/support/tickets/${ticketId}/status`,
    addAttachment: (ticketId: string) => `${getApiUrl()}/support/tickets/${ticketId}/attachments`,
    addUpdate: (ticketId: string) => `${getApiUrl()}/support/tickets/${ticketId}/updates`,
    deleteTicket: (ticketId: string) => `${getApiUrl()}/support/tickets/${ticketId}`,
  },
  imagekit: {
    upload: `${getApiUrl()}/imagekit/upload`,
  },
  payment: {
    create: `${getApiUrl()}/payment`,
    getById: (paymentId: string) => `${getApiUrl()}/payment/${paymentId}`,
    getUserPayments: (userId: string) => `${getApiUrl()}/payment/user/${userId}`,
    updateState: (paymentId: string) => `${getApiUrl()}/payment/${paymentId}/state`,
    getAll: `${getApiUrl()}/payment`,
    delete: (paymentId: string) => `${getApiUrl()}/payment/${paymentId}`,
    stats: `${getApiUrl()}/payment/stats`,
    expirePending: `${getApiUrl()}/payment/expire-pending`,
  },
  refund: {
    create: `${getApiUrl()}/refund`,
    getById: (refundId: string) => `${getApiUrl()}/refund/${refundId}`,
    getByPayment: (paymentId: string) => `${getApiUrl()}/refund/payment/${paymentId}`,
    getUserRefunds: (userId: string) => `${getApiUrl()}/refund/user/${userId}`,
    updateStatus: (refundId: string) => `${getApiUrl()}/refund/${refundId}/status`,
    getAll: `${getApiUrl()}/refund`,
    delete: (refundId: string) => `${getApiUrl()}/refund/${refundId}`,
    stats: `${getApiUrl()}/refund/stats`,
  },
  reportSchedule: {
    create: `${getApiUrl()}/report-schedule/create`,
    getAll: `${getApiUrl()}/report-schedule/all`,
    byTracker: (trackerId: string) => `${getApiUrl()}/report-schedule/tracker/${trackerId}`,
    update: (id: string) => `${getApiUrl()}/report-schedule/update/${id}`,
    delete: (id: string) => `${getApiUrl()}/report-schedule/delete/${id}`,
  },
};
