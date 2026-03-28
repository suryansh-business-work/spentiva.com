import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';

jest.mock('@/utils/http', () => ({
  http: { post: jest.fn() },
}));

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ login: jest.fn(), user: null, isAuthenticated: false }),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('RegisterScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders create account text', () => {
    const { getAllByText, getByText } = render(<RegisterScreen />, { wrapper: Wrapper });
    expect(getAllByText('Create Account').length).toBeGreaterThanOrEqual(1);
    expect(getByText('Join Spentiva today')).toBeTruthy();
  });

  it('renders all form fields', () => {
    const { getAllByText } = render(<RegisterScreen />, { wrapper: Wrapper });
    expect(getAllByText('First Name').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Last Name').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Email').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Password').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Confirm Password').length).toBeGreaterThanOrEqual(1);
  });

  it('renders sign in link', () => {
    const { getByText } = render(<RegisterScreen />, { wrapper: Wrapper });
    expect(getByText('Already have an account? Sign In')).toBeTruthy();
  });

  it('navigates to Login on sign in link press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<RegisterScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Already have an account? Sign In'));
    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('shows validation errors on empty submit', async () => {
    const { getByText, getAllByText } = render(<RegisterScreen />, { wrapper: Wrapper });
    // The button text matches "Create Account" heading too
    const buttons = getAllByText('Create Account');
    fireEvent.press(buttons[buttons.length - 1]);
    await waitFor(() => {
      expect(getByText('First name is required')).toBeTruthy();
    });
  });
});
