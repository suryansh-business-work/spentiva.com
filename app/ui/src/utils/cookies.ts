/**
 * Cookie Utilities
 * Helper functions for reading and writing cookies
 */

/**
 * Set a cookie
 * @param name Cookie name
 * @param value Cookie value
 * @param days Expiration in days (default: 7)
 */
export const setCookie = (name: string, value: string, days = 7): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
};

/**
 * Get a cookie value by name
 * @param name Cookie name
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Delete a cookie
 * @param name Cookie name
 */
export const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

/**
 * Auth Token Helper
 */
const AUTH_TOKEN_NAME = 'authToken';

export const setAuthToken = (token: string): void => {
  setCookie(AUTH_TOKEN_NAME, token);
};

export const getAuthToken = (): string | null => {
  return getCookie(AUTH_TOKEN_NAME);
};

export const removeAuthToken = (): void => {
  deleteCookie(AUTH_TOKEN_NAME);
};
