import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatAmount } from '../utils/currency';

interface MonthlyDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedYear: number;
  monthlyExpenses: number[];
  monthlyIncome: number[];
  monthlyTransactions: number[];
  currency: string;
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MonthlyDetailsDialog: React.FC<MonthlyDetailsDialogProps> = ({
  open,
  onClose,
  selectedYear,
  monthlyExpenses,
  monthlyIncome,
  monthlyTransactions,
  currency,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const totalExpenses = monthlyExpenses.reduce((s, v) => s + v, 0);
  const totalIncome = monthlyIncome.reduce((s, v) => s + v, 0);
  const totalTxn = monthlyTransactions.reduce((s, v) => s + v, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: isDarkMode ? 'rgba(30,30,30,0.98)' : 'background.paper',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        <Typography variant="h6" fontWeight={600}>
          Monthly Details ({selectedYear})
        </Typography>
        <IconButton
          edge="end"
          onClick={onClose}
          size="small"
          sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Expenses
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Income
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Txns
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {MONTH_LABELS.map((month, i) => (
                <TableRow key={i} hover>
                  <TableCell>{month}</TableCell>
                  <TableCell align="right">{formatAmount(monthlyExpenses[i], currency)}</TableCell>
                  <TableCell align="right">{formatAmount(monthlyIncome[i], currency)}</TableCell>
                  <TableCell align="right">{monthlyTransactions[i]}</TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}
              >
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatAmount(totalExpenses, currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatAmount(totalIncome, currency)}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {totalTxn}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default MonthlyDetailsDialog;
