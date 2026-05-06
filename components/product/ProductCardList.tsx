import { Product } from "@/type/shop";
import { ProductCard } from "./ProductCard";
import { Title } from "../utility/Title";

export const ProductCardList = ({ products }: { products: Product[] }) => {
  // Handle empty or undefined products array
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Title title="PRODUCTS" size="text-2xl" textColor="text-gray-600" />

      <div className=" rounded-lg shop-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 py-2">
        {products.map((product: Product, index: number) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
