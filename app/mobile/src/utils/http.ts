import config from '@/config';
import { getAuthToken } from '@/utils/storage';
import { logger } from '@/utils/logger';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  timeout?: number;
}

interface ApiResult<T> {
  success: boolean;
  data: T | null;
  message: string;
  status: number;
}

const API_TIMEOUT = 30000; // 30 seconds

const request = async <T>(
  endpoint: string,
  options: RequestOptions
): Promise<ApiResult<T>> => {
  try {
    const url = `${config.API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (!options.skipAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const fetchOptions: RequestInit = {
      method: options.method,
      headers,
    };

    if (options.body && options.method !== 'GET') {
      fetchOptions.body = JSON.stringify(options.body);
    }

    const controller = new AbortController();
    fetchOptions.signal = controller.signal;
    const timeoutId = setTimeout(() => controller.abort(), options.timeout ?? API_TIMEOUT);

    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } finally {
      clearTimeout(timeoutId);
    }

    const json = await response.json();

    if (!response.ok) {
      // Auto-logout on 401 Unauthorized
      if (response.status === 401 && !options.skipAuth) {
        const { clearAllAuthData } = await import('@/utils/storage');
        await clearAllAuthData();
        const { useAuthStore } = await import('@/contexts');
        useAuthStore.getState().logout();
      }
      return {
        success: false,
        data: null,
        message: json.message || 'Request failed',
        status: response.status,
      };
    }

    return {
      success: true,
      data: json.data ?? json,
      message: json.message || 'Success',
      status: response.status,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      logger.error(`API Request timeout: ${endpoint}`);
      return {
        success: false,
        data: null,
        message: 'Request timed out. Please check your connection.',
        status: 0,
      };
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`API Request failed: ${endpoint}`, error);
    return {
      success: false,
      data: null,
      message,
      status: 0,
    };
  }
};

export const http = {
  get: <T>(endpoint: string, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'POST', body, headers }),

  put: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PUT', body, headers }),

  patch: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'PATCH', body, headers }),

  delete: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, { method: 'DELETE', body, headers }),
};
