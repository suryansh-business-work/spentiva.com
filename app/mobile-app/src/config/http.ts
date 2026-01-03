import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseError, parseResponse } from './response-parser';

/**
 * HTTP Client Configuration
 * Axios instance with interceptors for authentication and error handling
 */

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Parse responses and handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return parseResponse(response);
      },
      async (error: AxiosError) => {
        // Handle 401 Unauthorized - Token expired
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          // TODO: Navigate to login screen
        }

        return Promise.reject(parseError(error));
      }
    );
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Get raw axios instance for advanced usage
  getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const httpClient = new HttpClient();
export default httpClient;
