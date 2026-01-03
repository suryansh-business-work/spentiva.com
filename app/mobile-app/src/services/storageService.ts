import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage Service
 * Wrapper around AsyncStorage for type-safe storage operations
 */

export const storageService = {
  // Generic get/set/remove
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Auth token
  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  },

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem('authToken', token);
  },

  async removeAuthToken(): Promise<void> {
    await AsyncStorage.removeItem('authToken');
  },

  // Theme
  async getTheme(): Promise<'light' | 'dark'> {
    const theme = await AsyncStorage.getItem('theme');
    return (theme as 'light' | 'dark') || 'light';
  },

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem('theme', theme);
  },

  // User data cache
  async getUserData<T>(): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async setUserData<T>(data: T): Promise<void> {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(data));
    } catch (error) {
      console.error('Error setting user data:', error);
    }
  },

  async removeUserData(): Promise<void> {
    await AsyncStorage.removeItem('userData');
  },

  // Last sync timestamp
  async getLastSync(): Promise<Date | null> {
    const timestamp = await AsyncStorage.getItem('lastSync');
    return timestamp ? new Date(timestamp) : null;
  },

  async setLastSync(date: Date = new Date()): Promise<void> {
    await AsyncStorage.setItem('lastSync', date.toISOString());
  },

  // Offline data cache
  async cacheData<T>(key: string, data: T, ttl?: number): Promise<void> {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  },

  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cached = await AsyncStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);

      // Check if cache is still valid
      if (ttl && Date.now() - timestamp > ttl) {
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Error getting cached data for ${key}:`, error);
      return null;
    }
  },

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};
