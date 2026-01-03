import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';

interface FilterBarProps {
  filter: string;
  customStartDate: string;
  customEndDate: string;
  emailLoading: boolean;
  onFilterChange: (filter: string) => void;
  onCustomDateChange: (field: 'start' | 'end', value: string) => void;
  onDownload: () => void;
  onEmail: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  customStartDate,
  customEndDate,
  emailLoading,
  onFilterChange,
  onCustomDateChange,
  onDownload,
  onEmail,
}) => {
  const filters = [
    'today',
    'yesterday',
    'last7days',
    'lastMonth',
    'thisMonth',
    'indiaFY',
    'thisYear',
    'custom',
  ];

  const getFilterLabel = (f: string) => {
    const labels: Record<string, string> = {
      last7days: 'Last 7 Days',
      lastMonth: 'Last Month',
      thisMonth: 'This Month',
      indiaFY: 'India FY',
      thisYear: 'This Year',
    };
    return labels[f] || f.charAt(0).toUpperCase() + f.slice(1);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          mb: 2,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 1,
            width: { xs: '100%', md: 'auto' },
            overflowX: 'auto',
          }}
        >
          {filters.map(filterOption => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'contained' : 'outlined'}
              onClick={() => onFilterChange(filterOption)}
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
              {getFilterLabel(filterOption)}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', md: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
            onClick={onDownload}
            size="small"
            fullWidth
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              flex: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Download Report
            </Box>
            <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Download
            </Box>
          </Button>
          <Button
            variant="contained"
            startIcon={<EmailIcon sx={{ display: { xs: 'none', sm: 'block' } }} />}
            onClick={onEmail}
            disabled={emailLoading}
            size="small"
            fullWidth
            sx={{
              textTransform: 'none',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              flex: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {emailLoading ? (
              'Sending...'
            ) : (
              <>
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Email Report
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Email
                </Box>
              </>
            )}
          </Button>
        </Box>
      </Box>

      {filter === 'custom' && (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            value={customStartDate}
            onChange={e => onCustomDateChange('start', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          <TextField
            type="date"
            label="End Date"
            value={customEndDate}
            onChange={e => onCustomDateChange('end', e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
};

export default FilterBar;
