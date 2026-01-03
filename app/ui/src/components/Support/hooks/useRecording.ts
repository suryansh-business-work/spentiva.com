import { useRef, useState, useCallback } from 'react';

interface UseRecordingReturn {
  recording: boolean;
  recordingTime: number;
  startRecording: (
    onMinimize: () => void,
    onAddAttachment: (file: File, type: 'video', preview: string) => void
  ) => Promise<void>;
  stopRecording: () => void;
}

export const useRecording = (): UseRecordingReturn => {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = useCallback(
    async (
      onMinimize: () => void,
      onAddAttachment: (file: File, type: 'video', preview: string) => void
    ) => {
      onMinimize();
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: 'window' } as any,
          audio: true,
          preferCurrentTab: true,
        } as any);

        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
        chunksRef.current = [];
        setRecordingTime(0);

        timerRef.current = window.setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        mediaRecorderRef.current.ondataavailable = e => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' });
          onAddAttachment(file, 'video', URL.createObjectURL(blob));
          stream.getTracks().forEach(track => track.stop());
          if (timerRef.current) clearInterval(timerRef.current);
          setRecording(false);
          setRecordingTime(0);
        };

        mediaRecorderRef.current.start();
        setRecording(true);
      } catch (err) {
        console.error('Recording failed:', err);
        setRecording(false);
      }
    },
    []
  );

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

  return {
    recording,
    recordingTime,
    startRecording,
    stopRecording,
  };
};
