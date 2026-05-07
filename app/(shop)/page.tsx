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

  const brandIds = resolvedParams.brandId
    ? Array.isArray(resolvedParams.brandId)
      ? resolvedParams.brandId
      : [resolvedParams.brandId]
    : [];

  const categoryName =
    typeof resolvedParams.category === "string"
      ? resolvedParams.category
      : undefined;

  const query =
    typeof resolvedParams.query === "string" ? resolvedParams.query : undefined;
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
              categoryName={categoryName}
              brandIds={brandIds}
              query={query}
              key={`${categoryName}-${brandIds.join(",")}-${query}`}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
