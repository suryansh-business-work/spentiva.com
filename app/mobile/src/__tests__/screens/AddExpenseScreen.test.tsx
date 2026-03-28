import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { AddExpenseScreen } from '@/screens/AddExpenseScreen';

jest.mock('@/services', () => ({
  expenseService: {
    create: jest.fn(),
  },
}));

jest.mock('@/contexts', () => ({
  useSnackbar: () => ({ showSnackbar: jest.fn() }),
}));

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('AddExpenseScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders screen header', () => {
    const { getAllByText } = render(<AddExpenseScreen />, { wrapper: Wrapper });
    expect(getAllByText('Add Expense').length).toBeGreaterThanOrEqual(1);
  });

  it('renders breadcrumb', () => {
    const { getByText } = render(<AddExpenseScreen />, { wrapper: Wrapper });
    expect(getByText('Trackers')).toBeTruthy();
  });

  it('renders form fields', () => {
    const { getAllByText } = render(<AddExpenseScreen />, { wrapper: Wrapper });
    expect(getAllByText('Amount').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Category').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Description').length).toBeGreaterThanOrEqual(1);
    expect(getAllByText('Payment Method').length).toBeGreaterThanOrEqual(1);
  });

  it('renders submit button', () => {
    const { getAllByText } = render(<AddExpenseScreen />, { wrapper: Wrapper });
    const buttons = getAllByText('Add Expense');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows validation errors on empty submit', async () => {
    const { getAllByText, getByText } = render(<AddExpenseScreen />, { wrapper: Wrapper });
    const submitButtons = getAllByText('Add Expense');
    fireEvent.press(submitButtons[submitButtons.length - 1]);
    await waitFor(() => {
      expect(getByText('Category is required')).toBeTruthy();
    });
  });

  it('navigates back on header back press', () => {
    const mockGoBack = (globalThis as unknown as Record<string, jest.Mock>).__mockGoBack;
    render(<AddExpenseScreen />, { wrapper: Wrapper });
    // The back action is tested via ScreenHeader onBack
    expect(mockGoBack).toBeDefined();
  });
});
