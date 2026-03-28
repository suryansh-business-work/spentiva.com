import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { BillingScreen } from '@/screens/BillingScreen';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('BillingScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<BillingScreen />, { wrapper: Wrapper });
    expect(getAllByText('Billing').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb with More parent', () => {
    const { getByText } = render(<BillingScreen />, { wrapper: Wrapper });
    expect(getByText('More')).toBeTruthy();
  });

  it('renders placeholder content', () => {
    const { getByText } = render(<BillingScreen />, { wrapper: Wrapper });
    expect(getByText('Billing and plan management will be implemented here.')).toBeTruthy();
  });
});
