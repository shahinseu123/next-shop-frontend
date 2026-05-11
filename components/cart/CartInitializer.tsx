// components/cart/CartInitializer.tsx

"use client";

import { useEffect, useRef } from "react";
import { useCartService } from "@/services/cartService";
import { setCartService, useCartStore } from "@/store/cartStore";

export const CartInitializer = () => {
  const cartService = useCartService();
  const { initCart, cartId, isLoading } = useCartStore();
  const initialized = useRef(false);

  // Set service instance on mount
  useEffect(() => {
    setCartService(cartService);
    console.log("Cart service set");
  }, [cartService]);

  // Initialize cart once after service is set
  useEffect(() => {
    if (!initialized.current && !cartId && !isLoading) {
      initialized.current = true;
      console.log("Initiating cart creation...");
      initCart();
    }
  }, [cartId, isLoading, initCart]);

  return null;
};