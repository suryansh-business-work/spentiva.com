import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, Chip, Divider } from '@mui/material';
import { Expense } from '../../../types/expense';

/**
 * Props for ExpenseCard component
 */
interface ExpenseCardProps {
  expenses: Expense[];
}

/**
 * ExpenseCard Component
 * Displays single or multiple expenses in a compact card format (max-width: 300px)
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ expenses }) => {
  const theme = useTheme();
  const expenseCount = expenses.length;
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

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
        {expenseCount > 1 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Chip
              label={`${expenseCount} Expenses`}
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

        {/* Expense Items */}
        {expenses.map((expense, index) => (
          <React.Fragment key={expense.id || index}>
            {index > 0 && <Divider sx={{ my: 1 }} />}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
              {/* Amount and Category */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight="600" sx={{ fontSize: '0.85rem' }}>
                  {expense.subcategory}
                </Typography>
                <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.9rem' }}>
                  ₹{expense.amount}
                </Typography>
              </Box>

              {/* Payment Method (if provided) */}
              {expense.paymentMethod && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
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
                        theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                    }}
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
                  "{expense.description}"
                </Typography>
              )}
            </Box>
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
