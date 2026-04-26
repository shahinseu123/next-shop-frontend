import { CategoryCard } from "@/components/category/CategoryCard";
import { getBrands, getCategories, getProducts } from "../actions/product";
import { Suspense } from "react";
import { Pretty } from "@/components/utility/Pretty";
import { CategoryCardList } from "@/components/category/CategoryCardList";
import { BrandCardList } from "@/components/brand/BrandCardList";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const param = await searchParams;
  const [productsData, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  // console.log(brands);
  // console.log(categories);
  // console.log(productsData);
  return (
    <>
      <div >
        <Suspense fallback={"Loading..."}>
          <BrandCardList brands={brands} />
          <CategoryCardList categories={categories} />
        </Suspense>
      </div>
    </>
  );
}
