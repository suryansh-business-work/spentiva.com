import React from 'react';
import { Box, ButtonGroup, Button, TextField, useMediaQuery, useTheme } from '@mui/material';

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
  { value: 'last7days', label: '7D' },
  { value: 'lastMonth', label: 'Last Mo' },
  { value: 'thisMonth', label: 'This Mo' },
  { value: 'thisYear', label: 'Year' },
  { value: 'custom', label: 'Custom' },
];

/**
 * AnalyticsFilters Component
 * Renders responsive ButtonGroup filter controls and custom date range inputs
 */
const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filter,
  customStartDate,
  customEndDate,
  onFilterChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Box sx={{ width: '100%', overflowX: 'auto', pb: 0.5 }}>
        <ButtonGroup
          size={isMobile ? 'small' : 'medium'}
          variant="outlined"
          sx={{
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            '& .MuiButton-root': {
              textTransform: 'none',
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              px: { xs: 0.75, sm: 1.5 },
              py: { xs: 0.5, sm: 0.75 },
              minWidth: { xs: 'auto', sm: 64 },
            },
          }}
        >
          {filterOptions.map(option => (
            <Button
              key={option.value}
              variant={filter === option.value ? 'contained' : 'outlined'}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>
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
