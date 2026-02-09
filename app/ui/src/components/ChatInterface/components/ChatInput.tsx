import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, useTheme, Typography, keyframes } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Visualizer } from 'react-sound-visualizer';

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
 * Compact input form with continuous speech-to-text (records until user
 * explicitly accepts ✓ or cancels ✗) and live audio visualizer
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

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  /** Stop mic stream + recorder */
  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setMediaRecorder(null);
  }, []);

  /** Start continuous recording */
  const startRecording = useCallback(async () => {
    if (!isSpeechSupported()) return;

    preRecordValueRef.current = value;
    stoppedByUserRef.current = false;

    // Start mic stream for visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // Keep MediaRecorder reference for compatibility but we use stream directly
      const recorder = new MediaRecorder(stream);
      recorder.start();
      setMediaRecorder(recorder);
    } catch {
      // Visualizer won't work but speech recognition can still proceed
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

    // Auto-restart if the browser stops recognition (e.g. silence timeout)
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

  /** Accept the transcription and stop recording */
  const acceptRecording = useCallback(() => {
    stoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    stopMedia();
    setIsRecording(false);
    // value already has transcript — user can now send it
  }, [stopMedia]);

  /** Cancel recording and restore previous value */
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
        /* ------- Recording Mode: cancel + waveform + accept ------- */
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Visualizer + listening label */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              borderRadius: 3,
              py: 0.75,
              px: 1.5,
              bgcolor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            {streamRef.current && (
              <Visualizer
                audio={streamRef.current}
                mode="continuous"
                strokeColor={theme.palette.error.main}
                autoStart
              >
                {({ canvasRef }) => (
                  <canvas ref={canvasRef} width={200} height={28} style={{ display: 'block' }} />
                )}
              </Visualizer>
            )}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'error.main',
                animation: `${pulse} 1.2s ease-in-out infinite`,
              }}
            />
            <Typography
              variant="caption"
              color="error"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            >
              Listening…
            </Typography>
          </Box>

          {/* Cancel + Accept side by side */}
          <IconButton
            onClick={cancelRecording}
            size="small"
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'error.main',
              color: '#fff',
              '&:hover': { bgcolor: 'error.dark' },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <IconButton
            onClick={acceptRecording}
            size="small"
            sx={{
              width: 38,
              height: 38,
              bgcolor: 'success.main',
              color: '#fff',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            <CheckIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      ) : (
        /* ------- Normal Mode: text input + send + mic ------- */
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

            {/* Microphone Button — right of send */}
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
