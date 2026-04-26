// components/category/CategoryCard.tsx
"use client"
import { Category } from "@/type/shop";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CategoryCardProps {
  category: Category;
  variant?: "default" | "compact" | "featured" | "minimal";
}

export function CategoryCard({ category, variant = "default" }: CategoryCardProps) {
  const { id, name, slug, imageUrl, createdAt } = category;
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (!imageUrl || imageError) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const filename = imageUrl.split('/').pop();
    return `https://spring-shop-backend-production.up.railway.app/upload/${filename}`;
  };

  const imageSrc = getImageUrl();

  // Compact variant - Smaller card with readable text
  if (variant === "compact") {
    return (
      <Link href={`/categories/${slug}`} className="group block">
        <div className="w-full max-w-[80px] mx-auto">
          <div className="relative overflow-hidden rounded-md bg-gray-100 aspect-square shadow-sm hover:shadow transition-all duration-150">
            {imageSrc && !imageError ? (
              <>
                <Image
                  src={imageSrc}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-150 group-hover:scale-105"
                  sizes="80px"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-white font-bold text-base">{name.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center p-0.5">
              <h3 className="text-white text-[11px] font-medium text-center px-1 py-0.5 rounded bg-black/50 backdrop-blur-sm line-clamp-2 leading-tight">
                {name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Featured variant
  if (variant === "featured") {
    return (
      <Link href={`/categories/${slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] shadow-md hover:shadow-xl transition-all duration-500">
          {imageSrc && !imageError ? (
            <>
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-white text-5xl font-bold">{name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-xl font-bold mb-1">{name}</h3>
            <p className="text-white/80 text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
              Shop Category
              <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Minimal variant - Circle icons
  if (variant === "minimal") {
    return (
      <Link href={`/categories/${slug}`} className="group block">
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
            {imageSrc && !imageError ? (
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover"
                sizes="48px"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-purple-500">
                <span className="text-white font-bold text-sm">{name.charAt(0)}</span>
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600 transition-colors text-center line-clamp-1 max-w-[70px]">
            {name}
          </span>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/categories/${slug}`} className="group block">
      <div className="flex flex-col overflow-hidden transition-all duration-300">
        <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300">
          {imageSrc && !imageError ? (
            <>
              <Image
                src={imageSrc}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-purple-100">
              <span className="text-2xl font-bold text-gray-400">{name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-1.5 shadow-lg">
              <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <h3 className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
            {name}
          </h3>
          <div className="mt-0.5 text-[10px] text-gray-400">
            <span className="inline-flex items-center gap-0.5">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Category</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}