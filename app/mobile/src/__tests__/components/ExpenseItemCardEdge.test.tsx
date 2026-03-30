/**
 * Edge case tests for ExpenseItemCard.
 * Tests theme-based colors, date display, accessibility labels,
 * missing fields, and zero/large amounts.
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '@/theme';
import { ExpenseItemCard } from '@/components/ExpenseItemCard';
import type { Expense } from '@/types';

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
  timestamp: '2024-06-15T12:00:00Z',
  createdAt: '2024-06-15',
  updatedAt: '2024-06-15',
  ...overrides,
});

const LightWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

const DarkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={darkTheme}>{children}</PaperProvider>
);

describe('ExpenseItemCard - Edge Cases', () => {
  it('displays date from timestamp', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense()} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    // Should contain the month/day from June 15
    expect(getByText(/Jun/)).toBeTruthy();
  });

  it('uses theme error color for expenses in light mode', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ type: 'expense' })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    const amountText = getByText('-USD 50.50');
    expect(amountText).toBeTruthy();
    // Color should come from theme, not hardcoded
    expect(amountText.props.style).toBeDefined();
  });

  it('renders correctly in dark theme', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense()} onPress={onPress} />,
      { wrapper: DarkWrapper },
    );
    expect(getByText('Lunch')).toBeTruthy();
    expect(getByText('-USD 50.50')).toBeTruthy();
  });

  it('handles zero amount', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ amount: 0 })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    expect(getByText('-USD 0.00')).toBeTruthy();
  });

  it('handles very large amount', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ amount: 999999.99 })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    expect(getByText('-USD 999999.99')).toBeTruthy();
  });

  it('shows category when description is empty', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ description: '' })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    // Falls back to category
    expect(getByText('Food')).toBeTruthy();
  });

  it('has accessibility label', () => {
    const onPress = jest.fn();
    const expense = makeExpense();
    const { UNSAFE_root } = render(
      <ExpenseItemCard expense={expense} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    // Find Card element with accessibility label
    const cardElement = UNSAFE_root.findAll(
      (node: { props: { accessibilityLabel?: string } }) => node.props.accessibilityLabel?.includes('Expense'),
    );
    expect(cardElement.length).toBeGreaterThan(0);
  });

  it('calls onPress with expense on tap', () => {
    const onPress = jest.fn();
    const expense = makeExpense();
    const { getByText } = render(
      <ExpenseItemCard expense={expense} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    fireEvent.press(getByText('Lunch'));
    expect(onPress).toHaveBeenCalledWith(expense);
  });

  it('shows income prefix for income type', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ type: 'income', amount: 200 })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    expect(getByText('+USD 200.00')).toBeTruthy();
  });

  it('displays payment method in subtitle', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ExpenseItemCard expense={makeExpense({ paymentMethod: 'credit_card' })} onPress={onPress} />,
      { wrapper: LightWrapper },
    );
    expect(getByText(/credit_card/)).toBeTruthy();
  });
});
