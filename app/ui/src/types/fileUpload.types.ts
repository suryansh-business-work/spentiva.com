export type FileUploadStatus = 'pending' | 'uploading' | 'uploaded' | 'error';

export interface UploadedFileName {
  actual: string;
  uploadedName: string;
}

export interface UploadedFilePath {
  filePath: string;
  fileUrl: string;
  thumbnailUrl?: string;
}

export interface UploadedFileData {
  fileId: string;
  size: number;
  fileName: UploadedFileName;
  filePath: UploadedFilePath;
  fileType: string;
}

export interface FileUploadResponse {
  message: string;
  data: UploadedFileData[];
  status: string;
  statusCode: number;
}
