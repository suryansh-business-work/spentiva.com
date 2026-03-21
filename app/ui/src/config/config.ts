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

  /** ImageKit CDN (public key only — safe for client) */
  IMAGEKIT: {
    PUBLIC_KEY: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
    URL_ENDPOINT: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/esdata1',
  },
} as const;

export default config;
