"use client";

import { ProductDetails } from "@/type/shop";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart, CreditCard, ShieldCheck, Truck, RefreshCw, X, Loader2 } from "lucide-react";
import { QuantityControl } from "@/components/cart/QuantityControl";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export default function ProductActions({ 
  product
}: { 
  product: ProductDetails;
}) {
  const setIsCartOpen = useCartStore((state) => state.setIsCartOpen);

  const maxStock = product.quantityInStock || 0;
  const isInStock = maxStock > 0;
  const currentPrice = product.discountPrice || product.sellingPrice;
  const freeShippingThreshold = 50;
  const isFreeShipping = currentPrice >= freeShippingThreshold;

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
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
          {/* Price Display */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                BDT {currentPrice.toFixed(2)}
              </span>
              {product.discountPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  BDT {product.sellingPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.discountPercentage && (
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Quantity</span>
            <QuantityControl
              itemId={product.id}
              quantity={1}
              minQuantity={1}
              maxQuantity={maxStock}
              onUpdate={async (_, qty) => {
                // Just update UI, actual add to cart happens on button click
                return true;
              }}
              size="md"
            />
          </div>

          {/* Low Stock Warning */}
          {maxStock < 20 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <span>⚠️</span>
              <span>Only {maxStock} left in stock</span>
            </div>
          )}

          {/* Add to Cart Button */}
          <AddToCartButton
            productId={product.id}
            productName={product.name}
            price={currentPrice}
          />

          {/* Free Shipping Info */}
          {isFreeShipping ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
              <Truck className="w-3.5 h-3.5" />
              <span className="font-medium">Free shipping available</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">Free shipping at BDT {freeShippingThreshold}</span>
                <span className="text-indigo-600 font-medium">
                  BDT {(freeShippingThreshold - currentPrice).toFixed(2)} away
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((currentPrice / freeShippingThreshold) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Protected</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Price Info */}
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">Price</p>
              <p className="text-base font-bold text-gray-900">
                BDT {currentPrice.toFixed(2)}
              </p>
            </div>

            {/* Add to Cart Button - Full width on mobile */}
            <div className="flex-1">
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                price={currentPrice}
              />
            </div>
          </div>

          {/* Free Shipping Banner */}
          {isFreeShipping ? (
            <p className="text-[10px] text-center text-emerald-600 mt-2 font-medium">
              ✨ Free shipping available
            </p>
          ) : (
            <p className="text-[10px] text-center text-gray-500 mt-2">
              Free shipping at BDT {freeShippingThreshold}
            </p>
          )}

          {/* Low Stock Warning */}
          {maxStock < 20 && (
            <p className="text-[10px] text-center text-amber-600 mt-1">
              Only {maxStock} left in stock
            </p>
          )}
        </div>
      </div>

      {/* Spacer for mobile fixed bottom bar */}
      <div className="lg:hidden h-[85px]" />
    </>
  );
}