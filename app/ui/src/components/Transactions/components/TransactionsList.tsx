import React from 'react';
import {
  Box,
  Skeleton,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Expense } from '../../../types';

/** Currency symbol lookup */
const CURRENCY_SYM: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TransactionsListProps {
  loading: boolean;
  expenses: Expense[];
  selected: string[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onBulkDelete: () => void;
}

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/**
 * TransactionsList Component — Table view with pagination and bulk actions
 */
const TransactionsList: React.FC<TransactionsListProps> = ({
  loading,
  expenses,
  selected,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
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

  const allSelected = expenses.length > 0 && selected.length === expenses.length;
  const someSelected = selected.length > 0 && selected.length < expenses.length;

  return (
    <>
      {/* Bulk actions bar */}
      {selected.length > 0 && (
        <Paper
          elevation={2}
          sx={{
            p: 1.5,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'error.50',
            borderLeft: '3px solid',
            borderColor: 'error.main',
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {selected.length} selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteSweepIcon />}
            onClick={onBulkDelete}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Delete Selected
          </Button>
        </Paper>
      )}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>}
              {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Mode</TableCell>}
              <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                Debit
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                Credit
              </TableCell>
              {!isMobile && <TableCell sx={{ fontWeight: 700 }}>Logged By</TableCell>}
              <TableCell align="center" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map(exp => {
              const isIncome = exp.type === 'income';
              const currSym = CURRENCY_SYM[exp.currency || 'INR'] || '₹';
              const isSelected = selected.includes(exp.id);

              return (
                <TableRow
                  key={exp.id}
                  hover
                  selected={isSelected}
                  sx={{
                    '&.Mui-selected': { bgcolor: 'action.selected' },
                    borderLeft: '3px solid',
                    borderColor: isIncome
                      ? 'success.main'
                      : 'error.main',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect(exp.id)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                    {formatDate(exp.timestamp)}
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {exp.subcategory}
                      </Typography>
                      {exp.description && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {exp.description}
                        </Typography>
                      )}
                      {isMobile && (
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip
                            label={exp.category}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                          {exp.createdByName && (
                            <Chip
                              label={exp.createdByName}
                              size="small"
                              color="info"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Chip
                        label={exp.category}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {isIncome ? exp.creditFrom : exp.paymentMethod}
                      </Typography>
                    </TableCell>
                  )}
                  {/* Debit column */}
                  <TableCell align="right">
                    {!isIncome && (
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        {currSym}
                        {exp.amount.toLocaleString('en-IN')}
                      </Typography>
                    )}
                  </TableCell>
                  {/* Credit column */}
                  <TableCell align="right">
                    {isIncome && (
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {currSym}
                        {exp.amount.toLocaleString('en-IN')}
                      </Typography>
                    )}
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Tooltip
                        title={exp.lastUpdatedByName ? `Updated by ${exp.lastUpdatedByName}` : ''}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {exp.createdByName || '—'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary" onClick={() => onEdit(exp)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => onDelete(exp)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.limit}
          onPageChange={(_e, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
          rowsPerPageOptions={[10, 20, 50, 100]}
          labelRowsPerPage="Per page:"
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      </TableContainer>
    </>
  );
};

export default TransactionsList;
