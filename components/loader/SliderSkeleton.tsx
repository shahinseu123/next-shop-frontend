// components/loader/SliderSkeleton.tsx
export const SliderSkeleton = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden bg-gray-100">
      <div className="aspect-[16/6] md:aspect-[16/5] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};