// hooks/useAuthCart.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { tokenService } from "@/lib/auth";

export function useAuthCart() {
  const router = useRouter();
  const initCart = useCartStore(state => state.initCart);
  const cartId = useCartStore(state => state.cartId);

  useEffect(() => {
    const token = tokenService.getToken();
    
    if (token && !cartId) {
      // Initialize cart only for authenticated users
      initCart();
    }
  }, [token, cartId, initCart]);
}