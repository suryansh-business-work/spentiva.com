import React from 'react';
import { Box, Button, TextField } from '@mui/material';

interface AnalyticsFiltersProps {
  filter: string;
  customStartDate: string;
  customEndDate: string;
  onFilterChange: (filter: string) => void;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
}

const filterOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'thisYear', label: 'This Year' },
  { value: 'custom', label: 'Custom' },
];

/**
 * AnalyticsFilters Component
 * Renders filter buttons and custom date range inputs
 */
const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filter,
  customStartDate,
  customEndDate,
  onFilterChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: 1,
          width: '100%',
          overflowX: 'auto',
          pb: 0.5,
          '&::-webkit-scrollbar': {
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        {filterOptions.map(option => (
          <Button
            key={option.value}
            variant={filter === option.value ? 'contained' : 'outlined'}
            onClick={() => onFilterChange(option.value)}
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 1.5 },
              minWidth: 'auto',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {option.label}
          </Button>
        ))}
      </Box>

      {filter === 'custom' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            type="date"
            label="Start Date"
            value={customStartDate}
            onChange={e => onCustomStartDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            type="date"
            label="End Date"
            value={customEndDate}
            onChange={e => onCustomEndDateChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
};

export default AnalyticsFilters;
