// components/category/CategoryGrid.tsx
"use client";
import { useState, useEffect } from "react";
import { Category } from "@/type/shop";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: Category[];
  title?: string;
  variant?: "masonry" | "grid";
}

export default function CategoryGrid({ 
  categories, 
  title = "Shop by Category",
  variant = "masonry" 
}: CategoryGridProps) {
  const [columns, setColumns] = useState(5);

  // Update columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 768) setColumns(3);
      else if (width < 1024) setColumns(4);
      else if (width < 1280) setColumns(5);
      else setColumns(6);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  if (variant === "grid") {
    // Standard grid layout
    return (
      <div className="shop-container mx-auto px-4 py-8">
        {title && (
          <h2 className="text-lg font-bold text-gray-900 mb-6">{title}</h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} variant="minimal" />
          ))}
        </div>
      </div>
    );
  }

  // Masonry layout (Pinterest-style)
  // Distribute categories into columns for waterfall effect
  const columnContents: Category[][] = Array.from({ length: columns }, () => []);
  categories.forEach((category, index) => {
    columnContents[index % columns].push(category);
  });

  return (
    <div className="shop-container mx-auto px-4 py-8">
      {title && (
        <h2 className="text-md font-normal uppercase text-gray-500 mb-3">{title}</h2>
      )}
      <div className="flex gap-4">
        {columnContents.map((column, colIndex) => (
          <div key={colIndex} className="flex-1 space-y-4">
            {column.map((category) => (
              <CategoryCard key={category.id} category={category} variant="pinterest" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}