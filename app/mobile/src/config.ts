import Constants from 'expo-constants';

const ENV = {
  development: {
    API_URL: 'http://localhost:5002',
    IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/esdata1',
  },
  production: {
    API_URL: 'https://api.spentiva.com',
    IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/esdata1',
  },
} as const;

type Environment = keyof typeof ENV;

const getEnvironment = (): Environment => {
  const channel = Constants.expoConfig?.extra?.eas?.channel;
  if (channel === 'production') return 'production';
  return 'development';
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
      GET_ALL: '/api/tracker',
      CREATE: '/api/tracker',
      UPDATE: (id: string) => `/api/tracker/${id}`,
      DELETE: (id: string) => `/api/tracker/${id}`,
      SHARE: (id: string) => `/api/tracker/${id}/share`,
      UNSHARE: (id: string) => `/api/tracker/${id}/unshare`,
    },
    CATEGORIES: {
      GET_ALL: (trackerId: string) => `/api/category/${trackerId}`,
      CREATE: '/api/category',
      UPDATE: (id: string) => `/api/category/${id}`,
      DELETE: (id: string) => `/api/category/${id}`,
    },
    EXPENSES: {
      ALL: (trackerId: string) => `/api/expense/${trackerId}`,
      BY_ID: (trackerId: string, id: string) => `/api/expense/${trackerId}/${id}`,
      PARSE: '/api/expense/parse',
      CREATE: '/api/expense',
      UPDATE: (id: string) => `/api/expense/${id}`,
      DELETE: (id: string) => `/api/expense/${id}`,
      BULK_DELETE: '/api/expense/bulk-delete',
    },
    ANALYTICS: {
      SUMMARY: (trackerId: string) => `/api/analytics/${trackerId}/summary`,
      BY_CATEGORY: (trackerId: string) => `/api/analytics/${trackerId}/by-category`,
      BY_MONTH: (trackerId: string) => `/api/analytics/${trackerId}/by-month`,
      BY_PAYMENT_METHOD: (trackerId: string) => `/api/analytics/${trackerId}/by-payment-method`,
      TOTAL: (trackerId: string) => `/api/analytics/${trackerId}/total`,
      EMAIL_REPORT: (trackerId: string) => `/api/analytics/${trackerId}/email-report`,
    },
    USAGE: {
      OVERVIEW: '/api/usage/overview',
      GRAPHS: '/api/usage/graphs',
    },
    SUPPORT: {
      CREATE: '/api/support',
      GET_ALL: '/api/support',
      GET_BY_ID: (id: string) => `/api/support/${id}`,
      UPDATE_STATUS: (id: string) => `/api/support/${id}/status`,
    },
    PAYMENT: {
      CREATE: '/api/payment',
      GET_BY_ID: (id: string) => `/api/payment/${id}`,
      GET_USER_PAYMENTS: (userId: string) => `/api/payment/user/${userId}`,
      UPDATE_STATE: (id: string) => `/api/payment/${id}/state`,
      STATS: '/api/payment/statistics',
    },
    REFUND: {
      CREATE: '/api/refund',
      GET_BY_ID: (id: string) => `/api/refund/${id}`,
      GET_USER_REFUNDS: (userId: string) => `/api/refund/user/${userId}`,
      UPDATE_STATUS: (id: string) => `/api/refund/${id}/status`,
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
