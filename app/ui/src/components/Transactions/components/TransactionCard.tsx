import React from 'react';
import { Box, Card, CardContent, Chip, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expense } from '../../../types';

/** Currency symbol lookup */
const CURRENCY_SYM: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

interface TransactionCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

/**
 * TransactionCard Component
 * Displays a single transaction card with income/expense/transfer type styling
 */
const TransactionCard: React.FC<TransactionCardProps> = ({ expense, onEdit, onDelete }) => {
  const isIncome = expense.type === 'income';
  const isTransfer = expense.type === 'transfer';
  const currSym = CURRENCY_SYM[expense.currency || 'INR'] || '₹';

  const amountChipColor = isIncome ? 'success' : isTransfer ? 'info' : 'error';
  const amountPrefix = isIncome ? '+' : isTransfer ? '' : '-';

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        transition: 'all 0.2s',
        borderColor: '#ddd',
        borderLeft: `3px solid`,
        borderLeftColor: isIncome ? 'success.main' : isTransfer ? 'info.main' : 'error.main',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, border: 0 }}>
        <Chip
          label={`${amountPrefix}${currSym}${expense.amount.toLocaleString('en-IN')}`}
          color={amountChipColor}
          sx={{
            fontWeight: 'bold',
            fontSize: '1.1em',
            minWidth: '100px',
            height: '40px',
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" fontWeight="600">
              {expense.subcategory}
            </Typography>
            {(isIncome || isTransfer) && (
              <Chip
                label={isIncome ? 'Income' : 'Transfer'}
                size="small"
                color={isIncome ? 'success' : 'info'}
                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              mt: 0.5,
            }}
          >
            <Chip label={expense.category} size="small" variant="outlined" color="secondary" />
            {!isIncome && expense.paymentMethod && (
              <Chip label={expense.paymentMethod} size="small" variant="outlined" />
            )}
            {isIncome && expense.creditFrom && (
              <Chip
                label={`from: ${expense.creditFrom}`}
                size="small"
                variant="outlined"
                color="success"
              />
            )}
            {expense.description && (
              <Typography variant="caption" color="text.secondary">
                {expense.description}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {formatDate(expense.timestamp)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(expense)}
              sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.1)' } }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(expense)}
              sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
