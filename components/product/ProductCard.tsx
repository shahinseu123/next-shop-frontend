"use client";
import { Product } from "@/type/shop";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useToastNotifications } from "@/hook/useToast";

export const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { showAddToCartSuccess, showWishlistAdded, showWishlistRemoved, showError } = useToastNotifications();
  
  // Use dynamic product data
  const imageUrl = product.thumbnailUrl || product.imageUrls?.[0] || 'https://placehold.co/600x400/EEE/31343C';
  const sellingPrice = product.sellingPrice;
  const mrp = product.discountPrice || product.sellingPrice;
  const discountPercentage = product.discountPercentage || 
    (mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0);
  const hasDiscount = discountPercentage > 0;
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    
    try {
      // Simulate a tiny delay for better UX
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add to cart with quantity 1
      addItem(product, 1);
      
      // Show success toast
      showAddToCartSuccess(product.name, sellingPrice);
      
      setIsAddingToCart(false);
      setShowSuccess(true);
      
      // Show success checkmark for 1.5 seconds
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (error) {
      setIsAddingToCart(false);
      showError("Failed to add item to cart");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isWishlisted) {
      showWishlistAdded(product.name);
    } else {
      showWishlistRemoved(product.name);
    }
    
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div 
      className="group relative rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 w-full max-w-full sm:max-w-[280px] md:max-w-[300px] lg:max-w-[320px] mx-auto flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Link */}
      <Link href={`/products/${product.id}`} className="block w-full">
        <div className="relative overflow-hidden bg-gray-100 aspect-square w-full">
          <Image
            width={400}
            height={400}
            src={imageUrl}
            alt={product.name}
            unoptimized={true}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge - Top Right */}
          {hasDiscount && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <span className="text-[10px] font-bold">⚡</span>
                <span className="text-[10px] font-bold">-{discountPercentage}%</span>
              </div>
            </div>
          )}
        </div>
      </Link>
      
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute bottom-[130px] sm:bottom-[140px] md:bottom-[135px] right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-all duration-200 z-10 hover:scale-110 active:scale-95"
      >
        <Heart 
          className={`w-4 h-4 transition-colors duration-200 ${
            isWishlisted 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600 hover:text-red-500'
          }`}
        />
      </button>
      
      {/* Product Details */}
      <Link href={`/products/${product.id}`} className="block pt-3 px-1 space-y-1.5 bg-transparent flex-1">
        {/* Product Title & Brand */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-xs sm:text-sm line-clamp-2 hover:text-blue-600 transition-colors flex-1">
            {product.name}
          </h3>
          {product.brandName && (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap">
              {product.brandName}
            </span>
          )}
        </div>
        
        {/* Price Section */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            ${sellingPrice?.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[10px] sm:text-xs text-red-500 line-through">
                ${mrp?.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-xs text-blue-600 font-medium">
                Save ${(mrp - sellingPrice).toFixed(2)}
              </span>
            </>
          )}
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        disabled={isAddingToCart}
        className={`w-full mt-2 rounded-md font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 py-2 sm:py-2.5 px-2 ${
          showSuccess
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : isAddingToCart
              ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-wait'
              : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {showSuccess ? (
          <>
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Added!</span>
          </>
        ) : isAddingToCart ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
};