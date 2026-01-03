import React from 'react';
import { TextField, MenuItem, Button, Paper, Stack, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

interface UserFiltersProps {
  filters: { search: string; role: string; accountType: string; emailVerified: string };
  onFilterChange: (filters: any) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange }) => {
  const theme = useTheme();

  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleClear = () => {
    onFilterChange({ search: '', role: '', accountType: '', emailVerified: '' });
  };

  const hasFilters = filters.search || filters.role || filters.accountType || filters.emailVerified;

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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          size="small"
          placeholder="Search email or name..."
          value={filters.search}
          onChange={e => handleChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 20 }} />
            ),
          }}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <TextField
          select
          size="small"
          label="Role"
          value={filters.role}
          onChange={e => handleChange('role', e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Plan"
          value={filters.accountType}
          onChange={e => handleChange('accountType', e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="free">Free</MenuItem>
          <MenuItem value="pro">Pro</MenuItem>
          <MenuItem value="businesspro">Business Pro</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Status"
          value={filters.emailVerified}
          onChange={e => handleChange('emailVerified', e.target.value)}
          sx={{ minWidth: 130 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Verified</MenuItem>
          <MenuItem value="false">Unverified</MenuItem>
        </TextField>

        <Button
          size="small"
          startIcon={<ClearAllIcon sx={{ fontSize: 16 }} />}
          onClick={handleClear}
          disabled={!hasFilters}
          variant="outlined"
          sx={{ fontSize: '0.75rem', px: 2 }}
        >
          Clear
        </Button>
      </Stack>
    </Paper>
  );
};

export default UserFilters;
