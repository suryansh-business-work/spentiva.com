/**
 * Auth Configuration
 * Centralized configuration for self-hosted authentication
 */
import { getApiUrl } from './api';

export const AUTH_CONFIG = {
  // Role slugs for authorization
  roles: {
    admin: 'admin',
    user: 'user',
  },

  // Auth endpoints (on main server)
  endpoints: {
    login: `${getApiUrl()}/auth/login`,
    register: `${getApiUrl()}/auth/register`,
    me: `${getApiUrl()}/auth/me`,
    profile: `${getApiUrl()}/auth/profile`,
    forgotPassword: `${getApiUrl()}/auth/forgot-password`,
    resetPassword: `${getApiUrl()}/auth/reset-password`,
  },
};

// Helper to check if user has admin role
export const isAdmin = (role?: string): boolean => {
  return role === AUTH_CONFIG.roles.admin;
};
