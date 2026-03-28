import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { MainTabNavigator } from '@/navigation/MainTabNavigator';

jest.mock('@/services', () => ({
  trackerService: { getAll: jest.fn(() => Promise.resolve({ success: true, data: [] })) },
  analyticsService: {
    getSummary: jest.fn(() => Promise.resolve({ success: true, data: null })),
    getByCategory: jest.fn(() => Promise.resolve({ success: true, data: [] })),
  },
  usageService: { getOverview: jest.fn(() => Promise.resolve({ success: true, data: null })) },
}));

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      user: { _id: '1', firstName: 'A', lastName: 'B', email: 'a@b.com' },
      logout: jest.fn(),
    }),
  useThemeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ isDarkMode: false, toggleTheme: jest.fn() }),
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('MainTabNavigator', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<MainTabNavigator />, { wrapper: Wrapper });
    expect(toJSON()).toBeTruthy();
  });
});
