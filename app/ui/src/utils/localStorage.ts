/**
 * LocalStorage Utilities
 * Helper functions for reading and writing to localStorage
 */

/**
 * Auth Token Helper
 */
const AUTH_TOKEN_NAME = 'authToken';

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_NAME, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_NAME);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_NAME);
};