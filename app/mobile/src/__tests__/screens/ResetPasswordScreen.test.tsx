import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';

jest.mock('@/utils/http', () => ({
  http: { post: jest.fn() },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ResetPasswordScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders reset password heading', () => {
    const { getAllByText, getByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    expect(getAllByText('Reset Password').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Enter your reset token and new password')).toBeTruthy();
  });

  it('renders all form fields', () => {
    const { getAllByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    expect(getAllByText('Reset Token').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('New Password').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Confirm Password').length).toBeGreaterThanOrEqual(1);
  });

  it('renders reset password button', () => {
    const { getAllByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    // "Reset Password" is both heading and button
    const matches = getAllByText('Reset Password');
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('renders back to sign in link', () => {
    const { getByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    expect(getByText('Back to Sign In')).toBeTruthy();
  });

  it('navigates to Login on back link press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Back to Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('shows validation errors on empty submit', async () => {
    const { getAllByText, getByText } = render(<ResetPasswordScreen />, { wrapper: Wrapper });
    const buttons = getAllByText('Reset Password');
    fireEvent.press(buttons[buttons.length - 1]);
    await waitFor(() => {
      expect(getByText('Password is required')).toBeTruthy();
    });
  });
});
