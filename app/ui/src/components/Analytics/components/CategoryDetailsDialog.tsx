import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, Typography, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CategoryExpense } from '../../../types/analytics';
import { formatAmount } from '../utils/currency';

interface CategoryDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  data: CategoryExpense[];
  currency: string;
}

const CategoryDetailsDialog: React.FC<CategoryDetailsDialogProps> = ({ open, onClose, data, currency }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const totalExpenses = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: isDarkMode ? 'rgba(30,30,30,0.98)' : 'background.paper', backdropFilter: 'blur(10px)' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight={600}>Category Expenses Details</Typography>
        <IconButton edge="end" onClick={onClose} size="small"
          sx={{ color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Txns</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>%</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => {
                const pct = totalExpenses > 0 ? ((item.total / totalExpenses) * 100).toFixed(1) : '0.0';
                return (
                  <TableRow key={index} hover>
                    <TableCell>{item.category}</TableCell>
                    <TableCell align="right">{formatAmount(item.total, currency)}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                    <TableCell align="right">{pct}%</TableCell>
                  </TableRow>
                );
              })}
              <TableRow sx={{ bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{formatAmount(totalExpenses, currency)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>{data.reduce((s, i) => s + i.count, 0)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailsDialog;
