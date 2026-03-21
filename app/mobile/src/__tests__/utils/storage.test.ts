import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  clearAllAuthData,
  setUser,
  getUser,
  setOrganization,
  getOrganization,
  setRole,
  getRole,
  setThemeMode,
  getThemeMode,
} from '@/utils/storage';

describe('storage utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth token', () => {
    it('saves auth token', async () => {
      await setAuthToken('test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token');
    });

    it('retrieves auth token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('my-token');
      const token = await getAuthToken();
      expect(token).toBe('my-token');
    });

    it('returns null when no token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const token = await getAuthToken();
      expect(token).toBeNull();
    });

    it('removes auth token', async () => {
      await removeAuthToken();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('clearAllAuthData', () => {
    it('removes all auth-related keys', async () => {
      await clearAllAuthData();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        'authToken',
        'user',
        'organization',
        'role',
      ]);
    });
  });

  describe('JSON storage', () => {
    it('saves and retrieves user', async () => {
      const user = { _id: '1', email: 'test@test.com', firstName: 'John', lastName: 'Doe' };
      await setUser(user);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(user));
      const result = await getUser();
      expect(result).toEqual(user);
    });

    it('saves and retrieves organization', async () => {
      const org = { _id: '1', name: 'Test Org', slug: 'test-org' };
      await setOrganization(org);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('organization', JSON.stringify(org));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(org));
      const result = await getOrganization();
      expect(result).toEqual(org);
    });

    it('saves and retrieves role', async () => {
      const role = { _id: '1', name: 'Admin', slug: 'admin' };
      await setRole(role);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('role', JSON.stringify(role));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(role));
      const result = await getRole();
      expect(result).toEqual(role);
    });

    it('saves and retrieves theme mode', async () => {
      await setThemeMode(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', JSON.stringify(true));

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(true));
      const result = await getThemeMode();
      expect(result).toBe(true);
    });

    it('returns null for missing JSON item', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getUser();
      expect(result).toBeNull();
    });
  });
});
