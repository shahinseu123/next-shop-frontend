// hooks/useCoupon.ts

import { useState, useEffect, useCallback } from "react";
import { useApi } from "@/hook/useApi";
import { useToastNotifications } from "@/hook/useToast";
import { 
  CouponValidationResponse, 
  AppliedCouponResponse,
  CouponValidationRequest 
} from "@/type/shop";

interface UseCouponOptions {
  cartId: number;
  cartTotal: number;
  userId?: number;
  onApplySuccess?: (response: AppliedCouponResponse) => void;
  onRemoveSuccess?: () => void;
}

interface UseCouponReturn {
  appliedCoupon: AppliedCouponResponse | null;
  isApplying: boolean;
  isRemoving: boolean;
  isValidating: boolean;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: () => Promise<void>;
  validateCoupon: (couponCode: string) => Promise<CouponValidationResponse>;
  clearError: () => void;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export const useCoupon = ({
  cartId,
  cartTotal,
  userId,
  onApplySuccess,
  onRemoveSuccess,
}: UseCouponOptions): UseCouponReturn => {
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCouponResponse | null>(null);
  const { showSuccess, showError } = useToastNotifications();
  
  // API calls with proper typing
  const { execute: validateCouponApi, loading: isValidating } = useApi<CouponValidationResponse>(
    "/api/v1/coupons/validate",
    "POST"
  );
  
  const { execute: applyCouponApi, loading: isApplying } = useApi<AppliedCouponResponse>(
    "",
    "POST"
  );
  
  const { execute: removeCouponApi, loading: isRemoving } = useApi<void>(
    "",
    "DELETE"
  );
  
  const { execute: getAppliedCouponApi, loading: isLoadingApplied } = useApi<AppliedCouponResponse>(
    `/api/v1/coupons/applied/${cartId}`,
    "GET"
  );

  // Load applied coupon on mount
  useEffect(() => {
    loadAppliedCoupon();
  }, [cartId]);

  const loadAppliedCoupon = async (): Promise<void> => {
    try {
      const result = await getAppliedCouponApi();
      if (result && typeof result === 'object' && 'couponCode' in result) {
        setAppliedCoupon(result as unknown as AppliedCouponResponse);
      }
    } catch (error) {
      console.error("Failed to load applied coupon:", error);
    }
  };

  // Validate coupon without applying
  const validateCoupon = useCallback(async (couponCode: string): Promise<CouponValidationResponse> => {
    if (!couponCode.trim()) {
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: cartTotal,
        message: "Please enter a coupon code",
      };
    }

    const request: CouponValidationRequest = {
      couponCode: couponCode.toUpperCase().trim(),
      cartTotal,
      userId,
    };
    
    try {
      const result = await validateCouponApi({ data: request });
      return result as unknown as CouponValidationResponse;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        valid: false,
        discountAmount: 0,
        finalAmount: cartTotal,
        message: apiError?.message || "Failed to validate coupon",
      };
    }
  }, [cartTotal, userId, validateCouponApi]);

  // Apply coupon
  const applyCoupon = useCallback(async (couponCode: string): Promise<boolean> => {
    if (!couponCode.trim()) {
      showError("Please enter a coupon code");
      return false;
    }

    try {
      // First validate
      const validation = await validateCoupon(couponCode);
      
      if (!validation.valid) {
        showError(validation.message || "Invalid coupon code");
        return false;
      }
      
      // Then apply
      const result = await applyCouponApi({
        url: `/api/v1/coupons/apply/${couponCode.toUpperCase().trim()}`,
        params: { cartId, userId }
      });
      
      if (!result) {
        throw new Error("Failed to apply coupon");
      }
      
      const appliedResult = result as unknown as AppliedCouponResponse;
      setAppliedCoupon(appliedResult);
      
      // Show success toast with discount info
      const discountText = appliedResult.discountType === "PERCENTAGE" 
        ? `${appliedResult.discountValue}% off` 
        : `$${appliedResult.discountValue} off`;
      
      const savingsAmount = appliedResult.discountAmount.toFixed(2);
      showSuccess(`Coupon applied! You saved ${discountText} ($${savingsAmount})`);
      
      onApplySuccess?.(appliedResult);
      return true;
    } catch (err) {
      const error = err as ApiError;
      const errorMessage = error?.message || "Failed to apply coupon";
      showError(errorMessage);
      return false;
    }
  }, [cartId, userId, validateCoupon, applyCouponApi, showSuccess, showError, onApplySuccess]);

  // Remove coupon
  const removeCoupon = useCallback(async (): Promise<void> => {
    try {
      await removeCouponApi({ url: `/api/v1/coupons/remove/${cartId}` });
      setAppliedCoupon(null);
      showSuccess("Coupon removed from your order");
      onRemoveSuccess?.();
    } catch (err) {
      const error = err as ApiError;
      const errorMessage = error?.message || "Failed to remove coupon";
      showError(errorMessage);
    }
  }, [cartId, removeCouponApi, showSuccess, showError, onRemoveSuccess]);

  // Clear error (kept for compatibility)
  const clearError = useCallback((): void => {}, []);

  return {
    appliedCoupon,
    isApplying,
    isRemoving,
    isValidating: isValidating || isLoadingApplied,
    applyCoupon,
    removeCoupon,
    validateCoupon,
    clearError,
  };
};