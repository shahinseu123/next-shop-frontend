"use client"
import { ProductDetails } from "@/type/shop";
import { useState } from "react";
import { Star, Package, Truck, RefreshCw, Shield } from "lucide-react";

type TabType = "details" | "sizing" | "reviews";

// Mock data for size chart
const mockSizeChart = [
  { size: "XS", chest: "32-34", waist: "24-26", hip: "33-35", length: "27" },
  { size: "S", chest: "35-37", waist: "27-29", hip: "36-38", length: "28" },
  { size: "M", chest: "38-40", waist: "30-32", hip: "39-41", length: "29" },
  { size: "L", chest: "41-43", waist: "33-35", hip: "42-44", length: "30" },
  { size: "XL", chest: "44-46", waist: "36-38", hip: "45-47", length: "31" },
];

// Mock data for reviews
const mockReviewsList = [
  {
    id: "1",
    author: "Sarah Johnson",
    rating: 5,
    date: "March 15, 2026",
    title: "Absolutely perfect!",
    content: "The quality is outstanding and fits exactly as expected. The material feels premium and the stitching is durable. Highly recommend this product!",
    verified: true,
    helpful: 24,
  },
  {
    id: "2",
    author: "Michael Chen",
    rating: 4,
    date: "March 10, 2026",
    title: "Great value for money",
    content: "Very comfortable and stylish. Slightly larger than expected but still looks great. The fabric is breathable and perfect for daily wear.",
    verified: true,
    helpful: 12,
  },
  {
    id: "3",
    author: "Emma Williams",
    rating: 5,
    date: "March 5, 2026",
    title: "Love this product!",
    content: "Fast shipping and excellent quality. The color is exactly as shown in pictures. Will definitely buy from this brand again!",
    verified: true,
    helpful: 18,
  },
  {
    id: "4",
    author: "David Brown",
    rating: 3,
    date: "February 28, 2026",
    title: "Decent product",
    content: "Good product for the price. The material is comfortable but the sizing runs a bit small. Would recommend sizing up.",
    verified: false,
    helpful: 5,
  },
  {
    id: "5",
    author: "Lisa Anderson",
    rating: 5,
    date: "February 20, 2026",
    title: "Exceeded expectations",
    content: "The quality is amazing! Very comfortable and looks great. Received many compliments. Will be ordering more colors.",
    verified: true,
    helpful: 32,
  },
  {
    id: "6",
    author: "James Wilson",
    rating: 4,
    date: "February 15, 2026",
    title: "Nice product",
    content: "Good quality and fast delivery. The fit is true to size and material feels nice. Would recommend to others.",
    verified: true,
    helpful: 8,
  },
];

// Calculate rating distribution
const getRatingDistribution = (reviews: typeof mockReviewsList) => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
};

