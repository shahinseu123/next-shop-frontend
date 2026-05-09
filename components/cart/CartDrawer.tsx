"use client";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, X, Minus, Plus, Trash2, CreditCard, Shield, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClientOnly from "../utility/ClientOnly";

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeItem, 
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getShippingCost,
    getTotal
  } = useCartStore();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const totalItems = getTotalItems();
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  useEffect(() => {
    setMounted(true);
  }, []);

  const getImageUrl = (item: any) => {
    if (item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
      return item.imageUrls[0];
    }
    if (item.thumbnailUrl) {
      return item.thumbnailUrl;
    }
    return 'https://placehold.co/400x400/EEE/31343C';
  };

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isCartOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  if (!mounted) return null;
  if (!isVisible) return null;

  return (
    <ClientOnly>
      <>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        {/* Drawer */}
        <div 
          className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-all duration-500 ease-out ${
            isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-50 p-1.5 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const price = item.discountPrice || item.sellingPrice;
                const itemTotal = price * item.cartQuantity;
                const imageUrl = getImageUrl(item);
                
                return (
                  <div 
                    key={`${item.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`} 
                    className="flex gap-3 py-3 border-b border-gray-100 last:border-0"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 transition-transform duration-300 hover:scale-105">
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
                      <div className="flex justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h3>
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
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
                          <p className="text-xs text-gray-400 mt-1">${price.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
                          className="text-gray-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.cartQuantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-1 rounded hover:bg-white transition-all hover:shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900">
                            {item.cartQuantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.cartQuantity + 1, item.selectedSize, item.selectedColor)}
                            disabled={item.cartQuantity >= (item.quantityInStock || 10)}
                            className="p-1 rounded hover:bg-white transition-all disabled:opacity-40 hover:shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-4">
              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Free shipping</span>
                    <span className="text-indigo-600 font-medium">
                      +${remainingForFreeShipping.toFixed(2)} to go
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {remainingForFreeShipping <= 0 && (
                <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">Free shipping unlocked! 🎉</span>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900 font-medium">
                    {shipping === 0 ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-indigo-600">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" onClick={handleClose}>
                <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]">
                  Proceed to Checkout
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Secure</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Protected</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400">Fast Delivery</span>
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-400">
                Taxes calculated at checkout
              </p>
            </div>
          )}
        </div>
      </>
    </ClientOnly>
  );
}