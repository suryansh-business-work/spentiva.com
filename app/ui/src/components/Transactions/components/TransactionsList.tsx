import React from 'react';
import { Box, Skeleton, Paper, Typography, Button } from '@mui/material';
import { Expense } from '../../../types';
import TransactionCard from './TransactionCard';

interface TransactionsListProps {
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onLoadMore: () => void;
}

/**
 * TransactionsList Component
 * Displays the list of expense transactions with loading states and load more button
 */
const TransactionsList: React.FC<TransactionsListProps> = ({
  loading,
  loadingMore,
  hasMore,
  expenses,
  onEdit,
  onDelete,
  onLoadMore,
}) => {
  if (loading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} variant="rectangular" height={80} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  if (expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No transactions found
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {expenses.map(expense => (
          <TransactionCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </Box>

      {/* Load More Button */}
      {!loading && expenses.length > 0 && hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onLoadMore}
            disabled={loadingMore}
            sx={{
              minWidth: '200px',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </>
  );
};

export default TransactionsList;
