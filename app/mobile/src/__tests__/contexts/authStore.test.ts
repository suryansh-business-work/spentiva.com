import { useAuthStore } from '@/contexts/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from '@/utils/http';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn(),
  },
  setOnUnauthorized: jest.fn(),
}));

const mockHttp = http as jest.Mocked<typeof http>;

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  describe('initial state', () => {
    it('starts with null user and token', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('initialize', () => {
    it('loads token and user from storage', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', firstName: 'John', lastName: 'Doe' };
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('stored-token')
        .mockResolvedValueOnce(JSON.stringify(mockUser));
      mockHttp.get.mockResolvedValueOnce({
        success: true,
        data: { user: mockUser },
        message: 'OK',
        status: 200,
      });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.token).toBe('stored-token');
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('stays unauthenticated when no token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('saves token and fetches user', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', firstName: 'Jane', lastName: 'Doe' };
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { user: mockUser },
        message: 'OK',
        status: 200,
      });
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('new-token');

      await useAuthStore.getState().login('new-token');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'new-token');
      const state = useAuthStore.getState();
      expect(state.token).toBe('new-token');
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('clears all auth state', async () => {
      useAuthStore.setState({
        user: { _id: '1', email: 'a@b.com' } as never,
        token: 'tok',
        isAuthenticated: true,
      });

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });

  describe('fetchCurrentUser', () => {
    it('fetches and stores user from API', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', firstName: 'Joe', lastName: 'Doe' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('my-token');
      mockHttp.get.mockResolvedValue({
        success: true,
        data: { user: mockUser },
        message: 'OK',
        status: 200,
      });

      await useAuthStore.getState().fetchCurrentUser();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('does nothing when no token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().fetchCurrentUser();

      expect(mockHttp.get).not.toHaveBeenCalled();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('merges partial updates into current user', () => {
      useAuthStore.setState({
        user: { _id: '1', email: 'a@b.com', firstName: 'John', lastName: 'Doe' } as never,
      });

      useAuthStore.getState().updateUser({ firstName: 'Jane' });

      expect(useAuthStore.getState().user?.firstName).toBe('Jane');
      expect(useAuthStore.getState().user?.lastName).toBe('Doe');
    });

    it('does nothing when no current user', () => {
      useAuthStore.setState({ user: null });
      useAuthStore.getState().updateUser({ firstName: 'Jane' });
      expect(useAuthStore.getState().user).toBeNull();
    });
  });
});
