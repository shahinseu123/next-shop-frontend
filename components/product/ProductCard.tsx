"use client"
import { Product } from "@/type/shop";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Use dynamic product data
  const imageUrl = product.thumbnailUrl || product.imageUrls?.[0] || 'https://placehold.co/600x400/EEE/31343C';
  const sellingPrice = product.sellingPrice;
  const mrp = product.discountPrice || product.sellingPrice;
  const discountPercentage = product.discountPercentage || 
    (mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0);
  const hasDiscount = discountPercentage > 0;
  
  // Function to get tag styling and content (now accepts product prop)
  const getTagDetails = () => {
    // You can add logic here to determine tag based on product properties
    // For example: product.isNew, product.isFeatured, product.isBestSelling, etc.
    // For now, returning null as these tags might not be in the Product interface
    return null;
  };

  const tag = getTagDetails();

  return (
    <div 
      className="group relative rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer max-w-[280px] flex flex-col "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <Image
          width={280}
          height={280}
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Tag Badge - Top Left (Only if tag exists) */}
        {/* {tag && (
          <div className="absolute top-0 left-0 z-10">
            <div className="relative">
              <div className={`bg-gradient-to-r ${tag.bgGradient} text-white px-2.5 py-1 rounded-br-md shadow-md flex items-center gap-1`}>
                <span className="text-xs font-bold">{tag.icon}</span>
                <span className="text-xs font-bold">{tag.text}</span>
              </div>
              <div className="absolute -bottom-1.5 left-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px]" 
                   style={{ borderTopColor: tag.color }} />
            </div>
          </div>
        )} */}
        
        {/* Discount Badge - Top Right (Only if discount exists) */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span className="text-[10px] font-bold">⚡</span>
              <span className="text-[10px] font-bold">-{discountPercentage}%</span>
            </div>
          </div>
        )}
        
        {/* Wishlist Button - Bottom Right */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md hover:bg-white transition-all duration-200 z-10"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-200 ${
              isWishlisted 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
      </div>
      
      {/* Product Details - Transparent Background */}
      <div className="pt-3 space-y-1.5 bg-transparent">
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
        
        {/* Add to Cart Button - Gray outline */}
        <button 
          className="w-full mt-2 bg-transparent border border-gray-300 text-gray-700 py-1.5 rounded-md font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-all duration-200"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};