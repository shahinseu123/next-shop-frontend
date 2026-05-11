// components/product/AddToCartButton.tsx

"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { useToastNotifications } from "@/hook/useToast";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  price: number;
  quantity?: number;
}

export const AddToCartButton = ({ 
  productId, 
  productName, 
  price, 
  quantity = 1 
}: AddToCartButtonProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, isLoading } = useCartStore();
  const { showSuccess, showError } = useToastNotifications();

  const handleAddToCart = async () => {
    const success = await addItem(productId, quantity);
    
    if (success) {
      setIsAdded(true);
      showSuccess(`${productName} added to cart!`);
      setTimeout(() => setIsAdded(false), 2000);
    } else {
      showError("Failed to add item to cart");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="w-full py-2 bg-gray-900 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isAdded ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
      {isAdded ? "Added!" : "Add to Cart"}
    </button>
  );
};