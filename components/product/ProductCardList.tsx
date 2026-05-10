import { Product } from "@/type/shop";
import { ProductCard } from "./ProductCard";
import { Title } from "../utility/Title";

export const ProductCardList = ({
  products,
  title,
}: {
  products: Product[];
  title: string;
}) => {
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
    <div className="shop-container">
    <div className="mx-2 border border-gray-300  rounded-lg bg-white shadow">
      {title && (
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500">
            {title}
          </h2>
          <div className="hidden md:flex items-center text-xs text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer">
            <span>View all</span>
          </div>
        </div>
      )}
      <div className="px-2 rounded-lg shop-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 py-2">
        {products && products.length && products.map((product: Product, index: number) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>

    </div>
  );
};
