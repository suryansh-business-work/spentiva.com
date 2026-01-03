import React from 'react';
import { Box, Avatar, Paper, Typography, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Message } from '../../../types';
import ExpenseCard from './ExpenseCard';

/**
 * Props for ChatMessage component
 */
interface ChatMessageProps {
  message: Message;
  userPhotoUrl?: string;
  userName?: string;
}

/**
 * ChatMessage Component
 * Displays a single chat message with avatar and content (WhatsApp-style)
 */
const ChatMessage: React.FC<ChatMessageProps> = ({ message, userPhotoUrl, userName }) => {
  const isUser = message.role === 'user';
  const theme = useTheme();

  /**
   * Get avatar content based on message role
   */
  const getAvatarContent = () => {
    if (isUser) {
      if (userName) {
        return userName.charAt(0).toUpperCase();
      }
      return <PersonIcon />;
    }
    return <SmartToyIcon />;
  };

  // Check if message contains HTML (for category error links)
  const hasHtmlLink = message.content.includes('<a href=');
  const displayContent = hasHtmlLink
    ? message.content.replace('CATEGORY_ERROR::', '')
    : message.content;

  return (
    <Box
      className={`message ${message.role}`}
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 1.5,
        gap: 1,
        flexDirection: isUser ? 'row-reverse' : 'row',
        animation: 'slideIn 0.3s ease-out',
        '@keyframes slideIn': {
          from: {
            opacity: 0,
            transform: isUser ? 'translateX(20px)' : 'translateX(-20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        src={isUser ? userPhotoUrl : undefined}
        sx={{
          width: 36,
          height: 36,
          background: isUser
            ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          flexShrink: 0,
          boxShadow: isUser
            ? `0 2px 8px ${theme.palette.success.main}40`
            : `0 2px 8px ${theme.palette.primary.main}40`,
        }}
      >
        {getAvatarContent()}
      </Avatar>

      {/* Message Content */}
      <Box sx={{ maxWidth: '70%', position: 'relative' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            pt: 1.25,
            pb: isUser ? 1.75 : 1.25,
            backgroundColor: isUser
              ? theme.palette.mode === 'dark'
                ? theme.palette.success.dark
                : theme.palette.success.light
              : theme.palette.background.paper,
            color: isUser
              ? theme.palette.mode === 'dark'
                ? theme.palette.common.white
                : theme.palette.success.contrastText
              : theme.palette.text.primary,
            borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
            border: isUser ? 'none' : `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 1px 3px rgba(0,0,0,0.3)'
                : '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {hasHtmlLink ? (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
                '& a': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 600,
                },
              }}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </Typography>
          )}

          {/* Expense Card (if expense data is present) */}
          {(message.expenses || message.expense) && (
            <ExpenseCard
              expenses={message.expenses || (message.expense ? [message.expense] : [])}
            />
          )}

          {/* Double-tick indicator for user messages */}
          {isUser && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 4,
                right: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <DoneAllIcon
                sx={{
                  fontSize: 14,
                  color:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.7)'
                      : 'rgba(255,255,255,0.9)',
                  opacity: 0.9,
                }}
              />
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatMessage;
