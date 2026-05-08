// app/products/[id]/loader.tsx
export default function ProductDeatilsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Top Section: Image Gallery + Product Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left: Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse relative overflow-hidden">
            {/* Magnifier Glass Icon */}
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Thumbnail Strip */}
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" 
                   style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="space-y-6">
          {/* Brand */}
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          
          {/* Product Title */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
          
          {/* Color Selection */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" 
                     style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-12 h-10 bg-gray-200 rounded animate-pulse" 
                     style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
          
          {/* Quantity Selector */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-16 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <div className="flex-1 h-14 bg-gray-200 rounded-lg animate-pulse" />
            <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="border-t border-gray-200 pt-8">
        {/* Tabs Skeleton */}
        <div className="flex gap-8 mb-8 border-b border-gray-200 pb-4">
          {['Description', 'Specifications', 'Reviews', 'Shipping'].map((tab, i) => (
            <div key={tab} className="h-6 bg-gray-200 rounded w-24 animate-pulse" 
                 style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
        
        {/* Tab Content */}
        <div className="space-y-4">
          {/* Description Paragraphs */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </div>
          
          {/* Specs Table */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-2" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}