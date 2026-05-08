"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  X,
  SlidersHorizontal,
  Tag,
  Building2,
  Star,
  DollarSign,
  RotateCcw,
  Filter,
  Loader2,
} from "lucide-react";
import { useApi } from "@/hook/useApi";
import { Category, Brand } from "@/type/shop";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    execute: fetchCategories,
    loading: categoryLoading,
    data: categoriesList,
  } = useApi<Category[]>("/api/v1/categories/list");
  const {
    execute: fetchBrands,
    loading: brandLoading,
    data: brandsList,
  } = useApi<Brand[]>("/api/v1/brands/list");

  // Initialize selectedBrands from URL params on mount
  useEffect(() => {
    const brandIdsFromUrl = searchParams.getAll("brandIds");
    if (brandIdsFromUrl.length > 0) {
      setSelectedBrands(brandIdsFromUrl);
    }
  }, []);

  // Update URL when selectedBrands changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("brandIds");
    
    if (selectedBrands.length > 0) {
      selectedBrands.forEach((id) => params.append("brandIds", id));
    }
    
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [selectedBrands]); // Only runs when selectedBrands changes

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId],
    );
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setSelectedRating(0);
    setSelectedBrands([]);
    setExpandedCategories([]);
  };

  const isCategoryActive = (slug: string) => {
    return pathname?.includes(slug);
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Loading state
  if (categoryLoading || brandLoading) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200"
        >
          <Filter className="w-5 h-5" />
        </button>

        {/* Sidebar Loading Skeleton */}
        <div
          className={`
          fixed top-0 left-0 h-full bg-white z-50
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          w-[300px] lg:w-full border-r border-gray-200
        `}
        >
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Filters
                </h2>
              </div>
            </div>
            <div className="p-5 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2 ml-6">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-8 w-full bg-gray-100 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200"
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white z-50
        transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        w-[300px] lg:w-full border-r border-gray-200
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Filters
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset all
              </button>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-8">
            {/* Categories Section */}
            {categoriesList && categoriesList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Categories
                  </h3>
                </div>
                <div className="space-y-1">
                  {categoriesList.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between group">
                        <Link
                          href={`/categories/${category.slug}`}
                          className={`flex-1 py-2 text-sm transition-colors ${
                            isCategoryActive(category.slug)
                              ? "text-gray-900 font-medium"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          {category.name}
                        </Link>
                        {category.subCategories &&
                          category.subCategories.length > 0 && (
                            <button
                              onClick={() =>
                                toggleCategory(category.id as unknown as string)
                              }
                              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                            >
                              {expandedCategories.includes(
                                category.id as unknown as string,
                              ) ? (
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                              )}
                            </button>
                          )}
                      </div>
                      {category.subCategories &&
                        category.subCategories.length > 0 &&
                        expandedCategories.includes(category.id as unknown as string) && (
                          <div className="ml-4 mt-1 space-y-1 border-l border-gray-100 pl-3">
                            {category.subCategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/categories/${sub.slug}`}
                                className={`block py-1.5 text-xs transition-colors ${
                                  isCategoryActive(sub.slug)
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-500 hover:text-gray-900"
                                }`}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brands Section */}
            {brandsList && brandsList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Brands
                  </h3>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {brandsList.map((brand) => (
                    <label
                      key={brand.id}
                      className="flex items-center justify-between py-1.5 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(
                            brand.id as unknown as string,
                          )}
                          onChange={() =>
                            toggleBrand(brand.id as unknown as string)
                          }
                          className="w-3.5 h-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                          {brand.name}
                        </span>
                      </div>
                      {/* {brand.count && (
                        <span className="text-xs text-gray-400">{brand.count}</span>
                      )} */}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Filter */}
            {/* <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Price Range</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                    />
                  </div>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-3">
                    <span>৳0</span>
                    <span>৳500</span>
                    <span>৳1000+</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Rating Filter */}
            {/* <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Rating</h3>
              </div>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 py-1.5 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                      className="w-3.5 h-3.5 text-gray-900 focus:ring-gray-900 focus:ring-1"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1.5">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div> */}
          </div>

          {/* Apply Filters Button - Mobile Only */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 lg:hidden">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full bg-gray-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
}