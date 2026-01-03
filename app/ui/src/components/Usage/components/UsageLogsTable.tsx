import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { UsageLog } from '../../../types/usage';

interface UsageLogsTableProps {
  logs: UsageLog[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  onRefresh: () => void;
  selectedTrackerId?: string;
  onDeleteTrackerLogs?: () => void;
  deletingTracker?: boolean;
}

/**
 * UsageLogsTable Component
 * Displays paginated table of usage logs
 */
const UsageLogsTable: React.FC<UsageLogsTableProps> = ({
  logs,
  totalCount,
  loading,
  error,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onRefresh,
  selectedTrackerId,
  onDeleteTrackerLogs,
  deletingTracker = false,
}) => {
  const theme = useTheme();
  const handleChangePage = (_event: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        border: 'none',
        boxShadow: 'none',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Usage Logs
        </Typography>
        <Box>
          {selectedTrackerId && onDeleteTrackerLogs && (
            <Tooltip title="Delete all logs for this tracker">
              <IconButton
                onClick={onDeleteTrackerLogs}
                color="error"
                sx={{ mr: 1 }}
                disabled={deletingTracker}
              >
                {deletingTracker ? <CircularProgress size={20} /> : <DeleteIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Refresh logs">
            <IconButton onClick={onRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="usage logs table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tracker</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tokens</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Content Preview</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No logs found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map(log => (
                <TableRow hover role="checkbox" tabIndex={-1} key={log._id}>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {log.trackerSnapshot?.trackerName || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.trackerSnapshot?.trackerType}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.messageRole}
                      size="small"
                      color={log.messageRole === 'user' ? 'primary' : 'secondary'}
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>{log.tokenCount}</TableCell>
                  <TableCell>
                    <Tooltip title={log.messageContent}>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 300,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {log.messageContent}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default UsageLogsTable;
