"use client";
import { ProductDetails } from "@/type/shop";
import { Star, Heart, Share2, Truck, Ruler, RefreshCw, Shield, Check, AlertCircle, Zap } from "lucide-react";
import { useState } from "react";

// Mock data for sizes
const mockSizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Mock data for colors
const mockColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy Blue", hex: "#1B2B4A" },
  { name: "Burgundy", hex: "#8B1E3F" },
  { name: "Emerald", hex: "#2E7D32" },
];

export default function ProductInfo({ product }: { product: ProductDetails }) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const sizes = mockSizes;
  const colors = mockColors;

  const discountPercentage = product.discountPercentage || 
    (product.mrp > product.sellingPrice ? Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) : 0);
  
  const originalPrice = product.mrp;
  const currentPrice = product.discountPrice || product.sellingPrice;
  
  const isInStock = product.quantityInStock > 0;
  const stockStatus = product.stockStatus || (isInStock ? "In Stock" : "Out of Stock");

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          {product.brandName && (
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              {product.brandName}
            </span>
          )}
          <div className="flex gap-1.5">
            {product.isNewArrival === 1 && (
              <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                New
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h1>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {product.averageRating?.toFixed(1) || "4.8"} ({product.reviewCount || 128})
          </span>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
            isInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isInStock ? <Check className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
            <span>{stockStatus}</span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
          {originalPrice > currentPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                Save ${(originalPrice - currentPrice).toFixed(2)}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 p-3 bg-indigo-50/30 rounded-xl border-l-2 border-indigo-500">
        <p className="text-xs text-gray-600 leading-relaxed">
          {product.shortDescription || "Premium quality product designed for comfort and style."}
        </p>
      </div>

      {/* Color Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700">Color</h3>
          <span className="text-xs text-indigo-600 font-medium">{selectedColor || "Select"}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color.name 
                  ? 'border-indigo-600 scale-110 shadow-md' 
                  : 'border-gray-200 hover:scale-105 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex, borderColor: color.hex === "#FFFFFF" ? "#E5E7EB" : undefined }}
              title={color.name}
            >
              {selectedColor === color.name && (
                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white drop-shadow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-700">Size</h3>
          <button 
            onClick={() => setShowSizeGuide(true)}
            className="text-xs text-gray-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <Ruler className="w-3 h-3" />
            Size Guide
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[40px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                selectedSize === size 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                  : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Alert */}
      {isInStock && product.quantityInStock < 20 && (
        <div className="mb-4 bg-amber-50 rounded-lg px-3 py-2 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-xs text-amber-700 font-medium">Only {product.quantityInStock} left</span>
        </div>
      )}

      {/* Delivery Info */}
      <div className="flex gap-3 py-3 border-t border-b border-gray-100 mb-4">
        <div className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-medium text-gray-600">Free Shipping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-medium text-gray-600">30-Day Returns</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-[11px] font-medium text-gray-600">Secure</span>
        </div>
      </div>

      {/* Action Buttons - Compact & Classy */}
      <div className="flex gap-2 mb-4">
        <button 
          disabled={!isInStock}
          className={`flex-1 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
            isInStock 
              ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95 shadow-sm' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isInStock ? 'Buy Now' : 'Out of Stock'}
        </button>
        
        <button 
          onClick={() => setIsWishlisted(!isWishlisted)}
          className={`px-4 py-2.5 rounded-full border transition-all ${
            isWishlisted 
              ? 'border-red-400 bg-red-50 text-red-500' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
        
        <div className="relative">
          <button 
            onClick={handleShare}
            className="px-4 py-2.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
          {showShareTooltip && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              Link copied!
            </div>
          )}
        </div>
      </div>

      {/* SKU Info */}
      <div className="text-center">
        <span className="text-[10px] text-gray-400">
          SKU: {product.sku || "N/A"} | {product.categoryName || "Uncategorized"}
        </span>
      </div>
    </div>
  );
}