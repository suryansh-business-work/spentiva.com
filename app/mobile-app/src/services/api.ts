import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../../config/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      await AsyncStorage.removeItem('authToken');
      // You can add navigation logic here if needed
    }
    return Promise.reject(error);
  }
);

export default api;

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request made but no response
      return 'Network error. Please check your connection.';
    }
  }
  return 'An unexpected error occurred';
};
