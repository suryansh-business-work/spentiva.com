import httpClient from '../config/http';
import endpoints from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'business';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      role: 'user' | 'admin';
      accountType: 'free' | 'pro' | 'businesspro';
      profilePhoto?: string;
    };
  };
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      endpoints.auth.login,
      credentials
    );

    // Store token if login successful
    if (response.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Signup new user
   */
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
      endpoints.auth.signup,
      data
    );

    // Store token if signup successful
    if (response.data?.token) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await httpClient.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API call result
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<any> {
    return await httpClient.get(endpoints.auth.me);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored user data
   */
  async getStoredUser(): Promise<any | null> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Forgot password - send OTP
   */
  async forgotPassword(email: string): Promise<any> {
    return await httpClient.post(endpoints.auth.forgotPassword, { email });
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<any> {
    return await httpClient.post(endpoints.auth.resetPassword, data);
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(email: string, otp: string): Promise<any> {
    return await httpClient.post(endpoints.auth.verifyEmail, { email, otp });
  }
}

export const authService = new AuthService();
export default authService;
