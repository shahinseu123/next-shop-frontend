import {
  getBrands,
  getCategories,
  getProducts,
  getSliders,
} from "../actions/product";
import { Suspense } from "react";
import { CategoryCardList } from "@/components/category/CategoryCardList";
import { BrandCardList } from "@/components/brand/BrandCardList";
import { ProductCardList } from "@/components/product/ProductCardList";
import SimpleSlider from "@/components/slider/SimpleSlider";
import Sidebar from "@/components/sidebar/Sidebar";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const param = await searchParams;
  const [sliders, products, categories, brands] = await Promise.all([
    getSliders(),
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  console.log(sliders);
  // console.log(brands);
  // console.log(categories);
  // console.log(products);
  return (
    <>
        <div className="mb-4 p-4 md:p-6">
          <Suspense fallback={"Loading..."}>
            <SimpleSlider sliders={sliders} />
            <BrandCardList brands={brands} />
            <CategoryCardList categories={categories} />
            <ProductCardList products={products.content} />
          </Suspense>
        </div>
    </>
  );
}
