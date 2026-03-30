/**
 * Auth store concurrency and edge case tests.
 * Tests concurrent initialize guard, login-during-initialize, and logout race conditions.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore, resetInitializeGuard } from '@/contexts/authStore';
import { http } from '@/utils/http';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
  setOnUnauthorized: jest.fn(),
}));

const mockHttp = http as jest.Mocked<typeof http>;

const createMockUser = (overrides = {}) => ({
  _id: 'user-1',
  email: 'test@spentiva.com',
  firstName: 'Test',
  lastName: 'User',
  roleSlug: 'user',
  isVerified: true,
  mfaEnabled: false,
  ...overrides,
});

describe('AuthStore - Concurrency Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetInitializeGuard();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe('concurrent initialize guard', () => {
    it('only makes one API call when initialize is called concurrently', async () => {
      const user = createMockUser();
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('token')
        .mockResolvedValueOnce(JSON.stringify(user));

      mockHttp.get.mockResolvedValue({
        success: true,
        data: { user },
        message: 'OK',
        status: 200,
      });

      // Call initialize 3 times concurrently
      await Promise.all([
        useAuthStore.getState().initialize(),
        useAuthStore.getState().initialize(),
        useAuthStore.getState().initialize(),
      ]);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      // AsyncStorage.getItem should only be called for the first init
      // (2 calls: one for token, one for user)
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(2);
    });

    it('allows re-initialization after first one completes', async () => {
      const user = createMockUser();
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValue('token');
      // First call returns null for user cache, second returns user
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('token')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('token')
        .mockResolvedValueOnce(JSON.stringify(user));

      mockHttp.get
        .mockResolvedValueOnce({
          success: false,
          data: null,
          message: 'Server error',
          status: 500,
        })
        .mockResolvedValueOnce({
          success: true,
          data: { user },
          message: 'OK',
          status: 200,
        });

      // First initialize - ME fails, no cached user -> logged out
      await useAuthStore.getState().initialize();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);

      // Second initialize should work (guard released)
      await useAuthStore.getState().initialize();
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });
  });

  describe('logout during active session', () => {
    it('clears all auth data completely on logout', async () => {
      const user = createMockUser();
      useAuthStore.setState({
        user,
        token: 'active-token',
        isAuthenticated: true,
        isLoading: false,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });

  describe('updateUser edge cases', () => {
    it('does nothing when no current user', () => {
      useAuthStore.setState({ user: null });

      useAuthStore.getState().updateUser({ firstName: 'New' });

      expect(useAuthStore.getState().user).toBeNull();
    });

    it('merges partial updates into existing user', () => {
      const user = createMockUser();
      useAuthStore.setState({ user });

      useAuthStore.getState().updateUser({ firstName: 'Updated' });

      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('Updated');
      expect(state.user?.lastName).toBe('User'); // unchanged
    });
  });

  describe('login failure scenarios', () => {
    it('throws and clears state when fetchCurrentUser fails completely', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('new-token');
      mockHttp.get.mockResolvedValue({
        success: false,
        data: null,
        message: 'Internal Server Error',
        status: 500,
      });

      await expect(useAuthStore.getState().login('new-token')).rejects.toThrow(
        'Failed to fetch user data after login'
      );

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
    });

    it('handles network error during login gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('new-token');
      mockHttp.get.mockResolvedValue({
        success: false,
        data: null,
        message: 'Network error',
        status: 0,
      });

      await expect(useAuthStore.getState().login('new-token')).rejects.toThrow();

      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });
  });

  describe('fetchCurrentUser edge cases', () => {
    it('does nothing when no token in storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().fetchCurrentUser();

      expect(mockHttp.get).not.toHaveBeenCalled();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('handles ME returning unexpected data shape', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('token');
      mockHttp.get.mockResolvedValue({
        success: true,
        data: null,
        message: 'OK',
        status: 200,
      });

      await useAuthStore.getState().fetchCurrentUser();

      expect(useAuthStore.getState().user).toBeNull();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
