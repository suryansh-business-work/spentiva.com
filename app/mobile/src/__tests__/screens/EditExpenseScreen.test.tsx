import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { EditExpenseScreen } from '@/screens/EditExpenseScreen';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('EditExpenseScreen', () => {
  it('renders screen header', () => {
    const { getAllByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    expect(getAllByText('Edit Expense').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb', () => {
    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('renders placeholder content', () => {
    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    expect(getByText('Edit expense form will be implemented here.')).toBeTruthy();
  });
});
