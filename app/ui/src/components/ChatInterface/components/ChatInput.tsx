import React from 'react';
import { Box, TextField, IconButton, Paper, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

/**
 * Props for ChatInput component
 */
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Compact input form for sending chat messages
 */
const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your expense... (e.g., 'spend food 50 from credit card')",
}) => {
  const theme = useTheme();

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        position: 'fixed',
        width: '100%',
        bottom: 0,
        zIndex: 999,
        bgcolor: theme.palette.background.paper,
        border: 'none',
        boxShadow: `0 -2px 8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Input Field */}
          <TextField
            fullWidth
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              },
            }}
          />

          {/* Submit Button - Icon Only */}
          <IconButton
            type="submit"
            disabled={disabled || !value.trim()}
            sx={{
              background:
                disabled || !value.trim()
                  ? theme.palette.action.disabledBackground
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: '#fff',
              width: 42,
              height: 42,
              '&:hover': {
                background:
                  disabled || !value.trim()
                    ? theme.palette.action.disabledBackground
                    : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
              '&:disabled': {
                color: theme.palette.action.disabled,
              },
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </form>
    </Paper>
  );
};

export default ChatInput;
