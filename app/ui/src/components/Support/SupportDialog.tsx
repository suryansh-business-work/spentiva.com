import React, { useState, useRef } from 'react';
import { Paper, Fade, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Draggable from 'react-draggable';
import SupportDialogHeader from './SupportDialogHeader';
import SupportForm from './SupportForm';
import AttachmentPreview from './AttachmentPreview';
import { Attachment } from './AttachmentGrid';
import { useRecording } from './hooks/useRecording';
import { useFileUpload } from './hooks/useFileUpload';

import { SupportTicket } from './../../types/support';
import TicketTimeline from './TicketTimeline';
import { getTicketById } from '../../services/supportService';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
  mode?: 'create' | 'view' | 'update';
  ticketId?: string;
}

const SupportDialog: React.FC<SupportDialogProps> = ({
  open,
  onClose,
  mode = 'create',
  ticketId,
}) => {
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { recording, recordingTime, startRecording, stopRecording } = useRecording();
  const { uploadFile } = useFileUpload();

  // Reset hidden state when opened
  React.useEffect(() => {
    if (open) setHidden(false);
  }, [open]);

  // Load ticket data when in view/update mode
  React.useEffect(() => {
    const loadTicket = async () => {
      if ((mode === 'view' || mode === 'update') && ticketId && open) {
        try {
          setIsLoadingTicket(true);
          const ticketData = await getTicketById(ticketId);
          setTicket(ticketData);
          console.log(`support:${mode}:${ticketId}`);
        } catch (error) {
          console.error('Failed to load ticket:', error);
          alert('Failed to load ticket data');
        } finally {
          setIsLoadingTicket(false);
        }
      } else if (mode === 'create') {
        setTicket(null);
        setAttachments([]);
      }
    };

    loadTicket();
  }, [mode, ticketId, open]);

  const handleAddAttachment = (file: File, type: Attachment['type'], preview?: string) => {
    const newAttachment: Attachment = {
      id: Math.random().toString(36),
      file,
      type,
      preview,
      uploadStatus: 'pending',
    };
    setAttachments(prev => [...prev, newAttachment]);

    // Auto-expand dialog after adding screenshot/recording
    setMinimized(false);
  };

  const handleUploadAttachment = async (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (!attachment) return;

    // Set uploading status with initial progress
    setAttachments(prev =>
      prev.map(a =>
        a.id === id ? { ...a, uploadStatus: 'uploading' as const, uploadProgress: 0 } : a
      )
    );

    try {
      const uploadedData = await uploadFile(attachment.file, progress => {
        // Update progress in real-time
        console.log('Progress callback received:', progress);
        setAttachments(prev =>
          prev.map(a => (a.id === id ? { ...a, uploadProgress: progress } : a))
        );
      });

      if (uploadedData) {
        // Set uploaded status with complete data
        setAttachments(prev =>
          prev.map(a =>
            a.id === id
              ? { ...a, uploadStatus: 'uploaded' as const, uploadedData, uploadProgress: 100 }
              : a
          )
        );
      } else {
        // Set error status
        setAttachments(prev =>
          prev.map(a =>
            a.id === id ? { ...a, uploadStatus: 'error' as const, uploadError: 'Upload failed' } : a
          )
        );
      }
    } catch (error) {
      // Set error status
      setAttachments(prev =>
        prev.map(a =>
          a.id === id ? { ...a, uploadStatus: 'error' as const, uploadError: 'Upload failed' } : a
        )
      );
    }
  };

  const handleStartRecording = async () => {
    await startRecording(() => setMinimized(true), handleAddAttachment);
  };

  const handleUpdateAdded = (updates: any[]) => {
    if (ticket) {
      setTicket({ ...ticket, updates });
    }
  };

  if (!open || hidden) return null;

  return (
    <>
      <Draggable nodeRef={draggableRef} handle="#draggable-dialog-title" disabled={minimized || isMobile}>
        <Paper
          ref={draggableRef}
          elevation={0}
          sx={{
            position: 'fixed',
            zIndex: 1300,
            boxShadow: minimized
              ? '0px 4px 12px rgba(0, 0, 0, 0.15)'
              : '0px 24px 48px rgba(0, 0, 0, 0.2)',
            ...(minimized
              ? {
                  bottom: 16,
                  right: 16,
                  width: recording ? 400 : 320,
                  height: 56,
                  overflow: 'hidden',
                }
              : isMobile
                ? {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxHeight: '90dvh',
                    display: 'flex',
                    flexDirection: 'column',
                  }
                : {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: 900,
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                  }),
          }}
        >
          <SupportDialogHeader
            recording={recording}
            recordingTime={recordingTime}
            minimized={minimized}
            onMinimize={() => setMinimized(!minimized)}
            onStopRecording={stopRecording}
            onClose={() => {
              // Hide instead of destroying — preserves dialog state
              setMinimized(true);
              setHidden(true);
            }}
          />

          <Fade in={!minimized}>
            <Box
              sx={{
                display: minimized ? 'none' : 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                flex: 1,
              }}
            >
              {isLoadingTicket ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>Loading ticket...</Typography>
                </Box>
              ) : (
                <>
                  <SupportForm
                    recording={recording}
                    onStartRecording={handleStartRecording}
                    onMinimize={() => setMinimized(true)}
                    onClose={onClose}
                    attachments={attachments}
                    onAddAttachment={handleAddAttachment}
                    onDeleteAttachment={id => setAttachments(prev => prev.filter(a => a.id !== id))}
                    onPreviewAttachment={setPreviewAttachment}
                    onUploadAttachment={handleUploadAttachment}
                    mode={mode}
                    ticket={ticket}
                  />

                  {(mode === 'view' || mode === 'update') && ticket && ticket.updates && (
                    <Box
                      sx={{
                        p: 2.5,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.default',
                      }}
                    >
                      <TicketTimeline
                        ticketId={ticket.ticketId}
                        updates={ticket.updates}
                        onUpdateAdded={handleUpdateAdded}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Paper>
      </Draggable>

      <AttachmentPreview
        open={!!previewAttachment}
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </>
  );
};

export default SupportDialog;
