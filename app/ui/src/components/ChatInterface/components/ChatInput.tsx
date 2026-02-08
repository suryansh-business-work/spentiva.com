import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, useTheme, Typography, keyframes } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { LiveAudioVisualizer } from 'react-audio-visualize';

/* ---------- Web Speech API type shims (not in default TS lib) ---------- */
interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
  [Symbol.iterator](): Iterator<SpeechRecognitionResult>;
}
interface SpeechRecognitionEventShim extends Event {
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionShim extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventShim) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionShim;
}
/* ---------------------------------------------------------------------- */

/** Pulsing animation for active recording */
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const isSpeechSupported = (): boolean =>
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

/**
 * ChatInput Component
 * Compact input form with speech-to-text and live audio visualizer
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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionShim | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      mediaRecorder?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  /** Toggle speech recognition + audio visualizer on/off */
  const toggleRecording = useCallback(async () => {
    if (!isSpeechSupported()) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      mediaRecorder?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      setMediaRecorder(null);
      setIsRecording(false);
      return;
    }

    // Start mic stream for visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorder.start();
      setMediaRecorder(recorder);
    } catch {
      // Visualizer won't work but speech recognition can still proceed
    }

    // Start SpeechRecognition for STT
    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      (window as unknown as Record<string, SpeechRecognitionConstructor>).SpeechRecognition ||
      (window as unknown as Record<string, SpeechRecognitionConstructor>).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEventShim) => {
      const transcript = Array.from(event.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join('');
      onChange(transcript);
    };

    const stopAll = () => {
      setIsRecording(false);
      mediaRecorder?.stop();
      streamRef.current?.getTracks().forEach(t => t.stop());
      setMediaRecorder(null);
    };

    recognition.onerror = () => stopAll();
    recognition.onend = () => stopAll();

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, onChange, mediaRecorder]);

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
      {/* Live audio visualizer when recording */}
      {isRecording && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mb: 1,
          }}
        >
          {mediaRecorder && (
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={200}
              height={30}
              barWidth={2}
              gap={1}
              barColor={theme.palette.error.main}
            />
          )}
          <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
            Listening…
          </Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Microphone Button */}
          {isSpeechSupported() && (
            <IconButton
              onClick={toggleRecording}
              disabled={disabled}
              sx={{
                width: 42,
                height: 42,
                color: isRecording ? '#fff' : theme.palette.text.secondary,
                bgcolor: isRecording ? 'error.main' : 'transparent',
                animation: isRecording ? `${pulse} 1.2s ease-in-out infinite` : 'none',
                '&:hover': {
                  bgcolor: isRecording ? 'error.dark' : 'action.hover',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isRecording ? <MicOffIcon fontSize="small" /> : <MicIcon fontSize="small" />}
            </IconButton>
          )}

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

          {/* Submit Button */}
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
