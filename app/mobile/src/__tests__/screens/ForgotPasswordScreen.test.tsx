import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';

jest.mock('@/utils/http', () => ({
  http: { post: jest.fn() },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ForgotPasswordScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders reset password heading', () => {
    const { getByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    expect(getByText('Reset Password')).toBeTruthy();
    expect(getByText('Enter your email to receive a reset link')).toBeTruthy();
  });

  it('renders email input field', () => {
    const { getAllByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    expect(getAllByText('Email').length).toBeGreaterThanOrEqual(1);
  });

  it('renders send reset link button', () => {
    const { getByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    expect(getByText('Send Reset Link')).toBeTruthy();
  });

  it('renders back to sign in link', () => {
    const { getByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    expect(getByText('Back to Sign In')).toBeTruthy();
  });

  it('navigates to Login on back link press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Back to Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('shows validation error on empty submit', async () => {
    const { getByText } = render(<ForgotPasswordScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Send Reset Link'));
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });
});
