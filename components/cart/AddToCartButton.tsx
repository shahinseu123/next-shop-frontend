// components/product/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { tokenService } from "@/lib/auth";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useToastNotifications } from "@/hook/useToast";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  price: number;
  quantity?: number;
  onSuccess?: () => void;
  className?: string;
}

export const AddToCartButton = ({ 
  productId, 
  productName, 
  price, 
  quantity = 1,
  onSuccess,
  className = ""
}: AddToCartButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { showSuccess, showError } = useToastNotifications();
  const router = useRouter();
  const pathname = usePathname();

  const handleAddToCart = async () => {
    // Check authentication first
    const token = tokenService.getToken();
    if (!token) {
      showError("Please login to add items to cart");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (isLoading || isAdded) return;

    const numProductId = Number(productId);
    const numQuantity = Number(quantity);
    
    if (!numProductId || isNaN(numProductId)) {
      showError("Invalid product ID");
      return;
    }

    setIsLoading(true);

    try {
      const success = await addItem(numProductId, numQuantity);
      
      if (success) {
        setIsAdded(true);
        showSuccess(`${productName} added to cart!`);
        onSuccess?.();
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        showError("Failed to add item to cart");
      }
    } catch (error) {
      showError("Failed to add item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isAdded}
      className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding...</span>
        </>
      ) : isAdded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};