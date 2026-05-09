"use client"
import { ProductDetails } from "@/type/shop";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, Minus, Plus, CreditCard, ShieldCheck, Truck, RefreshCw, X } from "lucide-react";

export default function ProductActions({ product, selectedSize, selectedColor }: { 
  product: ProductDetails;
  selectedSize?: string;
  selectedColor?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const maxStock = product.quantityInStock || 0;
  const isInStock = maxStock > 0;
  const currentPrice = product.discountPrice || product.sellingPrice;
  
  const increaseQuantity = () => {
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;
    
    setIsAddingToCart(true);
    
    // Simulate API call for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Add to cart store
    addItem(product, quantity, selectedSize, selectedColor);
    
    setIsAddingToCart(false);
    
    // Optional: Show success indicator or open cart
    // setIsCartOpen(true); // Uncomment to auto-open cart
  };

  const totalPrice = currentPrice * quantity;
  const freeShippingThreshold = 50;
  const isFreeShipping = totalPrice >= freeShippingThreshold;
  // Out of stock state
  if (!isInStock) {
    return (
      <>
        {/* Desktop Out of Stock */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Out of Stock</h3>
              <p className="text-xs text-gray-500">This item is currently unavailable</p>
              <button 
                className="w-full py-2 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                disabled
              >
                Notify Me When Available
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Out of Stock */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900">Out of Stock</p>
                  <p className="text-[10px] text-gray-500">Unavailable</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                Notify Me
              </button>
            </div>
          </div>
        </div>
        <div className="lg:hidden h-[70px]" />
      </>
    );
  }

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-4">
          {/* Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
              <span className="text-xs text-gray-400">for {quantity} {quantity === 1 ? 'item' : 'items'}</span>
            </div>
            <span className="text-xs text-gray-500">${currentPrice.toFixed(2)} each</span>
          </div>
          
          {/* Quantity Selector - Compact */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Quantity</span>
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
              <button
                onClick={decreaseQuantity}
                className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="w-10 text-center text-sm font-medium text-gray-900">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-40"
                disabled={quantity >= maxStock}
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Low Stock Warning */}
          {maxStock < 20 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg">
              <span className="text-amber-600">⚠️</span>
              <span>Only {maxStock} left</span>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98 shadow-sm"
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Free Shipping Progress */}
          {!isFreeShipping && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Free shipping</span>
                <span className="text-indigo-600 font-medium">+${(freeShippingThreshold - totalPrice).toFixed(2)}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((totalPrice / freeShippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          
          {isFreeShipping && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <Truck className="w-3 h-3" />
              <span className="font-medium">Free shipping applied</span>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex justify-center gap-3 pt-1">
            <div className="flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">Protected</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-400">Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Compact */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-3">
            {/* Quantity Selector */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
              <button
                onClick={decreaseQuantity}
                className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-40"
                disabled={quantity >= maxStock}
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            {/* Price and Add Button */}
            <div className="flex-1 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-base font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98"
              >
                {isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Free Shipping Banner */}
          {!isFreeShipping && (
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Add ${(freeShippingThreshold - totalPrice).toFixed(2)} for free shipping
            </p>
          )}
          {isFreeShipping && (
            <p className="text-[10px] text-center text-emerald-600 mt-1 font-medium">
              ✨ Free shipping applied
            </p>
          )}

          {/* Low Stock Warning */}
          {maxStock < 20 && (
            <p className="text-[10px] text-center text-amber-600 mt-1">
              Only {maxStock} left
            </p>
          )}
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="lg:hidden h-[85px]" />
    </>
  );
}