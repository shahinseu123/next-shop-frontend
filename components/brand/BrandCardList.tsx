// components/brand/BrandCardList.tsx
"use client";

import { Brand } from "@/type/shop";
import { BrandCard } from "./BrandCard";
import { CardListSlider } from "../utility/CartListSlider";

interface BrandCardListProps {
  brands: Array<Brand>;
  title?: string;
  autoPlay?: boolean;
  showArrows?: boolean;
  variant?: "default" | "compact" | "featured" | "logo-only";
  deviceType?: string;
}

export const BrandCardList = ({ 
  brands, 
  title = "Shop by Brand",
  autoPlay = true,
  showArrows = true,
  variant = "compact",
  deviceType
}: BrandCardListProps) => {
  
  if (!brands || brands.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No brands available</p>
      </div>
    );
  }

  return (
    <CardListSlider 
      // title={title}
      autoPlay={autoPlay}
      showArrows={showArrows}
      autoPlaySpeed={4000}
      deviceType={deviceType}
    >
      {brands.map((brand: Brand) => (
        <div key={brand.id}>
          <BrandCard brand={brand} variant={variant} />
        </div>
      ))}
    </CardListSlider>
  );
};