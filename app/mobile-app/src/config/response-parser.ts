import { AxiosResponse, AxiosError } from 'axios';

/**
 * Response Parser Utility
 * Standardizes API response and error handling
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Parse successful API responses
 */
export function parseResponse<T = any>(response: AxiosResponse): AxiosResponse<T> {
  // If response already has data property, return as is
  if (response.data) {
    return response;
  }

  // Otherwise wrap in standard format
  return {
    ...response,
    data: {
      success: true,
      data: response.data,
      statusCode: response.status,
    } as any,
  };
}

/**
 * Parse API errors into a consistent format
 */
export function parseError(error: AxiosError): ApiError {
  // Network error (no response)
  if (!error.response) {
    return {
      message: error.message || 'Network error. Please check your connection.',
      statusCode: 0,
    };
  }

  const { status, data } = error.response;

  // Handle different error formats from backend
  const errorData = data as any;

  // Standard error format
  if (errorData?.error || errorData?.message) {
    return {
      message: errorData.error || errorData.message || 'An error occurred',
      statusCode: status,
      errors: errorData.errors,
    };
  }

  // Validation errors
  if (errorData?.errors) {
    return {
      message: 'Validation failed',
      statusCode: status,
      errors: errorData.errors,
    };
  }

  // Default error message based on status code
  const defaultMessages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Unauthorized. Please log in again.',
    403: 'Forbidden. You don\'t have permission to access this resource.',
    404: 'Resource not found.',
    409: 'Conflict. The resource already exists.',
    422: 'Validation failed. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Internal server error. Please try again later.',
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };

  return {
    message: defaultMessages[status] || 'An unexpected error occurred',
    statusCode: status,
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: ApiError): boolean {
  return error.statusCode === 0;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ApiError): boolean {
  return error.statusCode === 401 || error.statusCode === 403;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: ApiError): boolean {
  return error.statusCode === 422 && !!error.errors;
}

/**
 * Get first validation error message
 */
export function getFirstValidationError(error: ApiError): string | null {
  if (!error.errors) return null;

  const firstKey = Object.keys(error.errors)[0];
  if (!firstKey) return null;

  const messages = error.errors[firstKey];
  return messages && messages.length > 0 ? messages[0] : null;
}
