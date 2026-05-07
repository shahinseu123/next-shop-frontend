// CategoryPage.tsx
import { ProductsSkeleton } from "@/components/loader/ProductsSkeleton";
import ProductSection from "@/components/product/ProductSection";
import { Suspense } from "react";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <div className="my-3">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductSection categoryName={name} />
      </Suspense>
    </div>
  );
}