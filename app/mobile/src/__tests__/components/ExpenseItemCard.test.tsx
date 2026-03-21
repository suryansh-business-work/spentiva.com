import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/theme';
import { ExpenseItemCard } from '@/components/ExpenseItemCard';
import type { Expense } from '@/types';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

const makeExpense = (overrides?: Partial<Expense>): Expense => ({
  _id: 'e1',
  trackerId: 't1',
  type: 'expense',
  amount: 50.5,
  category: 'Food',
  subcategory: '',
  categoryId: 'c1',
  description: 'Lunch',
  paymentMethod: 'cash',
  currency: 'USD',
  timestamp: '2024-01-15',
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
  ...overrides,
});

describe('ExpenseItemCard', () => {
  it('renders expense description and category', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense()} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('Lunch')).toBeTruthy();
  });

  it('shows negative amount for expenses', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense()} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('-USD 50.50')).toBeTruthy();
  });

  it('shows positive amount for income', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ type: 'income', amount: 100 })} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('+USD 100.00')).toBeTruthy();
  });

  it('calls onPress with expense', () => {
    const onPress = jest.fn();
    const expense = makeExpense();
    const { getByText } = render(
      <ExpenseItemCard expense={expense} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    fireEvent.press(getByText('Lunch'));
    expect(onPress).toHaveBeenCalledWith(expense);
  });

  it('falls back to category when no description', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ description: '' })} onPress={onPress} />,
      { wrapper: Wrapper },
    );
    expect(getByText('Food')).toBeTruthy();
  });
});
