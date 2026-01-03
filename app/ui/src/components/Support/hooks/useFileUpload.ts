import { useState } from 'react';
import { FileUploadResponse, UploadedFileData } from '../../../types/fileUpload.types';
import { endpoints } from '../../../config/api';
import axios from 'axios';

interface UseFileUploadResult {
  uploadFile: (
    file: File,
    onProgress?: (progress: number) => void
  ) => Promise<UploadedFileData | null>;
  uploading: boolean;
  error: string | null;
}

export const useFileUpload = (): UseFileUploadResult => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadedFileData | null> => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');

      const response = await axios.post<FileUploadResponse>(endpoints.imagekit.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        onUploadProgress: progressEvent => {
          console.log('Progress Event:', {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            lengthComputable: progressEvent.lengthComputable,
          });

          if (progressEvent.total && progressEvent.total > 0) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log('Percentage:', percentCompleted);
            onProgress?.(percentCompleted);
          } else {
            // If total is unknown, estimate based on loaded bytes
            console.log('Total unknown, loaded:', progressEvent.loaded);
          }
        },
      });

      if (response.data.status === 'success' && response.data.data.length > 0) {
        return response.data.data[0];
      }

      throw new Error('Upload failed');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to upload file';
      setError(errorMessage);
      console.error('File upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};
