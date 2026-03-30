import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { SupportScreen } from '@/screens/SupportScreen';

jest.mock('@/services', () => ({
  supportService: {
    getAll: jest.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

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

  it('renders empty state when no tickets', async () => {
    const { getByText } = render(<SupportScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('No Tickets')).toBeTruthy();
    });
  });
});
