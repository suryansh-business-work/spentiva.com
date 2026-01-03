import React, { useState } from 'react';
import { Button, ButtonGroup, TextField, Paper, Stack, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';

interface DateFilterBarProps {
  onFilterChange: (filter: string, startDate?: string, endDate?: string) => void;
  currentFilter: string;
}

const DateFilterBar: React.FC<DateFilterBarProps> = ({ onFilterChange, currentFilter }) => {
  const theme = useTheme();
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const filters = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  const handleQuickFilter = (filter: string) => {
    setShowCustom(false);
    onFilterChange(filter);
  };

  const handleCustomFilter = () => {
    if (customStart && customEnd) {
      onFilterChange('custom', customStart, customEnd);
      setShowCustom(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center">
        <Stack direction="row" alignItems="center" gap={1.5} flexWrap="wrap" flex={1}>
          <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
          <ButtonGroup size="small">
            {filters.map(f => (
              <Button
                key={f.value}
                onClick={() => handleQuickFilter(f.value)}
                variant={currentFilter === f.value ? 'contained' : 'outlined'}
                sx={{
                  px: 2,
                  py: 0.75,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderColor: currentFilter === f.value ? 'transparent' : theme.palette.divider,
                  '&:hover': {
                    borderColor:
                      currentFilter === f.value ? 'transparent' : theme.palette.primary.main,
                  },
                }}
              >
                {f.label}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        {showCustom ? (
          <Stack direction="row" spacing={1}>
            <TextField
              type="date"
              size="small"
              value={customStart}
              onChange={e => setCustomStart(e.target.value)}
              sx={{ width: 150 }}
            />
            <TextField
              type="date"
              size="small"
              value={customEnd}
              onChange={e => setCustomEnd(e.target.value)}
              sx={{ width: 150 }}
            />
            <Button
              size="small"
              variant="contained"
              onClick={handleCustomFilter}
              disabled={!customStart || !customEnd}
              sx={{ fontSize: '0.75rem', px: 2 }}
            >
              Apply
            </Button>
          </Stack>
        ) : (
          <Button
            size="small"
            startIcon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
            onClick={() => setShowCustom(true)}
            variant="outlined"
            sx={{ fontSize: '0.75rem', px: 2 }}
          >
            Custom
          </Button>
        )}

        <Button
          size="small"
          startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
          onClick={() => {
            setShowCustom(false);
            setCustomStart('');
            setCustomEnd('');
            onFilterChange('');
          }}
          variant="outlined"
          sx={{ fontSize: '0.75rem', px: 2 }}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
};

export default DateFilterBar;
