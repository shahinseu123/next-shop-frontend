// app/cart/page.tsx
"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Shield,
  Truck
} from "lucide-react";

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity,
    getSubtotal,
    getShippingCost,
    getTotal,
    getTotalItems,
    clearCart
  } = useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const getImageUrl = (item: any) => {
    if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      return item.imageUrls[0];
    }
    if (item.thumbnailUrl) {
      return item.thumbnailUrl;
    }
    return 'https://placehold.co/400x400/EEE/31343C';
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added any items yet</p>
            <Link href="/">
              <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm mb-3">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-500 mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-3">
            {/* Free Shipping Banner */}
            {remainingForFreeShipping > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-xs text-amber-800 font-medium">
                      Add ${remainingForFreeShipping.toFixed(2)} more for free shipping
                    </p>
                    <div className="h-1 bg-amber-200 rounded-full mt-1.5">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {remainingForFreeShipping <= 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs text-emerald-800 font-medium">Free shipping unlocked! 🎉</p>
                </div>
              </div>
            )}

            {/* Cart Items List - Compact */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {items.map((item) => {
                const price = item.discountPrice || item.sellingPrice;
                const itemTotal = price * item.cartQuantity;
                const imageUrl = getImageUrl(item);
                const hasDiscount = item.discountPercentage > 0 || item.mrp > price;
                const originalPrice = item.mrp;

                return (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 p-3 border-b border-gray-100 last:border-0">
                    {/* Image - Smaller */}
                    <div className="relative w-16 h-16 bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {item.selectedSize && (
                                <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {item.selectedColor}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</span>
                            {hasDiscount && originalPrice > price && (
                              <span className="text-[10px] text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        {/* Desktop Total */}
                        <div className="hidden sm:block text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-bold text-gray-900">${itemTotal.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5 bg-gray-50 rounded-md p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1, item.selectedSize, item.selectedColor)}
                              className="w-6 h-6 rounded hover:bg-white transition-all flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium text-gray-900">
                              {item.cartQuantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1, item.selectedSize, item.selectedColor)}
                              disabled={item.cartQuantity >= (item.quantityInStock || 10)}
                              className="w-6 h-6 rounded hover:bg-white transition-all flex items-center justify-center disabled:opacity-40"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                            className="text-gray-400 hover:text-red-500 transition-all p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Mobile Total */}
                        <div className="sm:hidden">
                          <p className="text-sm font-semibold text-gray-900">${itemTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Shopping Link */}
            <Link href="/" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary - Right Side - Compact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-4 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Order Summary</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items ({totalItems})</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600" : "text-gray-900"}>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 my-3"></div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-indigo-600">${total.toFixed(2)}</span>
              </div>

              <p className="text-[10px] text-gray-400 mt-1">Taxes calculated at checkout</p>

              {/* Checkout Button */}
              <Link href="/checkout">
                <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-indigo-700 active:scale-[0.98]">
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] text-gray-400">Secure</span>
                </div>
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] text-gray-400">Protected</span>
                </div>
                <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-gray-400" />
                  <span className="text-[9px] text-gray-400">Fast</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[8px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">Visa</span>
                  <span className="text-[8px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">MC</span>
                  <span className="text-[8px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">PayPal</span>
                </div>
              </div>
            </div>

            {/* Free Shipping Reminder */}
            {remainingForFreeShipping > 0 && (
              <div className="mt-3 bg-blue-50 rounded-lg p-2 border border-blue-100">
                <p className="text-[10px] text-blue-700 text-center">
                  Add ${remainingForFreeShipping.toFixed(2)} more for free shipping
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}