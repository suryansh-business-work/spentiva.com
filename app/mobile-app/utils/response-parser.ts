/**
 * Response Parser Utility
 *
 * Safely extracts data from backend's standardized response structure:
 * {
 *   message: string,
 *   data: any,
 *   status: string,
 *   statusCode: number
 * }
 *
 * Handles nested data structures and prevents code from breaking
 * when data is missing or in unexpected format.
 */

// Standard backend response structure
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  status?: string;
  statusCode?: number;
}

// Success status codes
export const SUCCESS_CODES = [200, 201, 204];
export const ERROR_CODES = [400, 401, 403, 404, 500];

/**
 * Safely extracts data from response.data
 * Handles both response.data and response.data.data patterns
 */
export const parseResponseData = <T = any>(response: any, fallback: T | null = null): T | null => {
  try {
    // Check if response exists
    if (!response) {
      return fallback;
    }

    // If response.data exists
    if (response.data) {
      // Check if data has nested data (response.data.data)
      if (response.data.data !== undefined) {
        return response.data.data as T;
      }
      // Otherwise return response.data directly
      return response.data as T;
    }

    // If no data property, return the response itself (might be direct data)
    return response as T;
  } catch (error) {
    console.error('Error parsing response data:', error);
    return fallback;
  }
};

/**
 * Extracts message from response
 */
export const parseResponseMessage = (response: any, fallback = ''): string => {
  try {
    return response?.data?.message || response?.message || fallback;
  } catch (error) {
    console.error('Error parsing response message:', error);
    return fallback;
  }
};

/**
 * Extracts status code from response
 */
export const parseResponseStatus = (response: any): number | null => {
  try {
    return response?.data?.statusCode || response?.statusCode || response?.status || null;
  } catch (error) {
    console.error('Error parsing response status:', error);
    return null;
  }
};

/**
 * Checks if response indicates success
 */
export const isSuccessResponse = (response: any): boolean => {
  try {
    const statusCode = parseResponseStatus(response);
    if (statusCode) {
      return SUCCESS_CODES.includes(statusCode);
    }
    // Fallback: check if data exists
    return !!response?.data;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if response indicates error
 */
export const isErrorResponse = (response: any): boolean => {
  try {
    const statusCode = parseResponseStatus(response);
    if (statusCode) {
      return ERROR_CODES.includes(statusCode);
    }
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Safely extracts array data from response
 * Handles pagination data if present
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  count?: number;
}

export const parsePaginatedResponse = <T = any>(
  response: any,
  dataKey = 'data'
): PaginatedResponse<T> => {
  try {
    const data = parseResponseData(response);

    if (!data) {
      return { items: [], total: 0, page: 1, limit: 10 };
    }

    // Handle different pagination structures
    const items = Array.isArray(data[dataKey]) ? data[dataKey] : Array.isArray(data) ? data : [];

    const total = data.total || data.count || items.length;
    const page = data.page || 1;
    const limit = data.limit || 10;

    return {
      items,
      total,
      page,
      limit,
      count: data.count,
    };
  } catch (error) {
    console.error('Error parsing paginated response:', error);
    return { items: [], total: 0, page: 1, limit: 10 };
  }
};

/**
 * Extracts specific nested data with path
 * Example: extractNestedData(response, 'data.user.profile')
 */
export const extractNestedData = <T = any>(
  response: any,
  path: string,
  fallback: T | null = null
): T | null => {
  try {
    const keys = path.split('.');
    let current = response;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }

    return current as T;
  } catch (error) {
    console.error('Error extracting nested data:', error);
    return fallback;
  }
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T = any>(json: string, fallback: T | null = null): T | null => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Extracts error message from error response
 */
export const parseErrorMessage = (error: any): string => {
  try {
    // Check for axios error response
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // Check for direct error message
    if (error?.message) {
      return error.message;
    }

    // Check for string error
    if (typeof error === 'string') {
      return error;
    }

    return 'An unexpected error occurred';
  } catch (e) {
    return 'An unexpected error occurred';
  }
};

/**
 * Creates a standardized error object
 */
export interface ParsedError {
  message: string;
  statusCode?: number;
  data?: any;
}

export const parseError = (error: any): ParsedError => {
  return {
    message: parseErrorMessage(error),
    statusCode: error?.response?.status || error?.statusCode,
    data: error?.response?.data || error?.data,
  };
};
