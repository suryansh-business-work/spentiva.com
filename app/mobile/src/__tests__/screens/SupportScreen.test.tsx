import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { SupportScreen } from '@/screens/SupportScreen';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('SupportScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<SupportScreen />, { wrapper: Wrapper });
    expect(getAllByText('Support').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with More parent', () => {
    const { getByText } = render(<SupportScreen />, { wrapper: Wrapper });
    expect(getByText('More')).toBeTruthy();
  });

  it('renders placeholder content', () => {
    const { getByText } = render(<SupportScreen />, { wrapper: Wrapper });
    expect(getByText('Support tickets will be implemented here.')).toBeTruthy();
  });
});
