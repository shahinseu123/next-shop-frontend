"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  onRemove?: () => void;
  value?: string;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  onRemove,
  value = "",
  accept = "image/*",
  maxSize = 2,
  label = "Upload Image",
  required = false,
  disabled = false,
  className = "",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string>(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      const msg = "Please upload an image file";
      setError(msg);
      onUploadError?.(msg);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      const msg = `File size should be less than ${maxSize}MB`;
      setError(msg);
      onUploadError?.(msg);
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setError("");
    setUploading(true);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
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
      const fileUrl = data.url || data.fullUrl || "";

      if (fileUrl) {
        onUploadSuccess(fileUrl);
      } else {
        throw new Error("Upload succeeded but no URL returned");
      }
    } catch (err: any) {
      const msg = err.message || "Network error occurred";
      setError(msg);
      setPreview("");
      onUploadError?.(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-blue-500"
        } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          /* Preview Mode */
          <div className="relative">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Remove Button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Uploading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          /* Upload Prompt */
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${
                  disabled || uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <span>{uploading ? "Uploading..." : "Upload an image"}</span>
                <input
                  ref={inputRef}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleInputChange}
                  disabled={disabled || uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}