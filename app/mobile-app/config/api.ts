export const getApiUrl = () => {
  // Use __DEV__ global which is available in React Native
  if (__DEV__) {
    // For Android emulator: 10.0.2.2 is the special IP to access host machine's localhost
    // For iOS simulator and web: localhost works fine
    return 'http://10.0.2.2:8002/v1/api';
  }
  return 'https://api.spentiva.com/v1/api';
};

// All endpoint URLs organized by domain
export const endpoints = {
  auth: {
    // OTP-based authentication (existing)
    sendOtp: `${getApiUrl()}/auth/send-otp`,
    verifyOtp: `${getApiUrl()}/auth/verify-otp`,

    // Email/Password authentication (from Swagger)
    login: `${getApiUrl()}/auth/login`,
    signup: `${getApiUrl()}/auth/signup`,

    // User profile
    me: `${getApiUrl()}/auth/me`,
    profile: `${getApiUrl()}/auth/profile`,
    profilePhoto: `${getApiUrl()}/auth/profile-photo`,

    // Email verification
    sendEmailOtp: `${getApiUrl()}/auth/send-email-otp`,
    verifyEmailOtp: `${getApiUrl()}/auth/verify-email-otp`,
    sendVerificationOtp: `${getApiUrl()}/auth/send-verification-otp`,
    verifyEmail: `${getApiUrl()}/auth/verify-email`,

    // Password management
    forgotPassword: `${getApiUrl()}/auth/forgot-password`,
    resetPassword: `${getApiUrl()}/auth/reset-password`,
  },
  trackers: {
    getAll: `${getApiUrl()}/tracker/all`,
    create: `${getApiUrl()}/tracker/create`,
    update: (id: string) => `${getApiUrl()}/tracker/update/${id}`,
    delete: (id: string) => `${getApiUrl()}/tracker/delete/${id}`,
    byId: (id: string) => `${getApiUrl()}/tracker/get/${id}`,
  },
  categories: {
    getAll: (trackerId: string) => `${getApiUrl()}/category/all?trackerId=${trackerId}`,
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
  },
  analytics: {
    summary: `${getApiUrl()}/analytics/summary`,
    byCategory: `${getApiUrl()}/analytics/by-category`,
    byMonth: `${getApiUrl()}/analytics/by-month`,
    byPaymentMethod: `${getApiUrl()}/analytics/by-expense-from`,
    total: `${getApiUrl()}/analytics/total`,
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
};
