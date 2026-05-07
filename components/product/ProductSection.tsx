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
  const products = await getProducts({
    categoryName,
    brandIds,
    query,
    page,
    size
  });

  return <ProductCardList title="Products" products={products.content} />;
}