// components/cart/CartIcon.tsx
"use client";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { getTotalItems, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const itemCount = getTotalItems();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative p-2 rounded-full">
        <ShoppingCart className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  return (
    <span 
      onClick={toggleCart}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-5 h-5 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </span>
  );
}