// CategoryPage.tsx
import { ProductsSkeleton } from "@/components/loader/ProductsSkeleton";
import ProductSection from "@/components/product/ProductSection";
import { Suspense } from "react";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { name } = await params;
  const resolvedParams = await searchParams;
  
  // Extract brandIds (multiple values)
  const brandIds = resolvedParams.brandIds
    ? Array.isArray(resolvedParams.brandIds)
      ? resolvedParams.brandIds
      : [resolvedParams.brandIds]
    : [];
  
  // Extract query (single value)
  const query = typeof resolvedParams.query === "string" 
    ? resolvedParams.query 
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
          categoryName={name} 
          brandIds={brandIds}
          query={query}
          page={page}
          size={size}
          key={`${name}-${brandIds.join(",")}-${query}-${page}`}
        />
      </Suspense>
    </div>
  );
}