"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";

export function CartInitializer() {
  const initCart = useCartStore((state) => state.initCart);
  const cartId = useCartStore((state) => state.cartId);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !cartId) {
      initialized.current = true;
      initCart();
    }
  }, [cartId, initCart]);

  return null;
}