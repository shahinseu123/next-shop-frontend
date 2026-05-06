// components/category/CategoryCardList.tsx
import { Category } from "@/type/shop";
import { CategoryCard } from "./CategoryCard";
import { CardListSlider } from "../utility/CartListSlider";
import { Title } from "../utility/Title";

interface CategoryCardListProps {
  categories: Array<Category>;
  title?: string;
  autoPlay?: boolean;
  showArrows?: boolean;
}

export const CategoryCardList = ({
  categories,
  title = "Shop by Category",
  autoPlay = true,
  showArrows = true,
}: CategoryCardListProps) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No categories available</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <Title title="CATEGORIES" size="text-xl" textColor="text-gray-600" />

      <CardListSlider
        autoPlay={autoPlay}
        showArrows={showArrows}
        autoPlaySpeed={4000}
      >
        {categories &&
          categories.length &&
          categories.map((category: Category) => (
            <div key={category.id}>
              <CategoryCard category={category} variant="featured" />
            </div>
          ))}
      </CardListSlider>
    </div>
  );
};
