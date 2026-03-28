import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { SettingsScreen } from '@/screens/SettingsScreen';

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

  it('renders placeholder content', () => {
    const { getByText } = render(<SettingsScreen />, { wrapper: Wrapper });
    expect(getByText('App settings will be implemented here.')).toBeTruthy();
  });
});
