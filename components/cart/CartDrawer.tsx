// components/cart/CartDrawer.tsx
"use client";

import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, X, CreditCard, Shield, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartItemComponent } from "./CartItemComponent";
import { CouponInput } from "../coupon/CouponInput";

export default function CartDrawer() {
  const {
    items,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    getTotalItems,
    getSubtotal,
    getShippingCost,
    getTotal,
    hasItems,
    isLoading,
  } = useCartStore();

  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  const subtotal = getSubtotal();
  const shipping = getShippingCost();
  const total = getTotal();
  const totalItems = getTotalItems();
  const discount = cart?.discountAmount || 0;
  const freeShippingThreshold = 50;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    await removeItem(itemId);
  };

  if (!mounted) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-all duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-500 ease-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-50 p-1.5 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasItems() || items.length === 0 ? (
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
            items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onRemove={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                isLoading={isLoading}
                variant="drawer"
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">
                    Free shipping at BDT {freeShippingThreshold}
                  </span>
                  <span className="text-indigo-600 font-medium">
                    BDT {remainingForFreeShipping.toFixed(2)} away
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 rounded-lg p-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-700 font-medium">
                  Free shipping unlocked! 🎉
                </span>
              </div>
            )}

            {/* Coupon Input */}
            <CouponInput />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900 font-medium">
                  BDT {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900 font-medium">
                  {shipping === 0 ? (
                    <span className="text-emerald-600">Free</span>
                  ) : (
                    `BDT ${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-emerald-600 font-medium">
                    -BDT {discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-indigo-600">
                  BDT {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" onClick={handleClose} className="block">
              <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]">
                Proceed to Checkout
              </button>
            </Link>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] text-gray-400">Secure Payment</span>
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
  );
}