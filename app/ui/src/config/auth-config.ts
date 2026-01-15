/**
 * Auth Configuration
 * Centralized configuration for external authentication
 */

// External Auth Server URLs
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const AUTH_CONFIG = {
  // API Key for external auth server
  apiKey: 'exy_sWx0MMTQvtKSUcBaMY8TkeYiTsKkx3Pq',

  // External auth server base URL
  authServerUrl: isLocalhost ? 'http://localhost:4002' : 'https://exyconn-auth-server.exyconn.com',

  // External auth UI URLs
  authUrl: isLocalhost ? 'http://localhost:4001' : 'https://auth.spentiva.com',
  profileUrl: isLocalhost ? 'http://localhost:4001/profile' : 'https://auth.spentiva.com/profile',
  logoutUrl: isLocalhost ? 'http://localhost:4001/logout' : 'https://auth.spentiva.com/logout',

  // API Endpoints (on auth server)
  endpoints: {
    me: '/v1/api/auth/me',
    role: '/v1/api/auth/role',
  },

  // Role slugs for authorization
  roles: {
    admin: 'admin',
    user: 'user',
  },
};

// Helper to get full endpoint URL
export const getAuthEndpoint = (endpoint: keyof typeof AUTH_CONFIG.endpoints): string => {
  return `${AUTH_CONFIG.authServerUrl}${AUTH_CONFIG.endpoints[endpoint]}`;
};

// Helper to get auth headers
export const getAuthHeaders = () => ({
  'x-api-key': AUTH_CONFIG.apiKey,
});

// Helper to check if user has admin role
export const isAdmin = (roleSlug?: string): boolean => {
  return roleSlug === AUTH_CONFIG.roles.admin;
};
