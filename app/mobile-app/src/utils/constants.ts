import { API_CONFIG } from '../config/api';

// API Base URLs
export const API_BASE_URL = API_CONFIG.baseURL;
export const API_VERSION = '/v1/api';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  THEME: 'theme',
  USER_DATA: 'userData',
  LAST_SYNC: 'lastSync',
} as const;

// App Constants
export const APP_NAME = 'Spentiva';
export const APP_VERSION = '1.0.0';

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Account Types
export const ACCOUNT_TYPES = {
  FREE: 'free',
  PRO: 'pro',
  BUSINESS_PRO: 'businesspro',
} as const;

// Plan Limits
export const PLAN_LIMITS = {
  free: {
    trackers: 3,
    transactions: 100,
    apiCalls: 1000,
  },
  pro: {
    trackers: 10,
    transactions: 1000,
    apiCalls: 10000,
  },
  businesspro: {
    trackers: -1, // unlimited
    transactions: -1, // unlimited
    apiCalls: 100000,
  },
};

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Ticket Status
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  CLOSED: 'closed',
} as const;

// Ticket Priority
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Currencies
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

// Payment Methods
export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'UPI',
  'Bank Transfer',
  'PayPal',
  'Other',
];

// Category Icons
export const CATEGORY_ICONS = [
  'food',
  'shopping-cart',
  'car',
  'home',
  'medical-bag',
  'school',
  'airplane',
  'gift',
  'phone',
  'laptop',
  'film',
  'dumbbell',
  'heart',
  'briefcase',
  'wallet',
];

// Category Colors
export const CATEGORY_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Light Blue
  '#F8B500', // Orange
  '#52B788', // Green
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  CREATE_SUCCESS: 'Created successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
} as const;

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss'Z'",
} as const;

// Animation Durations (in ms)
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 300,
  LONG: 500,
} as const;

// Debounce Delays (in ms)
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100,
} as const;
