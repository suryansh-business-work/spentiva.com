import React from 'react';
import { Box, Typography, Stack, Link, Divider } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import { Attachment } from './AttachmentGrid';

interface UploadedPathsDisplayProps {
  attachments: Attachment[];
}

const UploadedPathsDisplay: React.FC<UploadedPathsDisplayProps> = ({ attachments }) => {
  const uploadedAttachments = attachments.filter(
    a => a.uploadStatus === 'uploaded' && a.uploadedData
  );

  if (uploadedAttachments.length === 0) return null;

  // Group by type
  const groupedByType = {
    image: uploadedAttachments.filter(a => a.type === 'image'),
    screenshot: uploadedAttachments.filter(a => a.type === 'screenshot'),
    video: uploadedAttachments.filter(a => a.type === 'video'),
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      image: 'Image Attachment',
      screenshot: 'Screenshot Attachment',
      video: 'Video Attachment',
    };
    return labels[type] || type;
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        display="block"
        mb={1.5}
      >
        Uploaded Files ({uploadedAttachments.length})
      </Typography>
      <Stack spacing={1.5} divider={<Divider />}>
        {Object.entries(groupedByType).map(([type, items]) => {
          if (items.length === 0) return null;
          return (
            <Box key={type}>
              <Typography variant="caption" color="primary" fontWeight={600} display="block" mb={1}>
                {getTypeLabel(type)}s ({items.length}):
              </Typography>
              <Stack spacing={0.75}>
                {items.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      pl: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 20 }}>
                      {index + 1}.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.uploadedData!.fileName.uploadedName}
                    </Typography>
                    <Link
                      href={item.uploadedData!.filePath.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.7rem',
                        textDecoration: 'none',
                      }}
                    >
                      <OpenInNewIcon sx={{ fontSize: 14 }} />
                      View
                    </Link>
                    <Link
                      href={item.uploadedData!.filePath.fileUrl}
                      download={item.uploadedData!.fileName.actual}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '0.7rem',
                        textDecoration: 'none',
                      }}
                    >
                      <DownloadIcon sx={{ fontSize: 14 }} />
                      Download
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default UploadedPathsDisplay;
