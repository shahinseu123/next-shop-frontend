"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CouponInput } from "@/components/coupon/CouponInput";

import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck,
  Loader2,
} from "lucide-react";
import { CartItemComponent } from "@/components/cart/CartItemComponent";

export default function CartPage() {
  const {
    items,
    cart,
    isLoading,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingCost,
    getTotal,
    getTotalItems,
    clearCart,
    hasItems,
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

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading cart...</span>
        </div>
      </div>
    );
  }

  if (!hasItems() || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Looks like you haven&apos;t added any items yet
            </p>
            <Link href="/">
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all">
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-indigo-600 transition-colors text-sm mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={clearCart}
              disabled={isLoading}
              className="text-red-500 hover:text-red-600 text-xs font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
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
            {remainingForFreeShipping > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-800 font-medium">
                      Add BDT {remainingForFreeShipping.toFixed(2)} more for
                      free shipping
                    </p>
                    <div className="h-1 bg-amber-200 rounded-full mt-1.5">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs text-emerald-800 font-medium">
                    Free shipping unlocked! 🎉
                  </p>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  isLoading={isLoading}
                  variant="page"
                />
              ))}
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal ({totalItems} items)
                  </span>
                  <span className="text-gray-900 font-medium">
                    BDT {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? "text-emerald-600 font-medium"
                        : "text-gray-900 font-medium"
                    }
                  >
                    {shipping === 0 ? "Free" : `BDT ${shipping.toFixed(2)}`}
                  </span>
                </div>
                {/* Order Summary - Right Side */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg border border-gray-100 p-4 sm:p-5 sticky top-24">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h2>

                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">
                          Subtotal ({totalItems} items)
                        </span>
                        <span className="text-gray-900 font-medium">
                          BDT {subtotal.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span
                          className={
                            shipping === 0
                              ? "text-emerald-600 font-medium"
                              : "text-gray-900 font-medium"
                          }
                        >
                          {shipping === 0
                            ? "Free"
                            : `BDT ${shipping.toFixed(2)}`}
                        </span>
                      </div>

                      {cart?.discountAmount && cart.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount</span>
                          <span className="text-emerald-600 font-medium">
                            -BDT {cart.discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Coupon Input - Add here */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <CouponInput />
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-xl font-bold text-indigo-600">
                        BDT {total.toFixed(2)}
                      </span>
                    </div>

                    {/* Rest of order summary... */}
                  </div>
                </div>
                {cart?.discountAmount && cart.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-emerald-600 font-medium">
                      -BDT {cart.discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 my-4"></div>

              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-indigo-600">
                  BDT {total.toFixed(2)}
                </span>
              </div>

              <p className="text-[10px] text-gray-400 mt-1">
                Taxes calculated at checkout
              </p>

              <Link href="/checkout" className="block mt-4">
                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-indigo-700 active:scale-[0.98]">
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>

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
            </div>

            {remainingForFreeShipping > 0 && (
              <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    Add BDT {remainingForFreeShipping.toFixed(2)} more for{" "}
                    <span className="font-semibold">free shipping!</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
