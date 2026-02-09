import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import RecordingOverlay from './chatInput/RecordingOverlay';
import {
  isSpeechSupported,
  SpeechRecognitionConstructor,
  SpeechRecognitionShim,
  SpeechRecognitionEventShim,
  SpeechRecognitionResult,
} from './chatInput/speechTypes';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * ChatInput Component
 * Multiline input form with continuous speech-to-text and live audio visualizer
 */
const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Type your expense or income... (e.g., 'salary 50000 credited')",
}) => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionShim | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const preRecordValueRef = useRef('');
  const stoppedByUserRef = useRef(false);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setMediaRecorder(null);
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSpeechSupported()) return;
    preRecordValueRef.current = value;
    stoppedByUserRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorder.start();
      setMediaRecorder(recorder);
    } catch {
      /* Visualizer won't work but speech recognition can still proceed */
    }

    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      (window as unknown as Record<string, SpeechRecognitionConstructor>).SpeechRecognition ||
      (window as unknown as Record<string, SpeechRecognitionConstructor>).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEventShim) => {
      const transcript = Array.from(event.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join('');
      onChange(transcript);
    };

    recognition.onerror = () => {
      if (!stoppedByUserRef.current) {
        setIsRecording(false);
        stopMedia();
      }
    };

    // Keep recognition alive on silence — do NOT reset transcript
    recognition.onend = () => {
      if (!stoppedByUserRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
        } catch {
          setIsRecording(false);
          stopMedia();
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [value, onChange, stopMedia]);

  const acceptRecording = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopMedia();
    setIsRecording(false);
  }, [stopMedia]);

  const cancelRecording = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    stopMedia();
    setIsRecording(false);
    onChange(preRecordValueRef.current);
  }, [stopMedia, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        position: 'sticky',
        width: '100%',
        bottom: 0,
        zIndex: 999,
        bgcolor: theme.palette.background.paper,
        border: 'none',
        boxShadow: `0 -2px 8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
        pb: { xs: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))', sm: 1.5 },
      }}
    >
      {isRecording ? (
        <RecordingOverlay
          stream={streamRef.current}
          onAccept={acceptRecording}
          onCancel={cancelRecording}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  bgcolor:
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                },
              }}
            />
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
                flexShrink: 0,
                '&:hover': {
                  background:
                    disabled || !value.trim()
                      ? theme.palette.action.disabledBackground
                      : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
                '&:disabled': { color: theme.palette.action.disabled },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
            {isSpeechSupported() && (
              <IconButton
                onClick={startRecording}
                disabled={disabled}
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  color: theme.palette.text.secondary,
                  '&:hover': { bgcolor: 'action.hover' },
                  transition: 'all 0.2s ease',
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </form>
      )}
    </Paper>
  );
};

export default ChatInput;
