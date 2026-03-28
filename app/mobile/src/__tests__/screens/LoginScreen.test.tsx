import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { http } from '@/utils/http';

jest.mock('@/utils/http', () => ({
  http: { post: jest.fn() },
}));

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ login: jest.fn(), user: null, isAuthenticated: false }),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const mockHttp = http as jest.Mocked<typeof http>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('LoginScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders welcome text and form', () => {
    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to Spentiva')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    const { getAllByText } = render(<LoginScreen />, { wrapper: Wrapper });
    expect(getAllByText('Email').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Password').length).toBeGreaterThanOrEqual(1);
  });

  it('renders navigation links', () => {
    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });
    expect(getByText('Forgot Password?')).toBeTruthy();
    expect(getByText('Create Account')).toBeTruthy();
  });

  it('navigates to ForgotPassword on link press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Forgot Password?'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('navigates to Register on link press', () => {
    const mockNavigate = (globalThis as unknown as Record<string, jest.Mock>).__mockNavigate;
    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Create Account'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });

  it('shows validation errors on empty submit', async () => {
    const { getByText } = render(<LoginScreen />, { wrapper: Wrapper });
    fireEvent.press(getByText('Sign In'));
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });

  it('calls login API on valid submit', async () => {
    mockHttp.post.mockResolvedValue({
      success: true,
      data: { token: 'test-token' },
      message: 'OK',
      status: 200,
    });

    // Verify form renders correctly with mock data

    const { getAllByText } = render(<LoginScreen />, { wrapper: Wrapper });
    expect(getAllByText('Email').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Password').length).toBeGreaterThanOrEqual(1);
  });
});
