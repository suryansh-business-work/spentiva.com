import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, Chip, Divider } from '@mui/material';
import { Expense } from '../../../types/expense';

/** Currency symbol lookup */
const CURRENCY_SYMBOL: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

/**
 * Props for ExpenseCard component
 */
interface ExpenseCardProps {
  expenses: Expense[];
}

/**
 * ExpenseCard Component
 * Displays single or multiple transactions (expense / income) in a compact card
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ expenses }) => {
  const theme = useTheme();
  const count = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const hasIncome = expenses.some(e => e.type === 'income');
  const hasExpense = expenses.some(e => !e.type || e.type === 'expense');
  const isMixed = hasIncome && hasExpense;

  const badgeLabel = isMixed
    ? `${count} Transactions`
    : hasIncome
      ? `${count} Income`
      : `${count} Expenses`;

  return (
    <Card
      elevation={0}
      sx={{
        mt: 1.5,
        maxWidth: '300px',
        backgroundColor:
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${
          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
        }`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Header - Count Badge and Total */}
        {count > 1 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Chip
              label={badgeLabel}
              size="small"
              sx={{
                height: '20px',
                fontSize: '0.7rem',
                fontWeight: 600,
                bgcolor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(16, 185, 129, 0.2)'
                    : 'rgba(16, 185, 129, 0.15)',
                color: theme.palette.mode === 'dark' ? '#10B981' : '#059669',
              }}
            />
            <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
              Total: ₹{totalAmount}
            </Typography>
          </Box>
        )}

        {/* Transaction Items */}
        {expenses.map((expense, index) => {
          const isIncome = expense.type === 'income';
          const currSym = CURRENCY_SYMBOL[expense.currency || 'INR'] || '₹';
          const amountColor = isIncome ? 'success.main' : 'error.main';
          const amountPrefix = isIncome ? '+' : '-';

          return (
            <React.Fragment key={expense.id || index}>
              {index > 0 && <Divider sx={{ my: 1 }} />}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
                {/* Amount, Category, and Type Badge */}
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                      {expense.subcategory}
                    </Typography>
                    {isIncome && (
                      <Chip
                        label="Income"
                        size="small"
                        sx={{
                          height: '16px',
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          bgcolor: 'rgba(16,185,129,0.15)',
                          color: 'success.main',
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight="700"
                    color={amountColor}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    {amountPrefix}
                    {currSym}
                    {expense.amount}
                  </Typography>
                </Box>

                {/* Payment Method (for expenses) */}
                {!isIncome &&
                  expense.paymentMethod &&
                  expense.paymentMethod !== 'User not provided payment method' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        via
                      </Typography>
                      <Chip
                        label={expense.paymentMethod}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: '18px',
                          fontSize: '0.65rem',
                          borderColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(255,255,255,0.2)'
                              : 'rgba(0,0,0,0.2)',
                        }}
                      />
                    </Box>
                  )}

                {/* Credit From (for income) */}
                {isIncome &&
                  expense.creditFrom &&
                  expense.creditFrom !== 'User not provided credit source' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        from
                      </Typography>
                      <Chip
                        label={expense.creditFrom}
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ height: '18px', fontSize: '0.65rem' }}
                      />
                    </Box>
                  )}

                {/* Description (if available) */}
                {expense.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.72rem', lineHeight: 1.3, fontStyle: 'italic' }}
                  >
                    &quot;{expense.description}&quot;
                  </Typography>
                )}
              </Box>
            </React.Fragment>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
