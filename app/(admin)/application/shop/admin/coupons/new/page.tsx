// app/(admin)/application/shop/admin/coupons/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  Percent, 
  DollarSign, 
  Calendar,
  Users,
  Tag,
  Gift,
  Info,
  ShoppingBag,
  Layers,
  Search,
  X,
  Plus
} from "lucide-react";
import { useApi } from "@/hook/useApi";

interface CouponFormData {
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number | null;
  validFrom: string;
  validUntil: string;
  usageLimit: number | null;
  perUserLimit: number | null;
  applicableProductIds: number[];
  applicableCategoryIds: number[];
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CreateCouponPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minimumOrderAmount: 0,
    maximumDiscountAmount: null,
    validFrom: "",
    validUntil: "",
    usageLimit: null,
    perUserLimit: null,
    applicableProductIds: [],
    applicableCategoryIds: [],
  });

  const [productSearch, setProductSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  // Fetch available products
  const { execute: fetchProducts } = useApi("/api/v1/products/list", "GET", {
    onSuccess: (data) => {
      setAvailableProducts(data);
    },
  });

  // Fetch available categories
  const { execute: fetchCategories } = useApi("/api/v1/categories/list", "GET", {
    onSuccess: (data) => {
      setAvailableCategories(data);
    },
  });

  // Create coupon API hook
  const {
    execute: createCoupon,
    loading,
    error: apiError,
    data: responseData,
  } = useApi("/api/v1/coupons", "POST", {
    onSuccess: () => {
      setTimeout(() => {
        router.push("/application/shop/admin/coupons");
      }, 1500);
    },
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : parseFloat(value),
    }));
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  // Filter products based on search
  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter categories based on search
  const filteredCategories = availableCategories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Add product to selection
  const addProduct = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setFormData(prev => ({
        ...prev,
        applicableProductIds: [...prev.applicableProductIds, product.id]
      }));
    }
    setProductSearch("");
    setShowProductDropdown(false);
  };

  // Remove product from selection
  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    setFormData(prev => ({
      ...prev,
      applicableProductIds: prev.applicableProductIds.filter(id => id !== productId)
    }));
  };

  // Add category to selection
  const addCategory = (category: Category) => {
    if (!selectedCategories.find(c => c.id === category.id)) {
      setSelectedCategories([...selectedCategories, category]);
      setFormData(prev => ({
        ...prev,
        applicableCategoryIds: [...prev.applicableCategoryIds, category.id]
      }));
    }
    setCategorySearch("");
    setShowCategoryDropdown(false);
  };

  // Remove category from selection
  const removeCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== categoryId));
    setFormData(prev => ({
      ...prev,
      applicableCategoryIds: prev.applicableCategoryIds.filter(id => id !== categoryId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      return;
    }

    if (formData.discountValue <= 0) {
      return;
    }

    if (!formData.validFrom || !formData.validUntil) {
      return;
    }

    await createCoupon({
      data: formData,
    });
  };

  const errorMessage = apiError?.message;

  // Set default dates
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    setFormData((prev) => ({
      ...prev,
      validFrom: today.toISOString().split('T')[0],
      validUntil: nextMonth.toISOString().split('T')[0],
    }));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/application/shop/admin/coupons"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Coupon</h1>
            <p className="text-gray-600 mt-1">Create a discount coupon for your customers</p>
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
              Coupon created successfully! Redirecting...
            </span>
          </div>
        )}

        <div className="space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., SAVE20, WELCOME10"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                disabled={loading}
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Customers will enter this code at checkout (case-insensitive)
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
              onChange={handleChange}
              placeholder="e.g., Save 20% on your first order"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Brief description of the coupon (shown to customers)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, discountType: "PERCENTAGE", discountValue: 0 }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.discountType === "PERCENTAGE"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={loading}
                >
                  <Percent className="w-4 h-4" />
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, discountType: "FIXED_AMOUNT", discountValue: 0 }))}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    formData.discountType === "FIXED_AMOUNT"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  disabled={loading}
                >
                  <DollarSign className="w-4 h-4" />
                  Fixed Amount
                </button>
              </div>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {formData.discountType === "PERCENTAGE" ? (
                  <>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleNumberChange}
                      placeholder="e.g., 20"
                      min="0"
                      max="100"
                      step="1"
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </>
                ) : (
                  <>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleNumberChange}
                      placeholder="e.g., 10"
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={loading}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Applicable Products Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Applicable Products (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Leave empty to apply to all products. Select specific products for this coupon.
            </p>
            
            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-sm"
                  >
                    <span>{product.name}</span>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Product Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              {showProductDropdown && productSearch && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex justify-between items-center"
                    >
                      <span>{product.name}</span>
                      <span className="text-sm text-gray-500">${product.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applicable Categories Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Layers className="w-4 h-4 inline mr-2" />
              Applicable Categories (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Leave empty to apply to all categories. Select specific categories for this coupon.
            </p>
            
            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-sm"
                  >
                    <span>{category.name}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(category.id)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Category Search Dropdown */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setShowCategoryDropdown(true);
                  }}
                  onFocus={() => setShowCategoryDropdown(true)}
                  placeholder="Search categories..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
              
              {showCategoryDropdown && categorySearch && filteredCategories.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => addCategory(category)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Order Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  value={formData.minimumOrderAmount}
                  onChange={handleNumberChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum cart total required (0 = no minimum)
              </p>
            </div>

            {/* Maximum Discount Amount */}
            {formData.discountType === "PERCENTAGE" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="maximumDiscountAmount"
                    value={formData.maximumDiscountAmount || ""}
                    onChange={handleNumberChange}
                    placeholder="No limit"
                    min="0"
                    step="0.01"
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum discount amount (leave empty for no limit)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Valid Until */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Usage Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit || ""}
                  onChange={handleNumberChange}
                  placeholder="Unlimited"
                  min="1"
                  step="1"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total times this coupon can be used (leave empty for unlimited)
              </p>
            </div>

            {/* Per User Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per User Limit
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  name="perUserLimit"
                  value={formData.perUserLimit || ""}
                  onChange={handleNumberChange}
                  placeholder="Unlimited"
                  min="1"
                  step="1"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Times each customer can use this coupon (leave empty for unlimited)
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Coupon Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Coupons are case-insensitive</li>
                  <li>Only one coupon can be applied per order</li>
                  <li>Expired coupons will be automatically deactivated</li>
                  <li>Coupons cannot be combined with other offers</li>
                  <li>If products/categories are selected, coupon only applies to those items</li>
                  <li>Leave products/categories empty for store-wide coupons</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || !formData.code.trim() || formData.discountValue <= 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4" />
                  Create Coupon
                </>
              )}
            </button>
            <Link
              href="/application/shop/admin/coupons"
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