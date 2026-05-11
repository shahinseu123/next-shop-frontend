// components/coupon/CouponInput.tsx

import React, { useState } from "react";
import { Tag, Gift, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { AppliedCouponResponse } from "@/type/shop";

interface CouponInputProps {
  onApply: (code: string) => Promise<boolean>;
  onRemove: () => void;
  appliedCoupon?: AppliedCouponResponse | null;
  isApplying?: boolean;
  isRemoving?: boolean;
  error?: string | null;
  className?: string;
}

// Helper function to format price from cents to dollars
const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const CouponInput: React.FC<CouponInputProps> = ({
  onApply,
  onRemove,
  appliedCoupon,
  isApplying = false,
  isRemoving = false,
  error = null,
  className = "",
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!couponCode.trim()) {
      setLocalError("Please enter a coupon code");
      return;
    }

    setLocalError(null);
    const success = await onApply(couponCode.toUpperCase().trim());
    
    if (success) {
      setCouponCode("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  // If coupon is applied, show applied state
  if (appliedCoupon) {
    const discountText = appliedCoupon.discountType === "PERCENTAGE"
      ? `${appliedCoupon.discountValue}% OFF`
      : `${formatPrice(appliedCoupon.discountValue * 100)} OFF`;

    const savingsText = appliedCoupon.discountType === "PERCENTAGE"
      ? `${appliedCoupon.discountValue}%`
      : formatPrice(appliedCoupon.discountAmount);

    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-800">
                  {appliedCoupon.couponCode}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Applied
                </span>
              </div>
              <p className="text-sm text-green-600">
                {discountText} discount applied
              </p>
              <p className="text-xs text-green-500 mt-1">
                You saved {savingsText}
              </p>
            </div>
          </div>
          <button
            onClick={onRemove}
            disabled={isRemoving}
            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
            title="Remove coupon"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
            ) : (
              <X className="w-4 h-4 text-green-600" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Show input form
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            disabled={isApplying}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={isApplying || !couponCode.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium"
        >
          {isApplying && <Loader2 className="w-4 h-4 animate-spin" />}
          Apply
        </button>
      </div>
      
      {/* Error message */}
      {(error || localError) && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error || localError}</span>
        </div>
      )}
    </div>
  );
};