import React from 'react';
import { Formik, Form } from 'formik';
import { Button, TextField, MenuItem, Box, Stack, Typography } from '@mui/material';
import { supportFormSchema, initialFormValues, SupportFormValues } from './validationSchema';
import AttachmentGrid, { Attachment } from './AttachmentGrid';
import RecordingControls from './RecordingControls';
import UploadInstructions from './UploadInstructions';
import UploadedPathsDisplay from './UploadedPathsDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { SupportTicket } from '../../types/support';

interface SupportFormProps {
  recording: boolean;
  onStartRecording: () => void;
  onMinimize: () => void;
  onClose: () => void;
  attachments: Attachment[];
  onAddAttachment: (file: File, type: Attachment['type'], preview?: string) => void;
  onDeleteAttachment: (id: string) => void;
  onPreviewAttachment: (attachment: Attachment) => void;
  onUploadAttachment: (id: string) => void;
  mode?: 'create' | 'view' | 'update';
  ticket?: SupportTicket | null;
}

const supportTypes = {
  payment: 'Payment Related',
  bug: 'Bug In App',
  dataloss: 'Data Loss',
  other: 'Other',
};

const SupportForm: React.FC<SupportFormProps> = ({
  recording,
  onStartRecording,
  onMinimize,
  onClose,
  attachments,
  onAddAttachment,
  onDeleteAttachment,
  onPreviewAttachment,
  onUploadAttachment,
  mode = 'create',
  ticket = null,
}) => {
  const { user, isAuthenticated, token } = useAuth();

  // Pre-populate form if viewing/editing ticket
  const getInitialValues = () => {
    if ((mode === 'view' || mode === 'update') && ticket) {
      const typeReverseMap: Record<string, string> = {
        PaymentRelated: 'payment',
        BugInApp: 'bug',
        DataLoss: 'dataloss',
        Other: 'other',
      };

      return {
        supportType: typeReverseMap[ticket.type] || 'other',
        subject: ticket.subject,
        message: ticket.description,
      };
    }
    return initialFormValues;
  };

  const allFilesUploaded = () => {
    if (attachments.length === 0) return true;
    return attachments.every(a => a.uploadStatus === 'uploaded');
  };

  const getCounts = () => ({
    images: attachments.filter(a => a.type === 'image').length,
    screenshots: attachments.filter(a => a.type === 'screenshot').length,
    videos: attachments.filter(a => a.type === 'video').length,
  });

  const handleDelete = async () => {
    if (!ticket) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ticket ${ticket.ticketId}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      console.log(`support:delete:${ticket.ticketId}`);
      const { deleteTicket } = await import('../../services/supportService');
      await deleteTicket(ticket.ticketId);
      alert('✅ Ticket deleted successfully!');
      onClose();
    } catch (error: any) {
      console.error('Failed to delete ticket:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete ticket';
      alert(`❌ ${errorMessage}`);
    }
  };

  const handleSubmit = async (values: SupportFormValues, { resetForm, setSubmitting }: any) => {
    try {
      setSubmitting(true);

      // Check authentication
      if (!isAuthenticated || !token) {
        alert('❌ You must be logged in to submit a support ticket. Please log in and try again.');
        return;
      }

      // Verify token exists in localStorage
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('❌ Authentication token not found. Please log in again.');
        return;
      }

      console.log('🔐 Auth Status:', {
        isAuthenticated,
        hasToken: !!token,
        hasLocalToken: !!authToken,
        user: user?.email,
      });

      // Map frontend type to backend type
      const typeMap: Record<string, 'PaymentRelated' | 'BugInApp' | 'DataLoss' | 'Other'> = {
        payment: 'PaymentRelated',
        bug: 'BugInApp',
        dataloss: 'DataLoss',
        other: 'Other',
      };

      // Prepare attachment paths
      const attachmentPaths = attachments
        .filter(a => a.uploadedData)
        .map(a => ({
          fileId: a.uploadedData!.fileId,
          filePath: a.uploadedData!.filePath.filePath,
          fileName: a.uploadedData!.fileName.uploadedName,
          fileUrl: a.uploadedData!.filePath.fileUrl,
        }));

      // Prepare payload
      const payload = {
        type: typeMap[values.supportType],
        subject: values.subject,
        description: values.message,
        attachments: attachmentPaths,
      };

      console.log('📤 Submitting ticket with attachments:', {
        totalAttachments: attachments.length,
        uploadedAttachments: attachmentPaths.length,
        attachmentDetails: attachmentPaths,
        payload,
      });

      // Create ticket via API
      await import('../../services/supportService').then(service =>
        service.createSupportTicket(payload)
      );

      // Success feedback
      alert('✅ Support ticket submitted successfully! Our team will review it soon.');

      // Reset form
      resetForm();
      onClose();
    } catch (error: any) {
      console.error('Failed to submit ticket:', error);
      const errorMessage =
        error?.response?.data?.message || 'Failed to submit ticket. Please try again.';
      alert(`❌ ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={supportFormSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      enableReinitialize={true}
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
        <Form style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
          <Box sx={{ pt: 2.5, px: 2.5, pb: 2.5, overflowY: 'auto', flex: 1 }}>
            <Stack spacing={2.5}>
              {(mode === 'view' || mode === 'update') && ticket && (
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Ticket ID
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {ticket.ticketId}
                  </Typography>
                </Box>
              )}

              <TextField
                select
                name="supportType"
                label="Issue Type *"
                value={values.supportType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.supportType && Boolean(errors.supportType)}
                helperText={touched.supportType && errors.supportType}
                fullWidth
                size="small"
                disabled={mode === 'view'}
              >
                {Object.entries(supportTypes).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="subject"
                label="Subject *"
                value={values.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.subject && Boolean(errors.subject)}
                helperText={touched.subject && errors.subject}
                fullWidth
                size="small"
                placeholder="Brief description of the issue"
                disabled={mode === 'view'}
              />

              <TextField
                name="message"
                label="Message *"
                value={values.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                multiline
                rows={4}
                fullWidth
                size="small"
                placeholder="Detailed explanation with steps to reproduce..."
                disabled={mode === 'view'}
              />

              <UploadInstructions
                hasAttachments={attachments.length > 0}
                allUploaded={allFilesUploaded()}
              />

              <AttachmentGrid
                attachments={attachments}
                onPreview={onPreviewAttachment}
                onDelete={onDeleteAttachment}
                onUpload={onUploadAttachment}
              />

              <UploadedPathsDisplay attachments={attachments} />
            </Stack>
          </Box>

          <Box
            sx={{
              px: 2.5,
              pb: 2,
              pt: 1.5,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <RecordingControls
              onAddAttachment={onAddAttachment}
              counts={getCounts()}
              maxPerType={5}
              onMinimize={onMinimize}
              onStartRecording={onStartRecording}
              recording={recording}
              recordingTime={0}
            />
            <Box sx={{ flex: 1 }} />

            {(mode === 'view' || mode === 'update') && (
              <Button onClick={handleDelete} variant="outlined" color="error">
                Delete Ticket
              </Button>
            )}

            <Button onClick={onClose} variant="outlined">
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>

            {mode !== 'view' && (
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || !dirty || isSubmitting || !allFilesUploaded()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            )}
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SupportForm;
