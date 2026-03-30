/**
 * Edge case tests for EditExpenseScreen.
 * Tests delete functionality, form validation, and loading states.
 */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { EditExpenseScreen } from '@/screens/EditExpenseScreen';
import { expenseService } from '@/services';

jest.mock('@/services', () => ({
  expenseService: {
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({
    showSnackbar: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: { trackerId: 't1', expenseId: 'e1' },
  }),
}));

const mockExpenseService = expenseService as jest.Mocked<typeof expenseService>;

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

const mockExpense = {
  _id: 'e1',
  trackerId: 't1',
  type: 'expense' as const,
  amount: 42.5,
  category: 'Food',
  subcategory: '',
  categoryId: 'c1',
  description: 'Dinner',
  paymentMethod: 'cash',
  currency: 'USD',
  timestamp: '2024-06-15',
  createdAt: '2024-06-15',
  updatedAt: '2024-06-15',
};

describe('EditExpenseScreen - Edge Cases', () => {
  jest.setTimeout(15000);

  beforeEach(() => jest.clearAllMocks());

  it('loads and displays expense data', async () => {
    mockExpenseService.getById.mockResolvedValue({
      success: true,
      data: mockExpense,
      message: 'OK',
      status: 200,
    });

    const { getByDisplayValue } = render(<EditExpenseScreen />, { wrapper: Wrapper });

    // Verify mock was called
    await waitFor(() => {
      expect(mockExpenseService.getById).toHaveBeenCalledWith('e1');
    }, { timeout: 10000 });

    await waitFor(() => {
      expect(getByDisplayValue('42.5')).toBeTruthy();
    }, { timeout: 10000 });
  });

  it('shows delete button', async () => {
    mockExpenseService.getById.mockResolvedValue({
      success: true,
      data: mockExpense,
      message: 'OK',
      status: 200,
    });

    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Delete Expense')).toBeTruthy();
    });
  });

  it('shows error view when expense fetch fails', async () => {
    mockExpenseService.getById.mockResolvedValue({
      success: false,
      data: null,
      message: 'Expense not found',
      status: 404,
    });

    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(getByText('Expense not found')).toBeTruthy();
    });
  });

  it('shows loading state initially', () => {
    mockExpenseService.getById.mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    const { getByText } = render(<EditExpenseScreen />, { wrapper: Wrapper });
    expect(getByText('Loading expense...')).toBeTruthy();
  });
});
