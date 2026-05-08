// CategoryPage.tsx
import { ProductsSkeleton } from "@/components/loader/ProductsSkeleton";
import ProductSection from "@/components/product/ProductSection";
import { Suspense } from "react";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ queryString: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { queryString } = await params;
  const resolvedParams = await searchParams;
  
  // Extract brandIds (multiple values)
  const brandIds = resolvedParams.brandIds
    ? Array.isArray(resolvedParams.brandIds)
      ? resolvedParams.brandIds
      : [resolvedParams.brandIds]
    : [];
  
  // Extract query (single value)
  const search = typeof resolvedParams.search === "string" 
    ? resolvedParams.search 
    : undefined;
  
  // Extract page (single value)
  const page = typeof resolvedParams.page === "string" 
    ? parseInt(resolvedParams.page) 
    : 0;
  
  // Extract size (single value)
  const size = typeof resolvedParams.size === "string" 
    ? parseInt(resolvedParams.size) 
    : 20;

  return (
    <div className="my-3">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductSection 
          // categoryName={name} 
          brandIds={brandIds}
          search={search}
          page={page}
          size={size}
          key={`${brandIds.join(",")}-${search}-${page}`}
        />
      </Suspense>
    </div>
  );
}