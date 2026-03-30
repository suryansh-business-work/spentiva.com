import { create } from 'zustand';
import type { User } from '@/types';
import {
  setAuthToken,
  clearAllAuthData,
  setUser as persistUser,
  getAuthToken,
  getUser,
} from '@/utils/storage';
import { http, setOnUnauthorized } from '@/utils/http';
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

/** Prevents concurrent initialize calls */
let initializePromise: Promise<void> | null = null;

/** Reset for testing only */
export const resetInitializeGuard = () => {
  initializePromise = null;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    // Prevent concurrent initialization
    if (initializePromise) {
      await initializePromise;
      return;
    }
    initializePromise = (async () => {
      try {
        const [token, cachedUser] = await Promise.all([
          getAuthToken(),
          getUser<User>(),
        ]);

        if (!token) {
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
          return;
        }

        // Restore cached state immediately for fast startup
        if (cachedUser) {
          set({ token, user: cachedUser, isAuthenticated: true, isLoading: false });
        }

        // Re-validate token with server in background
        const result = await http.get<{ user: User }>(config.AUTH.ME);
        if (result.success && result.data) {
          const { user } = result.data;
          await persistUser(user);
          set({ token, user, isAuthenticated: true, isLoading: false });
        } else if (result.status === 401) {
          // Token expired/invalid - force logout
          await clearAllAuthData();
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        } else if (!cachedUser) {
          // No cached user and ME failed - can't authenticate
          await clearAllAuthData();
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
        // If ME failed but we have cached user, keep using cached data
      } catch {
        logger.error('Failed to initialize auth');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } finally {
        initializePromise = null;
      }
    })();
    await initializePromise;
  },

  login: async (token: string) => {
    await setAuthToken(token);
    set({ token });
    await get().fetchCurrentUser();
    const user = get().user;
    if (user) {
      set({ isAuthenticated: true });
    } else {
      // User fetch failed - clear token and remain unauthenticated
      await clearAllAuthData();
      set({ token: null, isAuthenticated: false });
      throw new Error('Failed to fetch user data after login');
    }
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
        set({ user, isLoading: false });
      } else {
        logger.error('ME endpoint failed', userResult.message);
        set({ isLoading: false });
      }
    } catch (error) {
      logger.error('Failed to fetch current user', error);
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

// Register 401 handler — no circular dependency since callback is set after store creation
setOnUnauthorized(() => {
  useAuthStore.getState().logout();
});
