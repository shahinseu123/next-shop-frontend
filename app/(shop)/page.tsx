import { Suspense } from "react";
import CategorySection from "@/components/category/CategorySection";
import BrandSection from "@/components/brand/BrandSection";
import ProductSection from "@/components/product/ProductSection";
import { SliderSkeleton } from "@/components/loader/SliderSkeleton";
import { BrandsSkeleton } from "@/components/loader/BrandSkeleton";
import { CategoriesSkeleton } from "@/components/loader/CategoriesSkeleton";
import { ProductsSkeleton } from "@/components/loader/ProductsSkeleton";
import SliderSection from "@/components/slider/SliderSection";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  // brandIds: Multiple values - always returns array
  const brandIds = resolvedParams.brandIds
    ? Array.isArray(resolvedParams.brandIds)
      ? resolvedParams.brandIds
      : [resolvedParams.brandIds]
    : [];

  // categoryName: Single value - returns string or undefined
  const categoryName =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;

  // query: Single value - returns string or undefined
  const query =
    typeof resolvedParams.query === "string" 
      ? resolvedParams.query 
      : undefined;
    
  
  return (
    <>
      <div className="">
        <div className="">
          <Suspense fallback={<SliderSkeleton />}>
            <SliderSection />
          </Suspense>

          <Suspense fallback={<BrandsSkeleton />}>
            <BrandSection />
          </Suspense>

          <Suspense fallback={<CategoriesSkeleton />}>
            <CategorySection />
          </Suspense>

          <Suspense fallback={<ProductsSkeleton />}>
            <ProductSection
              categoryName={categoryName}  // string | undefined
              brandIds={brandIds}          // string[]
              query={query}               // string | undefined
              key={`${categoryName}-${brandIds.join(",")}-${query}`}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}