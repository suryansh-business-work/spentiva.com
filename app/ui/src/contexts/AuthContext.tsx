import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getRequest } from '../utils/http';
import { endpoints } from '../config/api';
import { getAuthHeaders } from '../config/auth-config';
import { User } from '../types';


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      // Save token and clean URL
      localStorage.setItem('authToken', urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToken(urlToken);
      fetchCurrentUser(urlToken).then(() => {
        // Redirect to portal only after successful fetch
        window.location.href = '/trackers';
      });
    } else {
      // Load token from localStorage
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        setToken(savedToken);
        fetchCurrentUser(savedToken);
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
        try {
          const roleResponse = await getRequest(endpoints.auth.role, {}, authToken, headers);
          const roleData = roleResponse?.data?.data;
          if (roleData?.roleDetails?.slug) {
            userData.roleSlug = roleData.roleDetails.slug;
          }
        } catch (roleError) {
          console.error('Error fetching role:', roleError);
        }

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (orgData) {
          localStorage.setItem('organization', JSON.stringify(orgData));
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
    localStorage.setItem('authToken', newToken);
    // Token will be automatically added by apiClient interceptor
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    // Token will be automatically removed by apiClient interceptor
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
