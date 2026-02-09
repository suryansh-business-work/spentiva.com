/**
 * Centralized UI configuration for environment-dependent values.
 * All public-facing config values are managed here.
 */

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const config = {
  /** API base URL */
  API_URL: isLocalhost ? 'http://localhost:8002/v1/api' : 'https://server.spentiva.com/v1/api',

  /** Auth Service */
  AUTH: {
    API_KEY: import.meta.env.VITE_AUTH_API_KEY || 'exy_sWx0MMTQvtKSUcBaMY8TkeYiTsKkx3Pq',
    SERVER_URL: isLocalhost ? 'http://localhost:4002' : 'https://exyconn-auth-server.exyconn.com',
    AUTH_URL: isLocalhost ? 'http://localhost:4001' : 'https://auth.spentiva.com',
    PROFILE_URL: isLocalhost ? 'http://localhost:4001/profile' : 'https://auth.spentiva.com/profile',
    LOGOUT_URL: isLocalhost ? 'http://localhost:4001/logout' : 'https://auth.spentiva.com/logout',
  },

  /** ImageKit CDN (public key only — safe for client) */
  IMAGEKIT: {
    PUBLIC_KEY: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
    URL_ENDPOINT: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/esdata1',
  },
} as const;

export default config;
