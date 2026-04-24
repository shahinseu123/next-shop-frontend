// components/BrandCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles } from "lucide-react";

export const BrandCard = ({ 
  name, 
  logo, 
  href, 
  productCount, 
  featured = false,
  rating 
}) => {
  return (
    <Link href={href} className="block group">
      <div className={`
        bg-gray-800 rounded-xl p-6 border transition-all duration-300 
        hover:transform hover:-translate-y-1 hover:shadow-xl
        ${featured 
          ? "border-gray-600 bg-gradient-to-br from-gray-800 to-gray-750" 
          : "border-gray-700 hover:border-gray-600"
        }
      `}>
        {/* Featured Badge */}
        {featured && (
          <div className="flex justify-end mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-700 rounded-full text-[10px] font-medium text-gray-300">
              <Sparkles size={10} />
              Featured
            </span>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-4 h-16 w-16 flex items-center justify-center">
            {logo ? (
              <Image 
                src={logo} 
                alt={name} 
                width={64} 
                height={64}
                className="object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-all duration-300">
                <span className="text-gray-400 font-bold text-xl group-hover:text-white">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          {/* Brand Name */}
          <h3 className="text-gray-200 font-semibold text-base mb-1 group-hover:text-white">
            {name}
          </h3>
          
          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={i < Math.floor(rating) 
                    ? "text-yellow-500 fill-yellow-500" 
                    : "text-gray-600"
                  }
                />
              ))}
              <span className="text-gray-500 text-xs ml-1">{rating}</span>
            </div>
          )}
          
          {/* Product Count */}
          {productCount && (
            <p className="text-gray-500 text-xs">{productCount}+ Products</p>
          )}
        </div>
      </div>
    </Link>
  );
};