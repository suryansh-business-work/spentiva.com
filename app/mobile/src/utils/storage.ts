import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/utils/logger';

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'user';
const ORGANIZATION_KEY = 'organization';
const ROLE_KEY = 'role';
const THEME_KEY = 'themeMode';

/** Auth token */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {
    logger.error('Failed to save auth token', e);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    logger.error('Failed to get auth token', e);
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    logger.error('Failed to remove auth token', e);
  }
};

/** JSON storage helpers */
export const setJsonItem = async (key: string, value: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    logger.error(`Failed to save ${key}`, e);
  }
};

export const getJsonItem = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (e) {
    logger.error(`Failed to get ${key}`, e);
    return null;
  }
};

/** User/Org/Role storage */
export const setUser = (user: unknown) => setJsonItem(USER_KEY, user);
export const getUser = <T>() => getJsonItem<T>(USER_KEY);

export const setOrganization = (org: unknown) => setJsonItem(ORGANIZATION_KEY, org);
export const getOrganization = <T>() => getJsonItem<T>(ORGANIZATION_KEY);

export const setRole = (role: unknown) => setJsonItem(ROLE_KEY, role);
export const getRole = <T>() => getJsonItem<T>(ROLE_KEY);

/** Theme */
export const setThemeMode = (isDark: boolean) => setJsonItem(THEME_KEY, isDark);
export const getThemeMode = () => getJsonItem<boolean>(THEME_KEY);

/** Clear all auth data */
export const clearAllAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY, ORGANIZATION_KEY, ROLE_KEY]);
  } catch (e) {
    logger.error('Failed to clear auth data', e);
  }
};
