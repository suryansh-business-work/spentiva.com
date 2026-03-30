import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { EditExpenseScreen } from '@/screens/EditExpenseScreen';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ goBack: jest.fn(), navigate: jest.fn() }),
    useRoute: () => ({ params: { expenseId: 'exp1' } }),
  };
});

jest.mock('@/services', () => ({
  expenseService: {
    getById: jest.fn().mockResolvedValue({
      success: true,
      data: { _id: 'exp1', amount: 100, category: 'Food', description: 'Lunch', paymentMethod: 'Cash' },
    }),
    update: jest.fn().mockResolvedValue({ success: true }),
  },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('EditExpenseScreen', () => {
  it('renders screen header', async () => {
    const { getAllByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getAllByText('Edit Expense').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders breadcrumb', async () => {
    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByText('Trackers')).toBeTruthy();
    });
  });

  it('renders form fields with loaded data', async () => {
    const { getByDisplayValue } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    await waitFor(() => {
      expect(getByDisplayValue('100')).toBeTruthy();
      expect(getByDisplayValue('Food')).toBeTruthy();
      expect(getByDisplayValue('Lunch')).toBeTruthy();
      expect(getByDisplayValue('Cash')).toBeTruthy();
    });
  });
});
