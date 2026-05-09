"use client"
import { Product } from "@/type/shop";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  
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
    
    // Simulate a tiny delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Add to cart with quantity 1
    addItem(product, 1);
    
    setIsAddingToCart(false);
    setShowSuccess(true);
    
    // Show success checkmark for 1.5 seconds
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <div 
      className="group relative rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 max-w-[280px] flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Link */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <Image
            width={280}
            height={280}
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
      
      {/* Wishlist Button - Bottom Right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute bottom-[140px] right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-all duration-200 z-10"
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
      <Link href={`/products/${product.id}`} className="block pt-3 space-y-1.5 bg-transparent">
        {/* Product Title & Brand in one line */}
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold text-gray-800 text-xs line-clamp-1 hover:text-blue-600 transition-colors flex-1">
            {product.name}
          </h3>
          {product.brandName && (
            <span className="text-xs text-gray-400 font-medium">
              {product.brandName}
            </span>
          )}
        </div>
        
        {/* Price Section - One line */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-gray-900">
            ${sellingPrice}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-red-500 line-through">
                ${mrp}
              </span>
              <span className="text-xs text-blue-600 font-medium">
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
        className={`w-full mt-2 border rounded-md font-medium text-sm flex items-center justify-center gap-1.5 transition-all duration-200 ${
          showSuccess
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : isAddingToCart
              ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-wait'
              : 'bg-transparent border-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-700'
        }`}
        style={{ 
          paddingTop: '0.375rem', 
          paddingBottom: '0.375rem' 
        }}
      >
        {showSuccess ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Added!</span>
          </>
        ) : isAddingToCart ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            <span>Adding...</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
};