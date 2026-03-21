import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getRequest } from '../utils/http';
import { endpoints } from '../config/api';
import { getAuthToken, removeAuthToken } from '../utils/localStorage';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
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

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const response = await getRequest(endpoints.auth.me, {}, authToken);
      const data = response?.data || response;
      const userData = data?.data?.user;

      if (userData) {
        // Normalize _id to id
        if (userData._id && !userData.id) {
          userData.id = userData._id;
        }
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        logout();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedToken = getAuthToken();
    if (savedToken) {
      setToken(savedToken);

      // Load cached user from localStorage
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setLoading(false);
        } catch {
          fetchCurrentUser(savedToken);
        }
      } else {
        fetchCurrentUser(savedToken);
      }
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const logout = () => {
    setToken(null);
    setUser(null);
    removeAuthToken();
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    const currentToken = getAuthToken();
    if (currentToken) {
      await fetchCurrentUser(currentToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!token && !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
