import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { SettingsScreen } from '@/screens/SettingsScreen';

jest.mock('@/contexts', () => ({
  useThemeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ isDarkMode: false, toggleTheme: jest.fn() }),
}));

jest.mock('expo-constants', () => ({
  expoConfig: { version: '1.0.0' },
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('SettingsScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<SettingsScreen />, { wrapper: Wrapper });
    expect(getAllByText('Settings').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with More parent', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: Wrapper });
    expect(getByText('More')).toBeTruthy();
  });

  it('renders dark mode toggle', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: Wrapper });
    expect(getByText('Dark Mode')).toBeTruthy();
  });

  it('renders version and links', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: Wrapper });
    expect(getByText('Version')).toBeTruthy();
    expect(getByText('Privacy Policy')).toBeTruthy();
    expect(getByText('Terms of Service')).toBeTruthy();
  });
});
