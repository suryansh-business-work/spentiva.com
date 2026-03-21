import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Expense } from '@/types';

interface ExpenseItemCardProps {
  expense: Expense;
  onPress: (expense: Expense) => void;
}

export const ExpenseItemCard: React.FC<ExpenseItemCardProps> = React.memo(
  ({ expense, onPress }) => {
    const theme = useTheme();
    const isIncome = expense.type === 'income';
    const amountColor = isIncome ? '#10B981' : '#EF4444';
    const amountPrefix = isIncome ? '+' : '-';

    return (
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        onPress={() => onPress(expense)}
        mode="outlined"
      >
        <Card.Content style={styles.content}>
          <View style={styles.left}>
            <MaterialCommunityIcons
              name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
              size={28}
              color={amountColor}
            />
            <View style={styles.details}>
              <Text variant="bodyMedium" style={styles.description} numberOfLines={1}>
                {expense.description || expense.category}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {expense.category} · {expense.paymentMethod}
              </Text>
            </View>
          </View>
          <Text variant="titleSmall" style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}{expense.currency} {expense.amount.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
    );
  }
);

ExpenseItemCard.displayName = 'ExpenseItemCard';

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontFamily: 'Inter-Medium',
  },
  amount: {
    fontFamily: 'Inter-SemiBold',
  },
});
