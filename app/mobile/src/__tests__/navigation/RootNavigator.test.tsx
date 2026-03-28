import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { RootNavigator } from '@/navigation/RootNavigator';

jest.mock('@/services', () => ({
  trackerService: { getAll: jest.fn(() => Promise.resolve({ success: true, data: [] })) },
  analyticsService: {
    getSummary: jest.fn(() => Promise.resolve({ success: true, data: null })),
    getByCategory: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
  usageService: { getOverview: jest.fn(() => Promise.resolve({ success: true, data: null })) },
}));

let mockIsAuthenticated = false;

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      isAuthenticated: mockIsAuthenticated,
      user: mockIsAuthenticated
        ? { _id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com' }
        : null,
      logout: jest.fn(),
    }),
  useThemeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ isDarkMode: false, toggleTheme: jest.fn() }),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('RootNavigator', () => {
  beforeEach(() => {
    mockIsAuthenticated = false;
  });

  it('renders auth screens when not authenticated', () => {
    mockIsAuthenticated = false;
    const { toJSON } = render(<RootNavigator />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });

  it('renders main screens when authenticated', () => {
    mockIsAuthenticated = true;
    const { toJSON } = render(<RootNavigator />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
