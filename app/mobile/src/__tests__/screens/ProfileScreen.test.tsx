import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ProfileScreen } from '@/screens/ProfileScreen';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('ProfileScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getAllByText('Profile').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with More parent', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getByText('More')).toBeTruthy();
  });

  it('renders placeholder content', () => {
    const { getByText } = render(<ProfileScreen />, { wrapper: Wrapper });
    expect(getByText('Profile management will be implemented here.')).toBeTruthy();
  });
});
