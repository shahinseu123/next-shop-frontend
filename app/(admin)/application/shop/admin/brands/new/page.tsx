"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Upload, X, Check, AlertCircle } from "lucide-react";
import { useApi } from "@/hook/useApi";
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  // Use the useApi hook for brand creation
  const { 
    execute: createBrand, 
    loading, 
    error: apiError,
    data: responseData 
  } = useApi('/api/brands', 'POST', {
    onSuccess: () => {
      // Redirect after successful creation
      setTimeout(() => {
        router.push("/application/shop/admin/brands");
      }, 1500);
    }
  });

  // Use the useApi hook for image upload
  const { 
    execute: uploadImage, 
    loading: uploading 
  } = useApi('/upload', 'POST', {
    requiresAuth: true,
    onSuccess: (data) => {
      // When upload succeeds, set the logoUrl from response
      const imageUrl = data.url || data.fullUrl;
      if (imageUrl) {
        setFormData(prev => ({ ...prev, logoUrl: imageUrl }));
        setUploadError("");
      }
    },
    onError: (error) => {
      setUploadError(error.message || "Failed to upload image");
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File size should be less than 2MB");
      return;
    }

    // Preview the image
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setLogoFile(file);
    setUploadError("");

    // Upload the image immediately
    const formData = new FormData();
    formData.append("file", file);
    
    await uploadImage({
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      setUploadError("Brand name is required");
      return;
    }

    // Check if logo was uploaded
    if (!formData.logoUrl && !logoFile) {
      setUploadError("Please upload a brand logo");
      return;
    }

    // Prepare brand data (backend will generate slug automatically)
    const brandData = {
      name: formData.name.trim(),
      logoUrl: formData.logoUrl,
      active: formData.active,
    };

    // Create brand using useApi hook
    await createBrand({ data: brandData });
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
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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
            <span className="text-green-700">Brand created successfully! Redirecting...</span>
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
              onChange={handleInputChange}
              placeholder="e.g., Nike, Apple, Samsung"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">This will be displayed on the store (slug will be auto-generated)</p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Logo <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors">
              {logoPreview ? (
                <div className="relative">
                  <div className="relative w-32 h-32 mx-auto">
                    <Image
                      src={logoPreview}
                      alt="Brand logo preview"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    disabled={loading || uploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="logo-upload"
                      className={`relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none ${(loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span>{uploading ? "Uploading..." : "Upload a logo"}</span>
                      <input
                        id="logo-upload"
                        name="logo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={loading || uploading}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="active"
              value={formData.active}
              onChange={handleInputChange}
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

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || uploading || !formData.logoUrl}
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