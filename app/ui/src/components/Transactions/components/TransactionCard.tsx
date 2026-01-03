import React from 'react';
import { Box, Card, CardContent, Chip, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expense } from '../../../types';

interface TransactionCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

/**
 * TransactionCard Component
 * Displays a single expense transaction card
 */
const TransactionCard: React.FC<TransactionCardProps> = ({ expense, onEdit, onDelete }) => {
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
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, border: 0 }}>
        <Chip
          label={`₹${expense.amount.toLocaleString('en-IN')}`}
          color="primary"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.1em',
            minWidth: '100px',
            height: '40px',
          }}
        />

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="600">
            {expense.subcategory}
          </Typography>
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
            <Chip label={expense.paymentMethod} size="small" variant="outlined" />
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
