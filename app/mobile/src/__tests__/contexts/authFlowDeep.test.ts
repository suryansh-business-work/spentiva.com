/**
 * Deep-level auth flow integration tests.
 * Tests the full lifecycle: initialize -> login -> fetchUser -> logout
 * Covers edge cases, race conditions, and error paths.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/contexts/authStore';
import { http } from '@/utils/http';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
    post: jest.fn(),
  },
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

describe('Auth Flow - Deep Level Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe('initialize edge cases', () => {
    it('handles corrupted user JSON in storage', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('valid-token')
        .mockResolvedValueOnce('not-valid-json{{{'); // corrupted
      mockHttp.get.mockResolvedValueOnce({ success: false, data: null, message: 'Unauthorized', status: 401 });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      // getJsonItem catches parse error and returns null
      // no cached user and ME fails -> isAuthenticated: false
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('handles empty string token in storage', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('')
        .mockResolvedValueOnce(JSON.stringify(createMockUser()));

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      // empty string is falsy so should be unauthenticated
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('handles concurrent initialize calls', async () => {
      const user = createMockUser();
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('token-1')
        .mockResolvedValueOnce(JSON.stringify(user))
        .mockResolvedValueOnce('token-2')
        .mockResolvedValueOnce(JSON.stringify({ ...user, firstName: 'Updated' }));
      mockHttp.get
        .mockResolvedValueOnce({ success: true, data: { user }, message: 'OK', status: 200 })
        .mockResolvedValueOnce({ success: true, data: { user: { ...user, firstName: 'Updated' } }, message: 'OK', status: 200 });

      // Call initialize twice concurrently
      await Promise.all([
        useAuthStore.getState().initialize(),
        useAuthStore.getState().initialize(),
      ]);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      // One of the two should win
      expect(state.token).toBeTruthy();
    });

    it('handles AsyncStorage timing out', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10))
      );

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login flow', () => {
    it('complete login flow: save token -> fetch user -> set authenticated', async () => {
      const user = createMockUser();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('new-token');
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { user },
        message: 'OK',
        status: 200,
      });

      await useAuthStore.getState().login('new-token');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.token).toBe('new-token');
      expect(state.user).toEqual(user);
    });

    it('rejects login when fetch user fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('new-token');
      mockHttp.get.mockResolvedValue({
        success: false,
        data: null,
        message: 'Server error',
        status: 500,
      });

      await expect(useAuthStore.getState().login('new-token')).rejects.toThrow(
        'Failed to fetch user data after login'
      );

      const state = useAuthStore.getState();
      // login should NOT set isAuthenticated when user fetch fails
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
    });

    it('persists user to storage after successful fetch', async () => {
      const user = createMockUser();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('token');
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { user },
        message: 'OK',
        status: 200,
      });

      await useAuthStore.getState().login('token');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user)
      );
    });
  });

  describe('logout flow', () => {
    it('clears all state and storage on logout', async () => {
      useAuthStore.setState({
        user: createMockUser() as never,
        token: 'active-token',
        isAuthenticated: true,
        isLoading: false,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining(['authToken', 'user'])
      );
    });

    it('handles storage failure on logout gracefully', async () => {
      useAuthStore.setState({
        user: createMockUser() as never,
        token: 'token',
        isAuthenticated: true,
      });
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(new Error('Storage fail'));

      // Should not throw
      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('fetchCurrentUser edge cases', () => {
    it('does nothing when no token in storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().fetchCurrentUser();

      expect(mockHttp.get).not.toHaveBeenCalled();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('handles network error during fetch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('token');
      mockHttp.get.mockRejectedValue(new Error('Network error'));

      await useAuthStore.getState().fetchCurrentUser();

      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('handles API returning 401 unauthorized', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('expired-token');
      mockHttp.get.mockResolvedValue({
        success: false,
        data: null,
        message: 'Unauthorized',
        status: 401,
      });

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      // User should not be updated since response was not successful
      expect(state.user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('merges partial update into existing user', () => {
      const user = createMockUser();
      useAuthStore.setState({ user: user as never });

      useAuthStore.getState().updateUser({ firstName: 'Updated' });

      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('Updated');
      expect(state.user?.lastName).toBe('User'); // unchanged
    });

    it('persists updated user to storage', () => {
      const user = createMockUser();
      useAuthStore.setState({ user: user as never });

      useAuthStore.getState().updateUser({ email: 'new@spentiva.com' });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.stringContaining('new@spentiva.com')
      );
    });

    it('does nothing when no current user', () => {
      useAuthStore.setState({ user: null });

      useAuthStore.getState().updateUser({ firstName: 'Test' });

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
