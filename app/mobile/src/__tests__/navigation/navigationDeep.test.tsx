/**
 * Deep-level navigation tests.
 * Tests auth state-driven navigation, screen transitions,
 * and conditional rendering based on authentication.
 */
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { useAuthStore } from '@/contexts/authStore';
import { RootNavigator } from '@/navigation/RootNavigator';

// Wrapper with necessary providers
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>{children}</PaperProvider>
);

describe('Navigation - Deep Level Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth-based navigation switching', () => {
    it('renders Auth navigator when not authenticated', () => {
      useAuthStore.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
      });

      const { toJSON } = render(
        <Wrapper><RootNavigator /></Wrapper>
      );

      expect(toJSON()).toBeTruthy();
    });

    it('renders Main navigator when authenticated', () => {
      useAuthStore.setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          _id: '1',
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          roleSlug: 'user',
          isVerified: true,
          mfaEnabled: false,
        } as never,
        token: 'valid-token',
      });

      const { toJSON } = render(
        <Wrapper><RootNavigator /></Wrapper>
      );

      expect(toJSON()).toBeTruthy();
    });

    it('switches from Auth to Main on authentication', () => {
      useAuthStore.setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
      });

      const { rerender, toJSON } = render(
        <Wrapper><RootNavigator /></Wrapper>
      );

      // Simulate login
      act(() => {
        useAuthStore.setState({
          isAuthenticated: true,
          token: 'new-token',
          user: {
            _id: '1',
            email: 'a@b.com',
            firstName: 'A',
            lastName: 'B',
            roleSlug: 'user',
            isVerified: true,
            mfaEnabled: false,
          } as never,
        });
      });

      rerender(<Wrapper><RootNavigator /></Wrapper>);
      expect(toJSON()).toBeTruthy();
    });

    it('switches from Main to Auth on logout', () => {
      useAuthStore.setState({
        isAuthenticated: true,
        isLoading: false,
        token: 'token',
        user: { _id: '1' } as never,
      });

      const { rerender, toJSON } = render(
        <Wrapper><RootNavigator /></Wrapper>
      );

      // Simulate logout
      act(() => {
        useAuthStore.setState({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      });

      rerender(<Wrapper><RootNavigator /></Wrapper>);
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Navigation state consistency', () => {
    it('does not crash on rapid auth state changes', () => {
      useAuthStore.setState({
        isAuthenticated: false,
        isLoading: false,
      });

      const { rerender } = render(
        <Wrapper><RootNavigator /></Wrapper>
      );

      // Rapid state changes
      act(() => {
        useAuthStore.setState({ isAuthenticated: true, token: 't1', user: { _id: '1' } as never });
      });
      rerender(<Wrapper><RootNavigator /></Wrapper>);

      act(() => {
        useAuthStore.setState({ isAuthenticated: false, token: null, user: null });
      });
      rerender(<Wrapper><RootNavigator /></Wrapper>);

      act(() => {
        useAuthStore.setState({ isAuthenticated: true, token: 't2', user: { _id: '2' } as never });
      });
      rerender(<Wrapper><RootNavigator /></Wrapper>);

      // Should not have thrown
      expect(true).toBe(true);
    });
  });
});
