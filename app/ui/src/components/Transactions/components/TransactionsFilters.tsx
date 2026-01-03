import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Popover,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Tooltip,
  Menu,
  Badge,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface TransactionsFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  paymentFilter: string;
  sortBy: string;
  filteredExpensesCount: number;
  filterCategories: string[];
  filterPaymentMethods: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onPaymentChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

/**
 * TransactionsFilters Component
 * Renders search bar and filter controls for transactions
 * Redesigned for compactness and better UX
 */
const TransactionsFilters: React.FC<TransactionsFiltersProps> = ({
  searchTerm,
  categoryFilter,
  paymentFilter,
  sortBy,
  filteredExpensesCount,
  filterCategories,
  filterPaymentMethods,
  onSearchChange,
  onCategoryChange,
  onPaymentChange,
  onSortChange,
}) => {
  // State for Filter Popover
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openFilter = Boolean(filterAnchorEl);

  // State for Sort Menu
  const [sortAnchorEl, setSortAnchorEl] = useState<HTMLButtonElement | null>(null);
  const openSort = Boolean(sortAnchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (value: string) => {
    onSortChange(value);
    handleSortClose();
  };

  const clearAllFilters = () => {
    onCategoryChange('all');
    onPaymentChange('all');
    onSearchChange('');
  };

  const activeFiltersCount = (categoryFilter !== 'all' ? 1 : 0) + (paymentFilter !== 'all' ? 1 : 0);

  const getSortLabel = (value: string) => {
    switch (value) {
      case 'date-desc':
        return 'Newest First';
      case 'date-asc':
        return 'Oldest First';
      case 'amount-desc':
        return 'Highest Amount';
      case 'amount-asc':
        return 'Lowest Amount';
      default:
        return 'Sort';
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* Main Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: { xs: '100%', md: '400px' } }}>
          <TextField
            fullWidth
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                backgroundColor: 'background.paper',
                '& fieldset': { border: '1px solid rgba(0,0,0,0.1)' },
                '&:hover fieldset': { borderColor: 'primary.main' },
              },
            }}
            size="small"
          />
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Filter Button */}
          <Tooltip title="Filter Transactions">
            <Button
              variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
              color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
              startIcon={
                <Badge badgeContent={activeFiltersCount} color="error">
                  <FilterListIcon />
                </Badge>
              }
              onClick={handleFilterClick}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                borderColor: 'rgba(0,0,0,0.12)',
                height: '40px',
              }}
            >
              Filters
            </Button>
          </Tooltip>

          {/* Sort Button */}
          <Tooltip title="Sort Transactions">
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<SortIcon />}
              onClick={handleSortClick}
              sx={{
                borderRadius: '10px',
                textTransform: 'none',
                borderColor: 'rgba(0,0,0,0.12)',
                height: '40px',
                display: { xs: 'none', sm: 'flex' }, // Hide text on super small screens if needed, but flex is fine
              }}
            >
              {getSortLabel(sortBy)}
            </Button>
          </Tooltip>
          {/* Mobile Sort Icon Only */}
          <IconButton
            onClick={handleSortClick}
            sx={{
              display: { xs: 'flex', sm: 'none' },
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: '10px',
            }}
          >
            <SortIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Active Filters Chips */}
      {(categoryFilter !== 'all' || paymentFilter !== 'all' || searchTerm) && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Active Filters:
          </Typography>

          {categoryFilter !== 'all' && (
            <Chip
              label={`Category: ${categoryFilter}`}
              onDelete={() => onCategoryChange('all')}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}

          {paymentFilter !== 'all' && (
            <Chip
              label={`Payment: ${paymentFilter}`}
              onDelete={() => onPaymentChange('all')}
              color="secondary"
              variant="outlined"
              size="small"
            />
          )}

          {searchTerm && (
            <Chip
              label={`Search: ${searchTerm}`}
              onDelete={() => onSearchChange('')}
              variant="outlined"
              size="small"
            />
          )}

          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={clearAllFilters}
            sx={{ textTransform: 'none', ml: 'auto' }}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Results Count */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Showing <strong>{filteredExpensesCount}</strong> transactions
        </Typography>
      </Box>

      {/* Filter Popover */}
      <Popover
        open={openFilter}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 300, p: 2, borderRadius: '12px' },
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
          Filter Transactions
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={e => onCategoryChange(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {filterCategories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Payment Method</InputLabel>
          <Select
            value={paymentFilter}
            onChange={e => onPaymentChange(e.target.value)}
            label="Payment Method"
          >
            <MenuItem value="all">All Payment Methods</MenuItem>
            {filterPaymentMethods.map(method => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleFilterClose} size="small">
            Done
          </Button>
        </Box>
      </Popover>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={openSort}
        onClose={handleSortClose}
        PaperProps={{
          sx: { borderRadius: '12px', minWidth: 150 },
        }}
      >
        <MenuItem selected={sortBy === 'date-desc'} onClick={() => handleSortSelect('date-desc')}>
          Date (Newest First)
        </MenuItem>
        <MenuItem selected={sortBy === 'date-asc'} onClick={() => handleSortSelect('date-asc')}>
          Date (Oldest First)
        </MenuItem>
        <MenuItem
          selected={sortBy === 'amount-desc'}
          onClick={() => handleSortSelect('amount-desc')}
        >
          Amount (High to Low)
        </MenuItem>
        <MenuItem selected={sortBy === 'amount-asc'} onClick={() => handleSortSelect('amount-asc')}>
          Amount (Low to High)
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TransactionsFilters;
