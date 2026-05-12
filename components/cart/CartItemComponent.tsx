// components/cart/CartItemComponent.tsx - Updated to use isolated QuantityControl
"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Loader2 } from "lucide-react";
import { useState, useCallback, memo } from "react";
import { QuantityControl } from "./QuantityControl";
import type { CartItem } from "@/services/cartService";

interface CartItemComponentProps {
  item: CartItem;
  onRemove: (itemId: number) => Promise<boolean>;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<boolean>;
  variant?: 'drawer' | 'page';
}

// Memoize to prevent unnecessary re-renders
export const CartItemComponent = memo(function CartItemComponent({ 
  item, 
  onRemove, 
  onUpdateQuantity, 
  variant = 'drawer' 
}: CartItemComponentProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const itemTotal = item.totalPrice || (item.price * item.quantity);
  const imageUrl = item.productImage || 'https://placehold.co/400x400/EEE/31343C';
  const isDrawer = variant === 'drawer';
  const isPage = variant === 'page';

  const handleRemove = useCallback(async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      setIsRemoving(false);
      console.error('Failed to remove item:', error);
    }
  }, [item.id, onRemove, isRemoving]);

  return (
    <div 
      className={`
        flex gap-3 border-b border-gray-100 last:border-0
        ${isPage ? 'p-3 sm:p-4 hover:bg-gray-50/50 transition-colors' : 'py-3 animate-in fade-in slide-in-from-right-4 duration-300'}
        ${isRemoving ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      {/* Product Image */}
      <Link 
        href={`/products/${item.productId}`}
        className={`
          relative bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 hover:scale-105
          ${isPage ? 'w-16 h-16 sm:w-20 sm:h-20 rounded-md' : 'w-20 h-20'}
        `}
      >
        <Image
          src={imageUrl}
          alt={item.productName}
          fill
          className="object-cover"
          unoptimized={true}
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link 
              href={`/products/${item.productId}`}
              className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
            >
              {item.productName}
            </Link>
            <p className="text-xs text-gray-400 mt-1">
              BDT {item.price.toFixed(2)} each
            </p>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95 flex-shrink-0 disabled:opacity-40"
            aria-label={`Remove ${item.productName}`}
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Quantity Controls & Total */}
        <div className="flex items-center justify-between mt-2">
          {/* Isolated QuantityControl - manages its own state */}
          <QuantityControl
            itemId={item.id}
            quantity={item.quantity}
            onUpdate={onUpdateQuantity}
          />
          
          {/* Total Price */}
          <span className="text-sm font-bold text-gray-900">
            BDT {itemTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
});