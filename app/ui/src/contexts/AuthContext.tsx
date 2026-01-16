import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRequest } from '../utils/http';
import { endpoints } from '../config/api';
import { getAuthHeaders } from '../config/auth-config';
import { getAuthToken, setAuthToken, removeAuthToken } from '../utils/localStorage';
import { User, Organization, Role } from '../types';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  role: Role | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    if (urlToken) {
      setAuthToken(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToken(urlToken);
      fetchCurrentUser(urlToken).then(() => {
        window.location.href = '/trackers';
      });
    } else {
      // Load token from localStorage
      const savedToken = getAuthToken();
      if (savedToken) {
        setToken(savedToken);

        // Load user, organization, and role from localStorage
        const savedUser = localStorage.getItem('user');
        const savedOrg = localStorage.getItem('organization');
        const savedRole = localStorage.getItem('role');

        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (error) {
            console.error('Error parsing saved user:', error);
          }
        }

        if (savedOrg) {
          try {
            setOrganization(JSON.parse(savedOrg));
          } catch (error) {
            console.error('Error parsing saved organization:', error);
          }
        }

        if (savedRole) {
          try {
            setRole(JSON.parse(savedRole));
          } catch (error) {
            console.error('Error parsing saved role:', error);
          }
        }

        // If we have saved data, don't fetch again, just set loading to false
        if (savedUser && savedOrg && savedRole) {
          setLoading(false);
        } else {
          // If missing some data, fetch fresh
          fetchCurrentUser(savedToken);
        }
      } else {
        setLoading(false);
      }
    }
  }, []);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const headers = getAuthHeaders();

      // Fetch user info
      const response = await getRequest(endpoints.auth.me, {}, authToken, headers);
      const data = response?.data || response;
      const userData = data?.data?.user;
      const orgData = data?.data?.organization;

      if (userData) {
        // Fetch role info
        let roleData: Role | null = null;
        try {
          const roleResponse = await getRequest(endpoints.auth.role, {}, authToken, headers);
          roleData = roleResponse?.data?.data;
          if (roleData?.roleDetails?.slug) {
            userData.roleSlug = roleData.roleDetails.slug;
          }
        } catch (roleError) {
          console.error('Error fetching role:', roleError);
        }

        // Update state
        setUser(userData);
        if (orgData) {
          setOrganization(orgData);
        }
        if (roleData) {
          setRole(roleData);
        }

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        if (orgData) {
          localStorage.setItem('organization', JSON.stringify(orgData));
        }
        if (roleData) {
          localStorage.setItem('role', JSON.stringify(roleData));
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);
    // Token will be automatically added by apiClient interceptor
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOrganization(null);
    setRole(null);
    removeAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    localStorage.removeItem('role');
    // Token will be automatically removed by apiClient interceptor
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!role?.roleDetails?.permissions) return false;
    const permission = role.roleDetails.permissions.find(
      p => p.resource === resource && p.action === action
    );
    return permission?.allowed || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        role,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        loading,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
