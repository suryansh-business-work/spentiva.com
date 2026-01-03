import React from 'react';
import { Typography, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploadInstructionsProps {
  hasAttachments: boolean;
  allUploaded: boolean;
}

const UploadInstructions: React.FC<UploadInstructionsProps> = ({ hasAttachments, allUploaded }) => {
  if (!hasAttachments || allUploaded) return null;

  return (
    <Alert
      severity="info"
      icon={<CloudUploadIcon />}
      sx={{
        mb: 2,
        '& .MuiAlert-message': {
          width: '100%',
        },
      }}
    >
      <Typography variant="body2" fontWeight={600} gutterBottom>
        Important: Individual File Upload Required
      </Typography>
      <Typography variant="caption" display="block" sx={{ lineHeight: 1.5 }}>
        Your ticket will only be submitted once you individually upload each attached file by
        clicking the{' '}
        <CloudUploadIcon
          sx={{ fontSize: 14, verticalAlign: 'middle', mx: 0.5, color: 'primary.main' }}
        />
        icon on each attachment. This method helps us save storage space and allows you to verify
        each file upload independently before submission.
      </Typography>
    </Alert>
  );
};

export default UploadInstructions;
