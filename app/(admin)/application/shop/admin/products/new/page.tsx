"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FileUploadMultiple from "@/components/admin/common/FileUploadMultiple";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Package,
  DollarSign,
  Image as ImageIcon,
  Search,
  Truck,
  Tag,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useApi } from "@/hook/useApi";
import FileUpload from "@/components/admin/common/FileUpload";

interface ProductFormData {
  name: string;
  shortDescription: string;
  longDescription: string;
  sku: string;
  barcode: string;
  qrCode: string;
  purchasePrice: string;
  sellingPrice: string;
  discountPrice: string;
  discountPercentage: string;
  wholesalePrice: string;
  mrp: string;
  taxPercentage: string;
  shippingCost: string;
  quantityInStock: string;
  minimumStockLevel: string;
  maximumStockLevel: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  weightUnit: string;
  dimensionUnit: string;
  color: string;
  material: string;
  categoryId: string;
  brandId: string;
  imageUrls: string[];
  thumbnailUrl: string;
  videoUrl: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  isActive: string;
  isFeatured: string;
  isNewArrival: string;
  isDigital: string;
  isPublished: string;
  hasVariations: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    shortDescription: "",
    longDescription: "",
    sku: "",
    barcode: "",
    qrCode: "",
    purchasePrice: "",
    sellingPrice: "",
    discountPrice: "",
    discountPercentage: "",
    wholesalePrice: "",
    mrp: "",
    taxPercentage: "",
    shippingCost: "",
    quantityInStock: "0",
    minimumStockLevel: "",
    maximumStockLevel: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    weightUnit: "kg",
    dimensionUnit: "cm",
    color: "",
    material: "",
    categoryId: "",
    brandId: "",
    imageUrls: [],
    thumbnailUrl: "",
    videoUrl: "",
    seoTitle: "",
    seoDescription: "",
    slug: "",
    isActive: "YES",
    isFeatured: "NO",
    isNewArrival: "NO",
    isDigital: "NO",
    isPublished: "NO",
    hasVariations: "NO",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<string>("basic");
  const [uploadError, setUploadError] = useState<string>("");

