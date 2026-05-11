// components/cart/CartDrawerWrapper.tsx

"use client";

import { useEffect, useState } from "react";
import { CartDrawer } from "./CartDrawer";

export const CartDrawerWrapper = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <CartDrawer />;
};