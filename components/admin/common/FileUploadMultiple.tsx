"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle, FileImage, Loader2 } from "lucide-react";

interface UploadFile {
  id: string;
  file: File;
  preview: string;
  url?: string;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface MultipleFileUploadProps {
  onUploadSuccess: (urls: string[]) => void;
  onUploadError?: (error: string, failedFiles?: UploadFile[]) => void;
  onRemove?: (removedUrls: string[]) => void;
  value?: string[]; // Array of existing image URLs
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number; // Maximum number of files allowed
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FileUploadMultiple({
  onUploadSuccess,
  onUploadError,
  onRemove,
  value = [],
  accept = "image/*",
  maxSize = 2,
  maxFiles = 10,
  label = "Upload Images",
  required = false,
  disabled = false,
  className = "",
}: MultipleFileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>(() =>
    value.map((url, index) => ({
      id: `existing-${index}`,
      file: null as any,
      preview: url,
      url,
      status: "success",
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file";
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size should be less than ${maxSize}MB`;
    }
    return null;
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const currentCount = files.length;
    const remainingSlots = maxFiles - currentCount;

    if (remainingSlots <= 0) {
      const msg = `Maximum ${maxFiles} files allowed`;
      onUploadError?.(msg);
      return;
    }

    const filesToAdd = fileArray.slice(0, remainingSlots);
    const newUploadFiles: UploadFile[] = [];

    for (const file of filesToAdd) {
      const error = validateFile(file);
      const previewUrl = URL.createObjectURL(file);

      newUploadFiles.push({
        id: `file-${Date.now()}-${Math.random()}`,
        file,
        preview: previewUrl,
        status: error ? "error" : "pending",
        error: error || undefined,
      });
    }

    setFiles((prev) => [...prev, ...newUploadFiles]);

    // Auto-upload valid files
    const validFiles = newUploadFiles.filter((f) => f.status === "pending");
    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadFiles = async (filesToUpload: UploadFile[]) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const token = localStorage.getItem("access_token");

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        filesToUpload.some((uf) => uf.id === f.id)
          ? { ...f, status: "uploading" }
          : f
      )
    );

    try {
      const formData = new FormData();
      filesToUpload.forEach((fileObj) => {
        if (fileObj.file) {
          formData.append("files", fileObj.file);
        }
      });

      const response = await fetch(`${apiBaseUrl}/upload/bulk`, {
        method: "POST",
        body: formData,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      // Assuming the response returns an array of URLs
      const uploadedUrls = data.urls || data.files || data.data || [];

      if (uploadedUrls.length === filesToUpload.length) {
        // All files uploaded successfully
        setFiles((prev) =>
          prev.map((f) => {
            const uploadedFile = filesToUpload.find((uf) => uf.id === f.id);
            if (uploadedFile) {
              const index = filesToUpload.findIndex((uf) => uf.id === f.id);
              return {
                ...f,
                status: "success",
                url: uploadedUrls[index],
              };
            }
            return f;
          })
        );

        const allUrls = [
          ...files.filter((f) => f.status === "success" && f.url).map((f) => f.url!),
          ...uploadedUrls,
        ];
        onUploadSuccess(allUrls);
      } else {
        // Partial success - need to match which files failed
        setFiles((prev) =>
          prev.map((f) => {
            const uploadedFile = filesToUpload.find((uf) => uf.id === f.id);
            if (uploadedFile) {
              const index = filesToUpload.findIndex((uf) => uf.id === f.id);
              if (index < uploadedUrls.length) {
                return { ...f, status: "success", url: uploadedUrls[index] };
              } else {
                return {
                  ...f,
                  status: "error",
                  error: "Upload failed - server didn't return URL",
                };
              }
            }
            return f;
          })
        );

        const successfulUrls = [
          ...files.filter((f) => f.status === "success" && f.url && !filesToUpload.some((uf) => uf.id === f.id)).map((f) => f.url!),
          ...uploadedUrls,
        ];
        onUploadSuccess(successfulUrls);
        
        const failedFiles = files.filter(
          (f) => filesToUpload.some((uf) => uf.id === f.id) && f.status === "error"
        );
        if (failedFiles.length > 0 && onUploadError) {
          onUploadError("Some files failed to upload", failedFiles);
        }
      }
    } catch (err: any) {
      const msg = err.message || "Network error occurred";
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uf) => uf.id === f.id)
            ? { ...f, status: "error", error: msg }
            : f
        )
      );
      onUploadError?.(msg);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove?.url) {
      onRemove?.([fileToRemove.url]);
    }
    // Clean up preview URL
    if (fileToRemove?.preview && fileToRemove.preview.startsWith("blob:")) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    
    // Notify parent of remaining successful URLs
    const remainingUrls = files
      .filter((f) => f.id !== fileId && f.status === "success" && f.url)
      .map((f) => f.url!);
    onUploadSuccess(remainingUrls);
  };

  const handleRetry = (fileId: string) => {
    const fileToRetry = files.find((f) => f.id === fileId);
    if (fileToRetry && fileToRetry.file) {
      uploadFiles([fileToRetry]);
    }
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {maxFiles && (
            <span className="text-xs text-gray-500 ml-2">
              (Max {maxFiles} files)
            </span>
          )}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="multiple-file-upload"
              className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${
                disabled || uploading || files.length >= maxFiles
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span>Upload images</span>
              <input
                ref={inputRef}
                id="multiple-file-upload"
                name="multiple-file-upload"
                type="file"
                className="sr-only"
                accept={accept}
                multiple
                onChange={handleInputChange}
                disabled={disabled || uploading || files.length >= maxFiles}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to {maxSize}MB each (max {maxFiles} files)
          </p>
          {files.length >= maxFiles && (
            <p className="text-xs text-amber-600 mt-1">
              Maximum {maxFiles} files reached
            </p>
          )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`relative group rounded-lg overflow-hidden border ${
                file.status === "error"
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Image Preview */}
              <div className="relative aspect-square">
                <Image
                  src={file.preview}
                  alt={file.file?.name || "Uploaded image"}
                  fill
                  className="object-cover"
                />
                
                {/* Status Overlay */}
                {file.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}

                {file.status === "error" && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 shadow-lg">
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 truncate">
                    <FileImage className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate">
                      {file.file?.name || "Image"}
                    </span>
                  </div>
                  {getStatusIcon(file.status)}
                </div>
                
                {/* Error Message */}
                {file.error && (
                  <p className="text-xs text-red-600 mt-1 truncate">
                    {file.error}
                  </p>
                )}
              </div>

              {/* Remove Button */}
              {!disabled && file.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Retry Button for Failed Uploads */}
              {file.status === "error" && file.file && (
                <button
                  type="button"
                  onClick={() => handleRetry(file.id)}
                  className="absolute bottom-1 right-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                >
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}