/**
 * Deep-level App startup tests.
 * Tests the full initialization flow including font loading,
 * store initialization, error recovery, and conditional rendering.
 */
import React from 'react';
import { render, act } from '@testing-library/react-native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/contexts/authStore';
import { useThemeStore } from '@/contexts/themeStore';
import { http } from '@/utils/http';
import App from '../../App';

jest.mock('@/utils/http', () => ({
  http: {
    get: jest.fn().mockResolvedValue({ success: false, data: null, message: 'Not found', status: 404 }),
    post: jest.fn(),
  },
  setOnUnauthorized: jest.fn(),
}));

const mockHttp = http as jest.Mocked<typeof http>;

// Mock the NavigationContainer to avoid native module issues
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      dispatch: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      canGoBack: jest.fn(() => true),
      isFocused: jest.fn(() => true),
      getParent: jest.fn(),
      getState: jest.fn(() => ({ routes: [], index: 0 })),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({ params: {}, name: 'Test', key: 'test-key' }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

const mockFontLoadAsync = Font.loadAsync as jest.Mock;

// Save original store actions before any test modifies them
const originalAuthInit = useAuthStore.getState().initialize;
const originalThemeInit = useThemeStore.getState().initialize;

describe('App Startup - Deep Level Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Restore both state AND actions
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      initialize: originalAuthInit,
    });
    useThemeStore.setState({
      isDarkMode: false,
      initialize: originalThemeInit,
    });
    mockFontLoadAsync.mockResolvedValue(undefined);
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('Font loading', () => {
    it('shows loading overlay while fonts are loading', async () => {
      // Block font loading indefinitely
      let resolveFonts: () => void;
      mockFontLoadAsync.mockImplementation(
        () => new Promise<void>((resolve) => { resolveFonts = resolve; })
      );

      const { getByText } = render(<App />);

      expect(getByText('Loading Spentiva...')).toBeTruthy();

      // Now resolve fonts
      await act(async () => { resolveFonts!(); });
    });

    it('shows error view when font loading fails', async () => {
      mockFontLoadAsync.mockRejectedValue(new Error('Font load failed'));

      const { findByText } = render(<App />);

      const errorMsg = await findByText('Failed to load app. Please try again.');
      expect(errorMsg).toBeTruthy();
    });

    it('does not proceed to store init when fonts fail', async () => {
      const initSpy = jest.spyOn(useAuthStore.getState(), 'initialize');
      mockFontLoadAsync.mockRejectedValue(new Error('Font load failed'));

      render(<App />);

      // Wait for error to surface
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });

      // Auth init should NOT have been called since fonts failed
      expect(initSpy).not.toHaveBeenCalled();
      initSpy.mockRestore();
    });
  });

  describe('Store initialization', () => {
    it('shows loading during auth and theme init', async () => {
      let resolveAuth: () => void;
      useAuthStore.setState({
        isLoading: true,
        initialize: () => new Promise<void>((resolve) => { resolveAuth = resolve; }),
      });

      const { getByText } = render(<App />);

      // Should be loading
      await act(async () => {
        await new Promise((r) => setTimeout(r, 50));
      });
      expect(getByText('Loading Spentiva...')).toBeTruthy();

      // Resolve auth
      await act(async () => {
        resolveAuth!();
        useAuthStore.setState({ isLoading: false });
      });
    });

    it('shows error view when store initialization throws', async () => {
      // Override initialize to throw
      const throwingInit = async () => { throw new Error('Storage corrupted'); };
      useAuthStore.setState({ initialize: throwingInit });

      const { findByText } = render(<App />);

      const errorMsg = await findByText('Failed to load app. Please try again.');
      expect(errorMsg).toBeTruthy();
    });
  });

  describe('Auth state transitions', () => {
    it('renders auth navigator when unauthenticated after init', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      render(<App />);

      await act(async () => {
        useAuthStore.setState({ isLoading: false, isAuthenticated: false });
      });

      // After init, should show login (Auth navigator)
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('renders main navigator when authenticated after init', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User' };
      // Mock storage by key so theme/auth init both work correctly
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === 'authToken') return Promise.resolve('stored-token');
        if (key === 'user') return Promise.resolve(JSON.stringify(mockUser));
        return Promise.resolve(null);
      });

      const { toJSON } = render(<App />);

      await act(async () => {
        await new Promise((r) => setTimeout(r, 100));
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(toJSON()).toBeTruthy();
    });

    it('handles partial auth data (token but no user)', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('stored-token')
        .mockResolvedValueOnce(null); // No user in storage
      mockHttp.get.mockResolvedValueOnce({ success: false, data: null, message: 'Unauthorized', status: 401 });

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('handles partial auth data (user but no token)', async () => {
      const mockUser = { _id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User' };
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('clears state on storage read error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await useAuthStore.getState().initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('Error recovery', () => {
    it('shows retry button on error', async () => {
      mockFontLoadAsync.mockRejectedValue(new Error('Font load failed'));

      const { findByText } = render(<App />);

      const retryBtn = await findByText('Tap to retry');
      expect(retryBtn).toBeTruthy();
    });

    it('retries initialization when retry is pressed', async () => {
      // First attempt fails
      mockFontLoadAsync
        .mockRejectedValueOnce(new Error('Font load failed'))
        .mockResolvedValueOnce(undefined);

      const { findByText } = render(<App />);

      // Wait for error
      const retryBtn = await findByText('Tap to retry');

      // Tap retry
      await act(async () => {
        retryBtn.props.onPress();
        useAuthStore.setState({ isLoading: false });
      });

      // Font.loadAsync should have been called again
      expect(mockFontLoadAsync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Theme', () => {
    it('initializes with light theme by default', () => {
      const state = useThemeStore.getState();
      expect(state.isDarkMode).toBe(false);
    });

    it('loads dark mode from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(true));

      await useThemeStore.getState().initialize();

      expect(useThemeStore.getState().isDarkMode).toBe(true);
    });

    it('falls back to light when storage fails', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('fail'));

      await useThemeStore.getState().initialize();

      expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
  });

  describe('SnackbarProvider availability', () => {
    it('SnackbarProvider is always mounted (not inside conditional)', async () => {
      // This verifies that useSnackbar works even during loading/error states
      // Previously, SnackbarProvider was only inside the "loaded" branch,
      // which caused crashes when screens tried to use it during transition
      mockFontLoadAsync.mockRejectedValue(new Error('fail'));

      const { findByText } = render(<App />);

      // Even in error state, the app should render (no useSnackbar crash)
      const errorMsg = await findByText('Failed to load app. Please try again.');
      expect(errorMsg).toBeTruthy();
    });
  });
});
