// services/couponService.ts

import { useApi } from "@/hook/useApi";

export interface CouponValidationResponse {
  valid: boolean;
  couponCode: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  expiresAt?: string;
}

export interface AppliedCouponResponse {
  couponCode: string;
  discountAmount: number;
  finalAmount: number;
}

export const useCouponService = () => {
  const { execute: applyCouponApi, loading: applyLoading } = useApi<AppliedCouponResponse>("", "POST");
  const { execute: validateApi, loading: validateLoading } = useApi<CouponValidationResponse>("/api/v1/coupons/validate", "POST");
  const { execute: removeApi, loading: removeLoading } = useApi<void>("", "DELETE");

  const applyCoupon = async (couponCode: string, cartId: number, userId?: number) => {
    return await applyCouponApi({
      url: `/api/v1/coupons/apply/${couponCode}`,
      params: { 
        cartId: cartId.toString(),
        ...(userId && { userId: userId.toString() })
      }
    });
  };

  const validateCoupon = async (couponCode: string) => {
    return await validateApi({
      body: { couponCode }
    });
  };

  const removeCoupon = async (cartId: number) => {
    return await removeApi({
      url: `/api/v1/coupons/remove/${cartId}`
    });
  };

  return {
    applyCoupon,
    validateCoupon,
    removeCoupon,
    isLoading: applyLoading || validateLoading || removeLoading
  };
};