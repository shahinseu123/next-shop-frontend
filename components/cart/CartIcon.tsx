// components/cart/CartIcon.tsx
"use client";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

interface CartIconProps {
  showLabel?: boolean;
  showPrice?: boolean;
}

export default function CartIcon({ showLabel = false, showPrice = false }: CartIconProps) {
  const { getTotalItems, getTotal, toggleCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const itemCount = getTotalItems();
  const total = getTotal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative p-2 rounded-full" aria-label="Shopping cart">
        <ShoppingCart className="w-5 h-5 text-gray-700" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors group"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <div className="relative">
        <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          Cart
        </span>
      )}
      
      {showPrice && mounted && (
        <div className="hidden lg:block text-left">
          <div className="uppercase text-[9px] font-semibold text-gray-400 tracking-wider">
            Cart
          </div>
          <div className="font-medium text-xs text-gray-600">
            <span className="font-semibold text-gray-900">
              BDT {total.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </button>
  );
}