import api, { handleApiError } from './api';
import { Tracker, Category, Transaction, ChatMessage, PaginatedResponse, AnalyticsData } from '../types';

export const trackerService = {
  // Tracker CRUD
  getTrackers: async (): Promise<Tracker[]> => {
    try {
      const response = await api.get('/tracker/all');
      return response.data.data.trackers || [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  getTracker: async (trackerId: string): Promise<Tracker> => {
    try {
      const response = await api.get(`/tracker/${trackerId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createTracker: async (data: Partial<Tracker>): Promise<Tracker> => {
    try {
      const response = await api.post('/tracker', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateTracker: async (trackerId: string, data: Partial<Tracker>): Promise<Tracker> => {
    try {
      const response = await api.put(`/tracker/update/${trackerId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteTracker: async (trackerId: string): Promise<void> => {
    try {
      await api.delete(`/tracker/${trackerId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Category CRUD
  getCategories: async (trackerId: string): Promise<Category[]> => {
    try {
      const response = await api.get(`/tracker/${trackerId}/categories`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createCategory: async (trackerId: string, data: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.post(`/tracker/${trackerId}/categories`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateCategory: async (trackerId: string, categoryId: string, data: Partial<Category>): Promise<Category> => {
    try {
      const response = await api.put(`/tracker/${trackerId}/categories/${categoryId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteCategory: async (trackerId: string, categoryId: string): Promise<void> => {
    try {
      await api.delete(`/tracker/${trackerId}/categories/${categoryId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Transaction CRUD
  getTransactions: async (
    trackerId: string,
    params?: { page?: number; limit?: number; categoryId?: string; startDate?: string; endDate?: string }
  ): Promise<PaginatedResponse<Transaction>> => {
    try {
      const response = await api.get(`/tracker/${trackerId}/transactions`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  createTransaction: async (trackerId: string, data: Partial<Transaction>): Promise<Transaction> => {
    try {
      const response = await api.post(`/tracker/${trackerId}/transactions`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  updateTransaction: async (trackerId: string, transactionId: string, data: Partial<Transaction>): Promise<Transaction> => {
    try {
      const response = await api.put(`/tracker/${trackerId}/transactions/${transactionId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  deleteTransaction: async (trackerId: string, transactionId: string): Promise<void> => {
    try {
      await api.delete(`/tracker/${trackerId}/transactions/${transactionId}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Chat / AI
  getChatHistory: async (trackerId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get(`/tracker/${trackerId}/chat`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  sendChatMessage: async (trackerId: string, message: string): Promise<ChatMessage> => {
    try {
      const response = await api.post(`/tracker/${trackerId}/chat`, { message });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Analytics
  getAnalytics: async (
    trackerId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<AnalyticsData> => {
    try {
      const response = await api.get(`/tracker/${trackerId}/analytics`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};
