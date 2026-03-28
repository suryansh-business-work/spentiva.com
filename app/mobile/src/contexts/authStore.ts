import { create } from 'zustand';
import type { User } from '@/types';
import {
  setAuthToken,
  clearAllAuthData,
  setUser as persistUser,
  getAuthToken,
  getUser,
} from '@/utils/storage';
import { http } from '@/utils/http';
import config from '@/config';
import { logger } from '@/utils/logger';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  initialize: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    try {
      const [token, user] = await Promise.all([
        getAuthToken(),
        getUser<User>(),
      ]);

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      logger.error('Failed to initialize auth');
      set({ isLoading: false });
    }
  },

  login: async (token: string) => {
    await setAuthToken(token);
    set({ token });
    await get().fetchCurrentUser();
    set({ isAuthenticated: true });
  },

  logout: async () => {
    await clearAllAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true });
      const token = await getAuthToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const userResult = await http.get<{ user: User }>(
        config.AUTH.ME,
      );

      if (userResult.success && userResult.data) {
        const { user } = userResult.data;
        await persistUser(user);
        set({ user });
      }

      set({ isLoading: false });
    } catch {
      logger.error('Failed to fetch current user');
      set({ isLoading: false });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, ...updates };
      persistUser(updated);
      set({ user: updated });
    }
  },
}));
