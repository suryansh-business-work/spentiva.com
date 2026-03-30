import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { BillingScreen } from '@/screens/BillingScreen';

jest.mock('@/contexts', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      user: { _id: '1', firstName: 'Test', lastName: 'User', email: 'test@test.com', roleSlug: 'free', isVerified: true, mfaEnabled: false },
    }),
}));

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

  it('renders current plan card', () => {
    const { getByText } = render(<BillingScreen />, { wrapper: Wrapper });
    expect(getByText('Current Plan')).toBeTruthy();
  });

  it('renders available plans', () => {
    const { getByText } = render(<BillingScreen />, { wrapper: Wrapper });
    expect(getByText('Available Plans')).toBeTruthy();
    expect(getByText('Free')).toBeTruthy();
  });
});
