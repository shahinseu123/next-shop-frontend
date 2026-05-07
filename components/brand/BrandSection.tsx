import { getBrands } from "@/app/actions/product";
import { BrandCardList } from "./BrandCardList";
export default async function BrandSection() {
  const brands = await getBrands();
  return <BrandCardList brands={brands} />;
}