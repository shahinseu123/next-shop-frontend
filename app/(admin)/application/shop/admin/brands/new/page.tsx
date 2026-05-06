"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useApi } from "@/hook/useApi";
import FileUpload from "@/components/admin/common/FileUpload";

interface BrandFormData {
  name: string;
  logoUrl: string;
  active: string;
}

export default function CreateBrandPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BrandFormData>({
    name: "",
    logoUrl: "",
    active: "ACTIVE",
  });
  const [uploadError, setUploadError] = useState<string>("");

  // Create brand API hook
  const {
    execute: createBrand,
    loading,
    error: apiError,
    data: responseData,
  } = useApi("/api/v1/brands", "POST", {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/application/shop/admin/brands");
      }, 1500);
    },
  });

  const handleUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, logoUrl: url }));
    setUploadError("");
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleUploadRemove = () => {
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setUploadError("Brand name is required");
      return;
    }

    if (!formData.logoUrl) {
      setUploadError("Please upload a brand logo");
      return;
    }

    await createBrand({
      data: {
        name: formData.name.trim(),
        logoUrl: formData.logoUrl,
        active: formData.active,
      },
    });
  };

  const errorMessage = uploadError || apiError?.message;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/application/shop/admin/brands"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Brand</h1>
            <p className="text-gray-600 mt-1">Add a new brand to your store</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {responseData && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-700">
              Brand created successfully! Redirecting...
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Nike, Apple, Samsung"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed on the store (slug will be auto-generated)
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="active"
              value={formData.active}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, active: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Inactive brands won't be visible on the store
            </p>
          </div>

          {/* Logo Upload */}
          <FileUpload
            label="Brand Logo"
            required
            value={formData.logoUrl}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            onRemove={handleUploadRemove}
            disabled={loading}
            maxSize={2}
          />

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !formData.logoUrl}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Brand
                </>
              )}
            </button>
            <Link
              href="/application/shop/admin/brands"
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-200 transition-colors text-center font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}