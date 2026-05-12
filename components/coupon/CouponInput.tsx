// components/cart/CouponInput.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Tag, X, Loader2 } from "lucide-react";

export function CouponInput() {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  
  const { 
    appliedCoupon, 
    applyCoupon, 
    removeCoupon,
    couponLoading,
    couponError 
  } = useCartStore();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || isApplying) return;
    
    setIsApplying(true);
    setError("");
    
    try {
      const success = await applyCoupon(couponCode.trim().toUpperCase());
      if (success) {
        setCouponCode("");
      }
    } catch (err) {
      setError("Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyCoupon();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-emerald-100 rounded">
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-700">
                Coupon Applied: {appliedCoupon.code}
              </p>
              <p className="text-[10px] text-emerald-600">
                Discount: -BDT {appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            disabled={couponLoading}
            className="text-emerald-500 hover:text-emerald-600 transition-colors disabled:opacity-50"
          >
            {couponLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value.toUpperCase());
              setError("");
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            disabled={isApplying || couponLoading}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            maxLength={20}
          />
          {couponCode && !isApplying && (
            <button
              onClick={() => setCouponCode("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <button
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || isApplying || couponLoading}
          className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
        >
          {isApplying || couponLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Applying
            </>
          ) : (
            <>
              <Tag className="w-3 h-3" />
              Apply
            </>
          )}
        </button>
      </div>
      
      {/* Error Message */}
      {(error || couponError) && (
        <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error || couponError}
        </p>
      )}
      
      {/* Hint */}
      {!error && !couponError && (
        <p className="text-[10px] text-gray-400 mt-1.5">
          Try codes: SAVE10, FREESHIP, WELCOME20
        </p>
      )}
    </div>
  );
}