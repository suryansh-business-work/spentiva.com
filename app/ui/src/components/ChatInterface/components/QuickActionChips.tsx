import React from 'react';
import { Box, Chip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SavingsIcon from '@mui/icons-material/Savings';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ReactElement;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Add Expense', prompt: 'I spent ', icon: <AddIcon sx={{ fontSize: 16 }} /> },
  { label: 'Add Income', prompt: 'I received ', icon: <TrendingUpIcon sx={{ fontSize: 16 }} /> },
  { label: 'Food', prompt: 'Spent on food ', icon: <LocalDiningIcon sx={{ fontSize: 16 }} /> },
  { label: 'Transport', prompt: 'Transport expense ', icon: <DirectionsBusIcon sx={{ fontSize: 16 }} /> },
  { label: 'Bills', prompt: 'Paid for ', icon: <ReceiptIcon sx={{ fontSize: 16 }} /> },
  { label: 'Savings', prompt: 'Saved ', icon: <SavingsIcon sx={{ fontSize: 16 }} /> },
];

interface QuickActionChipsProps {
  onSelect: (prompt: string) => void;
  visible?: boolean;
}

const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onSelect, visible = true }) => {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.75,
        px: { xs: 1.5, sm: 2 },
        py: 1,
        overflowX: 'auto',
        flexShrink: 0,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {QUICK_ACTIONS.map((action) => (
        <Chip
          key={action.label}
          label={action.label}
          icon={action.icon}
          size="small"
          variant="outlined"
          onClick={() => onSelect(action.prompt)}
          sx={{
            flexShrink: 0,
            borderColor: theme.palette.divider,
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
            height: 28,
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
            },
          }}
        />
      ))}
    </Box>
  );
};

export default QuickActionChips;
