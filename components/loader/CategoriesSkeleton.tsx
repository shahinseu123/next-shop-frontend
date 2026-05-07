// components/loader/CategoriesSkeleton.tsx
export const CategoriesSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
            <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="h-3 w-12 bg-gray-100 rounded animate-pulse mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};