  // Create product API hook
  const {
    execute: createProduct,
    loading,
    error: apiError,
    data: responseData,
  } = useApi("/api/v1/products", "POST", {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/application/shop/admin/products");
      }, 1500);
    },
  });

  // Fetch categories
  const {
    execute: getCategoryList,
    loading: categoryListLoading,
    data: categoryList,
  } = useApi("/api/v1/categories/list", "GET");

  // Fetch brands
  const {
    execute: getBrandList,
    loading: brandListLoading,
    data: brandList,
  } = useApi("/api/v1/brands/list", "GET");

  const categoryListOptions = useMemo(
    () =>
      (categoryList || []).map((category: any) => ({
        id: category.id,
        name: category.name,
      })),
    [categoryList],
  );

  const brandListOptions = useMemo(
    () =>
      (brandList || []).map((brand: any) => ({
        id: brand.id,
        name: brand.name,
      })),
    [brandList],
  );

  useEffect(() => {
    getCategoryList();
    getBrandList();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field if exists
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleThumbnailSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, thumbnailUrl: url }));
    setUploadError("");
  };

  const handleMultipleImagesSuccess = (urls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: urls,
    }));
    setUploadError("");
    // Clear images error if exists
    if (formErrors.images) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    }
  };

  const handleMultipleImagesRemove = (removedUrls: string[]) => {
    // Filter out the removed URLs from the current imageUrls
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => !removedUrls.includes(url)),
    }));
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const handleUploadRemove = (type: "thumbnail" | "video") => {
    if (type === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Basic Information
    if (!formData.name.trim()) {
      errors.name = "Product name is required";
    }

    if (!formData.sku.trim()) {
      errors.sku = "SKU is required";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required";
    }

    // Pricing
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) < 0) {
      errors.purchasePrice = "Valid purchase price is required";
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      errors.sellingPrice = "Selling price must be greater than 0";
    }

    // Media
    if (formData.imageUrls.length === 0) {
      errors.images = "At least one product image is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Open the first section that has an error
      if (formErrors.name || formErrors.sku || formErrors.categoryId) {
        setActiveSection("basic");
      } else if (formErrors.purchasePrice || formErrors.sellingPrice) {
        setActiveSection("pricing");
      } else if (formErrors.images) {
        setActiveSection("media");
      }
      return;
    }

    const productData = {
      name: formData.name.trim(),
      shortDescription: formData.shortDescription.trim(),
      longDescription: formData.longDescription.trim(),
      sku: formData.sku.trim(),
      barcode: formData.barcode.trim(),
      qrCode: formData.qrCode.trim(),

      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      discountPrice: formData.discountPrice
        ? parseFloat(formData.discountPrice)
        : null,
      discountPercentage: formData.discountPercentage
        ? parseFloat(formData.discountPercentage)
        : null,
      wholesalePrice: formData.wholesalePrice
        ? parseFloat(formData.wholesalePrice)
        : null,
      mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      taxPercentage: formData.taxPercentage
        ? parseFloat(formData.taxPercentage)
        : null,
      shippingCost: formData.shippingCost
        ? parseFloat(formData.shippingCost)
        : null,

      quantityInStock: parseInt(formData.quantityInStock) || 0,
      minimumStockLevel: formData.minimumStockLevel
        ? parseInt(formData.minimumStockLevel)
        : null,
      maximumStockLevel: formData.maximumStockLevel
        ? parseInt(formData.maximumStockLevel)
        : null,

      weight: formData.weight ? parseFloat(formData.weight) : null,
      length: formData.length ? parseFloat(formData.length) : null,
      width: formData.width ? parseFloat(formData.width) : null,
      height: formData.height ? parseFloat(formData.height) : null,
      weightUnit: formData.weightUnit || null,
      dimensionUnit: formData.dimensionUnit || null,
      color: formData.color.trim() || null,
      material: formData.material.trim() || null,

      categoryId: parseInt(formData.categoryId),
      brandId: formData.brandId ? parseInt(formData.brandId) : null,

      imageUrls: formData.imageUrls,
      thumbnailUrl: formData.thumbnailUrl || null,
      videoUrl: formData.videoUrl || null,

      seoTitle: formData.seoTitle.trim() || null,
      seoDescription: formData.seoDescription.trim() || null,
      slug: formData.slug.trim() || null,

      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isDigital: formData.isDigital,
      isPublished: formData.isPublished,
      hasVariations: formData.hasVariations,
    };

    await createProduct({ data: productData });
  };

  const errorMessage = uploadError || apiError?.message;

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? "" : section);
  };

  const sections = [
    {
      id: "basic",
      label: "Basic Information",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: <Package className="w-5 h-5" />,
    },
    { id: "media", label: "Media", icon: <ImageIcon className="w-5 h-5" /> },
    { id: "seo", label: "SEO", icon: <Search className="w-5 h-5" /> },
    {
      id: "physical",
      label: "Physical Attributes",
      icon: <Truck className="w-5 h-5" />,
    },
    { id: "settings", label: "Settings", icon: <Tag className="w-5 h-5" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/application/shop/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Product
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new product to your store
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
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
              Product created successfully! Redirecting...
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Section Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Sections
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                    {activeSection === section.id ? (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content - Form Sections */}
          <div className="lg:col-span-2 space-y-4">
            {/* Basic Information Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "basic" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("basic")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-800">
                    Basic Information
                  </h2>
                </div>
                {activeSection === "basic" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "basic" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g., Wireless Bluetooth Headphones"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) =>
                          handleInputChange("sku", e.target.value)
                        }
                        placeholder="e.g., WH-1000XM4"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.sku ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={loading}
                      />
                      {formErrors.sku && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.sku}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode
                      </label>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) =>
                          handleInputChange("barcode", e.target.value)
                        }
                        placeholder="e.g., 4905524972351"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formData.categoryId}
                          onChange={(e) =>
                            handleInputChange("categoryId", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                            formErrors.categoryId
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={loading || categoryListLoading}
                        >
                          <option value="">
                            {categoryListLoading
                              ? "Loading categories..."
                              : "Select a category"}
                          </option>
                          {categoryListOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {categoryListLoading ? (
                          <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                      {formErrors.categoryId && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.categoryId}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                      </label>
                      <div className="relative">
                        <select
                          value={formData.brandId}
                          onChange={(e) =>
                            handleInputChange("brandId", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                          disabled={loading || brandListLoading}
                        >
                          <option value="">
                            {brandListLoading
                              ? "Loading brands..."
                              : "Select a brand"}
                          </option>
                          {brandListOptions.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                        {brandListLoading ? (
                          <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) =>
                        handleInputChange("shortDescription", e.target.value)
                      }
                      rows={2}
                      placeholder="Brief product description for listings..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.shortDescription.length}/500 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Long Description
                    </label>
                    <textarea
                      value={formData.longDescription}
                      onChange={(e) =>
                        handleInputChange("longDescription", e.target.value)
                      }
                      rows={4}
                      placeholder="Detailed product description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                      maxLength={5000}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.longDescription.length}/5000 characters
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "pricing" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("pricing")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <h2 className="font-semibold text-gray-800">
                    Pricing Information
                  </h2>
                </div>
                {activeSection === "pricing" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "pricing" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.purchasePrice}
                          onChange={(e) =>
                            handleInputChange("purchasePrice", e.target.value)
                          }
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.purchasePrice
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={loading}
                        />
                      </div>
                      {formErrors.purchasePrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.purchasePrice}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.sellingPrice}
                          onChange={(e) =>
                            handleInputChange("sellingPrice", e.target.value)
                          }
                          placeholder="0.00"
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.sellingPrice
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          disabled={loading}
                        />
                      </div>
                      {formErrors.sellingPrice && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.sellingPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.discountPrice}
                          onChange={(e) =>
                            handleInputChange("discountPrice", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Percentage (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.discountPercentage}
                        onChange={(e) =>
                          handleInputChange("discountPercentage", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MRP
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.mrp}
                          onChange={(e) =>
                            handleInputChange("mrp", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wholesale Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.wholesalePrice}
                          onChange={(e) =>
                            handleInputChange("wholesalePrice", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Percentage (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.taxPercentage}
                        onChange={(e) =>
                          handleInputChange("taxPercentage", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Cost
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.shippingCost}
                          onChange={(e) =>
                            handleInputChange("shippingCost", e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Inventory Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "inventory" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("inventory")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-purple-600" />
                  <h2 className="font-semibold text-gray-800">
                    Inventory Management
                  </h2>
                </div>
                {activeSection === "inventory" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "inventory" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity in Stock
                      </label>
                      <input
                        type="number"
                        value={formData.quantityInStock}
                        onChange={(e) =>
                          handleInputChange("quantityInStock", e.target.value)
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Stock Level
                      </label>
                      <input
                        type="number"
                        value={formData.minimumStockLevel}
                        onChange={(e) =>
                          handleInputChange("minimumStockLevel", e.target.value)
                        }
                        placeholder="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Stock Level
                      </label>
                      <input
                        type="number"
                        value={formData.maximumStockLevel}
                        onChange={(e) =>
                          handleInputChange("maximumStockLevel", e.target.value)
                        }
                        placeholder="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Media Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "media" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("media")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-orange-600" />
                  <h2 className="font-semibold text-gray-800">
                    Media & Images
                  </h2>
                </div>
                {activeSection === "media" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "media" && (
                <div className="p-6 border-t border-gray-100 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images <span className="text-red-500">*</span>
                    </label>
                    <FileUploadMultiple
                      label="Product Images"
                      maxFiles={5}
                      maxSize={5}
                      value={formData.imageUrls}
                      onUploadSuccess={handleMultipleImagesSuccess}
                      onUploadError={handleUploadError}
                      onRemove={handleMultipleImagesRemove}
                      required
                    />
                    {formErrors.images && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.images}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Upload product images. You can upload up to 5 images.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thumbnail Image
                    </label>
                    <FileUpload
                      label=""
                      required={false}
                      value={formData.thumbnailUrl}
                      onUploadSuccess={handleThumbnailSuccess}
                      onUploadError={handleUploadError}
                      onRemove={() => handleUploadRemove("thumbnail")}
                      disabled={loading}
                      maxSize={2}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Optional. If not provided, the first product image will be used as thumbnail.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) =>
                        handleInputChange("videoUrl", e.target.value)
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SEO Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "seo" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("seo")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-semibold text-gray-800">
                    SEO Information
                  </h2>
                </div>
                {activeSection === "seo" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "seo" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seoTitle}
                      onChange={(e) =>
                        handleInputChange("seoTitle", e.target.value)
                      }
                      placeholder="SEO optimized title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Description
                    </label>
                    <textarea
                      value={formData.seoDescription}
                      onChange={(e) =>
                        handleInputChange("seoDescription", e.target.value)
                      }
                      rows={3}
                      placeholder="Meta description for search engines"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.seoDescription.length}/500 characters
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Physical Attributes Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "physical" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("physical")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-teal-600" />
                  <h2 className="font-semibold text-gray-800">
                    Physical Attributes
                  </h2>
                </div>
                {activeSection === "physical" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "physical" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.weight}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight Unit
                      </label>
                      <select
                        value={formData.weightUnit}
                        onChange={(e) =>
                          handleInputChange("weightUnit", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="lb">Pounds (lb)</option>
                        <option value="oz">Ounces (oz)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.length}
                        onChange={(e) =>
                          handleInputChange("length", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.width}
                        onChange={(e) =>
                          handleInputChange("width", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.height}
                        onChange={(e) =>
                          handleInputChange("height", e.target.value)
                        }
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dimension Unit
                      </label>
                      <select
                        value={formData.dimensionUnit}
                        onChange={(e) =>
                          handleInputChange("dimensionUnit", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="cm">Centimeters (cm)</option>
                        <option value="in">Inches (in)</option>
                        <option value="m">Meters (m)</option>
                        <option value="ft">Feet (ft)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) =>
                          handleInputChange("color", e.target.value)
                        }
                        placeholder="e.g., Black, White"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Material
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) =>
                        handleInputChange("material", e.target.value)
                      }
                      placeholder="e.g., Plastic, Metal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div
              className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
                activeSection === "settings" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection("settings")}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-pink-600" />
                  <h2 className="font-semibold text-gray-800">
                    Product Settings
                  </h2>
                </div>
                {activeSection === "settings" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {activeSection === "settings" && (
                <div className="p-6 border-t border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Active</option>
                        <option value="NO">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Published
                      </label>
                      <select
                        value={formData.isPublished}
                        onChange={(e) =>
                          handleInputChange("isPublished", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Product
                      </label>
                      <select
                        value={formData.isFeatured}
                        onChange={(e) =>
                          handleInputChange("isFeatured", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Arrival
                      </label>
                      <select
                        value={formData.isNewArrival}
                        onChange={(e) =>
                          handleInputChange("isNewArrival", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Digital Product
                      </label>
                      <select
                        value={formData.isDigital}
                        onChange={(e) =>
                          handleInputChange("isDigital", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Has Variations
                      </label>
                      <select
                        value={formData.hasVariations}
                        onChange={(e) =>
                          handleInputChange("hasVariations", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      QR Code
                    </label>
                    <input
                      type="text"
                      value={formData.qrCode}
                      onChange={(e) =>
                        handleInputChange("qrCode", e.target.value)
                      }
                      placeholder="QR code value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Create Product
                    </>
                  )}
                </button>
                <Link
                  href="/application/shop/admin/products"
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-200 transition-colors text-center font-medium"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}