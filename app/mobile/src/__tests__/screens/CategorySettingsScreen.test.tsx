import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { CategorySettingsScreen } from '@/screens/CategorySettingsScreen';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('CategorySettingsScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    expect(getAllByText('Categories').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with Trackers parent', () => {
    const { getByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('renders placeholder content', () => {
    const { getByText } = render(<CategorySettingsScreen />, { wrapper: Wrapper });
    expect(getByText('Category settings will be implemented here.')).toBeTruthy();
  });
});