export default function ProductTabs({ product }: { product: ProductDetails }) {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(
    mockReviewsList.reduce((acc, review) => ({ ...acc, [review.id]: review.helpful }), {})
  );
  const [userHelpful, setUserHelpful] = useState<Record<string, boolean>>({});

  // Use product data if available, otherwise use mock data
  const sizeChart = mockSizeChart;
  const reviewsList = mockReviewsList;
  const ratingDistribution = getRatingDistribution(reviewsList);
  const totalReviews = product.reviewCount || reviewsList.length;
  const averageRating = product.averageRating || 4.6;

  const tabs = [
    { id: "details" as TabType, label: "Product Details" },
    { id: "sizing" as TabType, label: "Size Guide" },
    { id: "reviews" as TabType, label: `Reviews (${totalReviews})` },
  ];

  const handleHelpful = (reviewId: string) => {
    if (!userHelpful[reviewId]) {
      setHelpfulCounts(prev => ({
        ...prev,
        [reviewId]: (prev[reviewId] || 0) + 1
      }));
      setUserHelpful(prev => ({
        ...prev,
        [reviewId]: true
      }));
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200">
      {/* Tab Headers */}
      <div className="flex gap-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {/* Product Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="text-base leading-relaxed">{product.longDescription || product.shortDescription}</p>
            </div>

            {/* Product Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="font-semibold text-black mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">SKU:</span>
                    <span className="text-gray-900 font-medium">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Brand:</span>
                    <span className="text-gray-900 font-medium">{product.brandName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Category:</span>
                    <span className="text-gray-900 font-medium">{product.categoryName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Stock Status:</span>
                    <span className={`font-medium ${product.quantityInStock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {product.quantityInStock > 0 ? `${product.quantityInStock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl">
                <h4 className="font-semibold text-black mb-3">Shipping & Returns</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <Truck className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Free Shipping</p>
                      <p className="text-gray-500">On orders over $50. Delivery in 3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Easy Returns</p>
                      <p className="text-gray-500">30-day return policy. Free returns within 14 days</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Shopping</p>
                      <p className="text-gray-500">100% secure payment. Buyer protection guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h4 className="font-semibold text-black mb-3">Key Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Premium quality materials
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Breathable and comfortable fabric
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Available in multiple sizes
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Easy care and maintenance
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Ethically sourced materials
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Durable stitching and finish
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Size Guide Tab */}
        {activeTab === "sizing" && (
          <div>
            <div className="mb-8 bg-blue-50 p-5 rounded-xl">
              <h3 className="font-semibold text-black mb-2">How to Measure</h3>
              <p className="text-sm text-gray-600 mb-3">Take your measurements while wearing thin clothing and keeping the tape measure level.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mt-4">
                <div>
                  <p className="font-medium text-gray-900">Chest</p>
                  <p className="text-gray-500">Measure around the fullest part of your chest</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Waist</p>
                  <p className="text-gray-500">Measure around your natural waistline</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hip</p>
                  <p className="text-gray-500">Measure around the fullest part of your hips</p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left font-semibold text-sm">Size</th>
                    <th className="border p-3 text-left font-semibold text-sm">Chest (in)</th>
                    <th className="border p-3 text-left font-semibold text-sm">Waist (in)</th>
                    <th className="border p-3 text-left font-semibold text-sm">Hip (in)</th>
                    <th className="border p-3 text-left font-semibold text-sm">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((size) => (
                    <tr key={size.size} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-3 font-semibold text-gray-900">{size.size}</td>
                      <td className="border p-3 text-gray-600">{size.chest}</td>
                      <td className="border p-3 text-gray-600">{size.waist}</td>
                      <td className="border p-3 text-gray-600">{size.hip}</td>
                      <td className="border p-3 text-gray-600">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">💡 Pro Tip:</span> If you're between sizes, we recommend sizing up for a more comfortable fit. 
                The fabric has slight stretch for better comfort.
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4">* Measurements are in inches and may vary slightly by style.</p>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Review Summary */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
              <div className="text-center lg:text-left min-w-[180px]">
                <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                <div className="flex gap-1 mt-2 justify-center lg:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : i < averageRating 
                            ? 'fill-yellow-400 text-yellow-400 opacity-50'
                            : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-600 mt-1">{totalReviews} reviews</div>
                {product.discountPercentage > 0 && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    ★ Verified ratings
                  </div>
                )}
              </div>
              
              <div className="flex-1 w-full space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingDistribution[star as keyof typeof ratingDistribution];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm group cursor-pointer">
                      <span className="w-12 text-gray-600 group-hover:text-gray-900">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500 group-hover:bg-yellow-500" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                      <span className="w-10 text-gray-500 text-xs">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Write Review Button */}
            <div className="flex justify-end">
              <button className="px-6 py-2.5 border-2 border-gray-300 rounded-full text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all duration-200">
                Write a Review
              </button>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-6 divide-y divide-gray-100">
              {reviewsList.map((review) => (
                <div key={review.id} className="pt-6 first:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{review.author}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified Purchase</span>
                        )}
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <h4 className="font-medium text-gray-900 mt-2">{review.title}</h4>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">{review.date}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-2">{review.content}</p>
                  <button 
                    onClick={() => handleHelpful(review.id)}
                    disabled={userHelpful[review.id]}
                    className={`mt-3 text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      userHelpful[review.id] 
                        ? 'bg-green-50 text-green-600 cursor-default' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    👍 Helpful ({helpfulCounts[review.id] || 0})
                  </button>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {reviewsList.length > 3 && (
              <div className="text-center pt-6">
                <button className="px-8 py-3 border-2 border-gray-300 rounded-full text-sm font-medium hover:border-black hover:bg-gray-50 transition-all duration-200">
                  Load More Reviews
                </button>
              </div>
            )}

            {/* No Reviews State */}
            {reviewsList.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-3">📝</div>
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}