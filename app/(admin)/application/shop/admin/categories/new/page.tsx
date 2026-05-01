"use client";
import { useState, use, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, AlertCircle } from "lucide-react";
import { useApi } from "@/hook/useApi";
import FileUpload from "@/components/admin/common/FileUpload";
import { Pretty } from "@/components/utility/Pretty";

interface CategoryFormData {
  name: string;
  parentId: number | null;
  imageUrl: string;
}

export default function CreateCategoryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    parentId: null,
    imageUrl: "",
  });
  const [uploadError, setUploadError] = useState<string>("");

  const {
    execute: createCategory,
    loading,
    error: apiError,
    data: responseData,
  } = useApi("/api/v1/categories", "POST", {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/application/shop/admin/categories");
      }, 1500);
    },
  });
  const {
    execute: getCategoryList,
    loading: categoryListLoading,
    error: fetchError,
    data: categoryList,
  } = useApi("/api/v1/categories/list", "GET", {
    onSuccess: () => {},
  });

  const categoryListOptions = useMemo(
    () =>
      (categoryList || []).map((category: any) => ({
        id: category.id,
        name: category.name,
      })),
    [categoryList],
  );

  useEffect(() => {
    getCategoryList();
  }, []);

  const handleUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setUploadError("");
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleUploadRemove = () => {
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setUploadError("Category name is required");
      return;
    }

    if (!formData.imageUrl) {
      setUploadError("Please upload a category image");
      return;
    }

    await createCategory({
      data: {
        name: formData.name.trim(),
        parentId: formData.parentId,
        imageUrl: formData.imageUrl,
      },
    });
  };

  const errorMessage = uploadError || apiError?.message;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/application/shop/admin/categories"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Category
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new category to your store
            </p>
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
              Category created successfully! Redirecting...
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Electronics, Clothing, Books"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed on the store (slug will be auto-generated)
            </p>
          </div>
          <div>
            <select
              name="parentId"
              id="parentId"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, parentId: e.target.value as unknown as number }))
              }
              className=" border border-gray-300 p-2 w-full rounded-lg"
            >
              <option value="">Select Parent Category</option>
              {categoryListOptions &&
                categoryListOptions.length &&
                categoryListOptions.map((item: any) => {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* File Upload */}
          <FileUpload
            label="Category Image"
            required
            value={formData.imageUrl}
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
              disabled={loading || !formData.imageUrl}
              className="flex-1 transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500    py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800  disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Category
                </>
              )}
            </button>
            <Link
              href="/application/shop/admin/categories"
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
