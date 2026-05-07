import { getCategories } from "@/app/actions/product";
import { CategoryCardList } from "./CategoryCardList";
export default async function CategorySection() {
  const categories = await getCategories();
  return <CategoryCardList categories={categories} />;
}