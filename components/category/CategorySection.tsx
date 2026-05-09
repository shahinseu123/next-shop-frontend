import { getCategories } from "@/app/actions/product";
import CategoryGrid from "./CategoryGrid";
export default async function CategorySection() {
  const categories = await getCategories();
  return <CategoryGrid categories={categories} />;
}