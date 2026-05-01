// hooks/useFileUpload.ts
import { useState, useCallback } from 'react';

interface UploadResponse {
  url?: string;
  fullUrl?: string;
  fileName?: string;
  [key: string]: any;
}

interface UseFileUploadOptions {
  onSuccess?: (data: UploadResponse) => void;
  onError?: (error: Error) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          // Don't set Content-Type — browser handles multipart boundary
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Upload failed with status ${response.status}`);
      }

      const data: UploadResponse = await response.json();
      const fileUrl = data.url || data.fullUrl || null;

      if (fileUrl) {
        setUploadedUrl(fileUrl);
        if (options.onSuccess) {
          options.onSuccess(data);
        }
        return fileUrl;
      } else {
        throw new Error('Upload succeeded but no file URL was returned');
      }

    } catch (err: any) {
      const message = err.message || 'Network error occurred during upload';
      setError(message);
      if (options.onError) {
        options.onError(err);
      }
      return null;
    } finally {
      setUploading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setUploading(false);
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    upload,
    uploading,
    error,
    uploadedUrl,
    reset,
  };
}