import { getProducts } from "@/app/actions/product";
import { ProductCardList } from "./ProductCardList";

interface ProductSectionProps {
  categoryName?: string;
  brandIds?: string[];
  query?: string;
  page?: number;
  size?: number;
}

export default async function ProductSection({
  categoryName,
  brandIds = [],
  query,
  page = 0,
  size = 20,
}: ProductSectionProps) {
  // Single function handles all cases - with or without params
  const products = await getProducts({
    categoryName,
    brandIds,
    query,
    page,
    size
  });
  console.log("brandIds", brandIds)

  return <ProductCardList title="Products" products={products.content} />;
}