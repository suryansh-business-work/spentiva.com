import { Platform } from 'react-native';

const ENV = {
  development: {
    API_URL: Platform.OS === 'web' ? 'http://localhost:5002' : 'http://10.0.2.2:5002',
    IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/esdata1',
  },
  production: {
    API_URL: 'https://server.spentiva.com',
    IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/esdata1',
  },
} as const;

type Environment = keyof typeof ENV;

const getEnvironment = (): Environment => {
  if (__DEV__) return 'development';
  return 'production';
};

const config = {
  ...ENV[getEnvironment()],

  /** Auth endpoints */
  AUTH: {
    ME: '/v1/api/auth/me',
    LOGIN: '/v1/api/auth/login',
    REGISTER: '/v1/api/auth/register',
    FORGOT_PASSWORD: '/v1/api/auth/forgot-password',
    RESET_PASSWORD: '/v1/api/auth/reset-password',
    PROFILE: '/v1/api/auth/profile',
  },

  /** API endpoints by feature */
  ENDPOINTS: {
    TRACKERS: {
      GET_ALL: '/v1/api/tracker/all',
      CREATE: '/v1/api/tracker/create',
      GET_BY_ID: (id: string) => `/v1/api/tracker/get/${id}`,
      UPDATE: (id: string) => `/v1/api/tracker/update/${id}`,
      DELETE: (id: string) => `/v1/api/tracker/delete/${id}`,
      SHARE: (id: string) => `/v1/api/tracker/share/${id}`,
      UNSHARE: (id: string) => `/v1/api/tracker/unshare/${id}`,
    },
    CATEGORIES: {
      GET_ALL: (trackerId: string) => `/v1/api/category/all?trackerId=${trackerId}`,
      CREATE: '/v1/api/category/create',
      UPDATE: (id: string) => `/v1/api/category/${id}`,
      DELETE: (id: string) => `/v1/api/category/${id}`,
    },
    EXPENSES: {
      ALL: (trackerId: string) => `/v1/api/expense/all?trackerId=${trackerId}`,
      BY_ID: (id: string) => `/v1/api/expense/${id}`,
      PARSE: '/v1/api/expense/parse',
      CREATE: '/v1/api/expense/create',
      UPDATE: (id: string) => `/v1/api/expense/${id}`,
      DELETE: (id: string) => `/v1/api/expense/${id}`,
      BULK_DELETE: '/v1/api/expense/bulk-delete',
    },
    ANALYTICS: {
      SUMMARY: (trackerId: string) => `/v1/api/analytics/summary?trackerId=${trackerId}`,
      BY_CATEGORY: (trackerId: string) => `/v1/api/analytics/by-category?trackerId=${trackerId}`,
      BY_MONTH: (trackerId: string) => `/v1/api/analytics/by-month?trackerId=${trackerId}`,
      BY_PAYMENT_METHOD: (trackerId: string) => `/v1/api/analytics/by-expense-from?trackerId=${trackerId}`,
      TOTAL: (trackerId: string) => `/v1/api/analytics/total?trackerId=${trackerId}`,
      EMAIL_REPORT: (trackerId: string) => `/v1/api/analytics/email-report?trackerId=${trackerId}`,
    },
    USAGE: {
      OVERVIEW: '/v1/api/usage/overview',
      GRAPHS: '/v1/api/usage/graphs',
    },
    SUPPORT: {
      CREATE: '/v1/api/support/tickets',
      GET_ALL: '/v1/api/support/tickets',
      GET_BY_ID: (id: string) => `/v1/api/support/tickets/${id}`,
      UPDATE_STATUS: (id: string) => `/v1/api/support/tickets/${id}/status`,
    },
    PAYMENT: {
      CREATE: '/v1/api/payment',
      GET_BY_ID: (id: string) => `/v1/api/payment/${id}`,
      GET_USER_PAYMENTS: (userId: string) => `/v1/api/payment/user/${userId}`,
      UPDATE_STATE: (id: string) => `/v1/api/payment/${id}/state`,
      STATS: '/v1/api/payment/stats',
    },
    REFUND: {
      CREATE: '/v1/api/refund',
      GET_BY_ID: (id: string) => `/v1/api/refund/${id}`,
      GET_USER_REFUNDS: (userId: string) => `/v1/api/refund/user/${userId}`,
      UPDATE_STATUS: (id: string) => `/v1/api/refund/${id}/status`,
    },
  },

  /** Plan configuration */
  PLANS: {
    FREE: { trackers: 3, messages: 300, price: 0 },
    PRO: { trackers: 20, messages: 500, monthlyPrice: 9, yearlyPrice: 86.4 },
    BUSINESS_PRO: { trackers: Infinity, messages: Infinity, monthlyPrice: 19, yearlyPrice: 182.4 },
  },
} as const;

export default config;
