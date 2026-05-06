"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle, ImagePlus } from "lucide-react";
import { useApi } from "@/hook/useApi";
import FileUpload from "@/components/admin/common/FileUpload";

interface SliderFormData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  mobileImageUrl: string;
  buttonText: string;
  isActive: boolean;
}

export default function CreateSliderPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SliderFormData>({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    mobileImageUrl: "",
    buttonText: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Partial<SliderFormData>>({});
  const [uploadError, setUploadError] = useState<string>("");
  const [mobileUploadError, setMobileUploadError] = useState<string>("");

  // Create slider API hook
  const {
    execute: createSlider,
    loading,
    error: apiError,
    data: responseData,
  } = useApi("/api/v1/sliders", "POST", {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/application/shop/admin/slider");
      }, 1500);
    },
  });

  const validateForm = (): boolean => {
    const errors: Partial<SliderFormData> = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (!formData.imageUrl) {
      errors.imageUrl = "Desktop image is required";
    }
    
    if (formData.buttonText && formData.buttonText.length > 50) {
      errors.buttonText = "Button text must not exceed 50 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDesktopUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setUploadError("");
    setFormErrors((prev) => ({ ...prev, imageUrl: undefined }));
  };

  const handleDesktopUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleDesktopUploadRemove = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleMobileUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, mobileImageUrl: url }));
    setMobileUploadError("");
  };

  const handleMobileUploadError = (error: string) => {
    setMobileUploadError(error);
  };

  const handleMobileUploadRemove = () => {
    setFormData((prev) => ({ ...prev, mobileImageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim() || null,
      description: formData.description.trim() || null,
      imageUrl: formData.imageUrl,
      mobileImageUrl: formData.mobileImageUrl || null,
      buttonText: formData.buttonText.trim() || null,
      isActive: formData.isActive,
      sortOrder: 0, // Will be auto-assigned by backend
    };

    await createSlider({
      data: payload,
    });
  };

  const errorMessage = uploadError || mobileUploadError || apiError?.message;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/application/shop/admin/sliders"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Slider</h1>
            <p className="text-gray-600 mt-1">Add a new slider to your homepage</p>
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
              Slider created successfully! Redirecting...
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (formErrors.title) {
                  setFormErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="e.g., Summer Sale, New Arrivals"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.title ? "border-red-300" : "border-gray-300"
              }`}
              maxLength={100}
              required
              disabled={loading}
            />
            {formErrors.title && (
              <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Main heading for your slider (max 100 characters)
            </p>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
              }
              placeholder="e.g., Up to 50% off on selected items"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={255}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Secondary text for your slider (max 255 characters)
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description of the promotion or slide content..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional description (max 500 characters)
            </p>
          </div>

          {/* Button Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, buttonText: e.target.value }))
              }
              placeholder="e.g., Shop Now, Learn More"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                formErrors.buttonText ? "border-red-300" : "border-gray-300"
              }`}
              maxLength={50}
              disabled={loading}
            />
            {formErrors.buttonText && (
              <p className="text-xs text-red-500 mt-1">{formErrors.buttonText}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Text for the call-to-action button (optional, max 50 characters)
            </p>
          </div>

          {/* Desktop Image Upload */}
          <FileUpload
            label="Desktop Image"
            required
            value={formData.imageUrl}
            onUploadSuccess={handleDesktopUploadSuccess}
            onUploadError={handleDesktopUploadError}
            onRemove={handleDesktopUploadRemove}
            disabled={loading}
            maxSize={2}
          />

          {/* Mobile Image Upload */}
          <FileUpload
            label="Mobile Image"
            required={false}
            value={formData.mobileImageUrl}
            onUploadSuccess={handleMobileUploadSuccess}
            onUploadError={handleMobileUploadError}
            onRemove={handleMobileUploadRemove}
            disabled={loading}
            maxSize={1}
          />

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                  disabled={loading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-sm text-gray-600">
                {formData.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Inactive sliders won't be displayed on the homepage
            </p>
          </div>

          {/* Preview Section */}
          {formData.imageUrl && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                Slider Preview
              </h3>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={formData.imageUrl}
                  alt={formData.title || "Slider preview"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder-image.png";
                  }}
                />
                {(formData.title || formData.subtitle || formData.buttonText) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent p-8 flex flex-col justify-center">
                    {formData.subtitle && (
                      <span className="text-white/90 text-sm font-medium mb-2">
                        {formData.subtitle}
                      </span>
                    )}
                    {formData.title && (
                      <h2 className="text-white text-3xl font-bold mb-4">
                        {formData.title}
                      </h2>
                    )}
                    {formData.buttonText && (
                      <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors self-start">
                        {formData.buttonText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !formData.imageUrl}
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
                  Create Slider
                </>
              )}
            </button>
            <Link
              href="/application/shop/admin/slider"
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