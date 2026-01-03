/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Environment-based API URLs
const ENV = process.env.NODE_ENV || 'development';

const API_URLS = {
  development: 'http://localhost:8002',
  production: 'https://api.spentiva.com',
};

export const API_CONFIG = {
  baseURL: API_URLS[ENV as keyof typeof API_URLS] || API_URLS.development,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// API Endpoints
export const endpoints = {
  auth: {
    login: '/v1/api/auth/login',
    signup: '/v1/api/auth/signup',
    logout: '/v1/api/auth/logout',
    refreshToken: '/v1/api/auth/refresh-token',
    forgotPassword: '/v1/api/auth/forgot-password',
    resetPassword: '/v1/api/auth/reset-password',
    verifyEmail: '/v1/api/auth/verify-email',
    me: '/v1/api/auth/me',
  },
  user: {
    profile: '/v1/api/users/profile',
    updateProfile: '/v1/api/users/profile',
    changePassword: '/v1/api/users/change-password',
  },
  expenses: {
    list: '/v1/api/expenses',
    create: '/v1/api/expenses',
    update: (id: string) => `/v1/api/expenses/${id}`,
    delete: (id: string) => `/v1/api/expenses/${id}`,
    parse: '/v1/api/expenses/parse',
  },
  categories: {
    list: '/v1/api/categories',
    create: '/v1/api/categories',
    update: (id: string) => `/v1/api/categories/${id}`,
    delete: (id: string) => `/v1/api/categories/${id}`,
  },
};

export default endpoints;
