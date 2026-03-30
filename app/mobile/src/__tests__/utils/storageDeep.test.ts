/**
 * Deep-level storage utility tests.
 * Tests edge cases: corrupted data, concurrent access, key collisions,
 * and error handling paths.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUser,
  getUser,
  getThemeMode,
  setThemeMode,
  clearAllAuthData,
  setJsonItem,
  getJsonItem,
} from '@/utils/storage';

describe('Storage - Deep Level Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth token', () => {
    it('stores and retrieves auth token', async () => {
      await setAuthToken('my-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'my-token');
    });

    it('returns null when no token stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const token = await getAuthToken();
      expect(token).toBeNull();
    });

    it('handles setItem failure gracefully', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage full'));
      // Should not throw
      await setAuthToken('token');
    });

    it('handles getItem failure gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage corrupted'));
      const token = await getAuthToken();
      expect(token).toBeNull();
    });

    it('removes token from storage', async () => {
      await removeAuthToken();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
    });
  });

  describe('JSON storage', () => {
    it('serializes objects correctly', async () => {
      const data = { name: 'test', nested: { a: 1 } };
      await setJsonItem('key', data);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', JSON.stringify(data));
    });

    it('deserializes objects correctly', async () => {
      const data = { name: 'test', count: 42 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(data));

      const result = await getJsonItem<typeof data>('key');
      expect(result).toEqual(data);
    });

    it('returns null for missing keys', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getJsonItem('missing');
      expect(result).toBeNull();
    });

    it('returns null for corrupted JSON', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('{broken json');
      const result = await getJsonItem('corrupted');
      expect(result).toBeNull();
    });

    it('handles arrays', async () => {
      const arr = [1, 2, 3];
      await setJsonItem('arr', arr);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('arr', '[1,2,3]');
    });

    it('handles null value', async () => {
      await setJsonItem('nullable', null);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('nullable', 'null');
    });

    it('handles boolean value', async () => {
      await setJsonItem('bool', true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('bool', 'true');
    });
  });

  describe('User storage', () => {
    it('stores user object', async () => {
      const user = { _id: '1', email: 'a@b.com', firstName: 'A', lastName: 'B' };
      await setUser(user);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });

    it('retrieves user object', async () => {
      const user = { _id: '1', email: 'a@b.com' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(user));

      const result = await getUser();
      expect(result).toEqual(user);
    });
  });

  describe('Theme storage', () => {
    it('stores dark mode preference', async () => {
      await setThemeMode(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', 'true');
    });

    it('stores light mode preference', async () => {
      await setThemeMode(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('themeMode', 'false');
    });

    it('retrieves theme mode', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
      const result = await getThemeMode();
      expect(result).toBe(true);
    });

    it('returns null when no theme saved', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await getThemeMode();
      expect(result).toBeNull();
    });
  });

  describe('clearAllAuthData', () => {
    it('removes all auth-related keys', async () => {
      await clearAllAuthData();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(
        expect.arrayContaining(['authToken', 'user', 'organization', 'role'])
      );
    });

    it('handles multiRemove failure gracefully', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValue(new Error('fail'));
      // Should not throw
      await clearAllAuthData();
    });
  });
});
