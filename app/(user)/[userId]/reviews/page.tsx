// app/dashboard/reviews/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Star, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Clock,
  Package,
  ChevronRight,
  ShoppingBag,
  ThumbsUp,
  MessageSquare,
  Camera,
  Plus,
  Check,
  X
} from "lucide-react";

interface Review {
  id: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'published' | 'pending' | 'edited';
  helpful: number;
  images?: string[];
}

const reviews: Review[] = [
  {
    id: 1,
    product: {
      id: 1,
      name: "Premium Leather Jacket",
      image: "https://placehold.co/100x100/1a1a1a/ffffff",
    },
    rating: 5,
    title: "Absolutely love this jacket!",
    comment: "The quality is outstanding. The leather is soft and the fit is perfect. Been wearing it for a month now and it still looks brand new. Highly recommend for anyone looking for a premium leather jacket.",
    date: "2026-05-10",
    status: "published",
    helpful: 24,
    images: [
      "https://placehold.co/80x80/EEE/333",
      "https://placehold.co/80x80/DDD/333",
    ],
  },
  {
    id: 2,
    product: {
      id: 2,
      name: "Wireless Noise Cancelling Headphones",
      image: "https://placehold.co/100x100/2a2a2a/ffffff",
    },
    rating: 4,
    title: "Great sound, decent battery",
    comment: "Sound quality is amazing for the price. Noise cancellation works well in most environments. Battery life could be better, but overall very satisfied with the purchase.",
    date: "2026-05-05",
    status: "published",
    helpful: 18,
  },
  {
    id: 3,
    product: {
      id: 3,
      name: "Classic White Sneakers",
      image: "https://placehold.co/100x100/3a3a3a/ffffff",
    },
    rating: 3,
    title: "Good but runs small",
    comment: "The sneakers look great and are comfortable, but they run a bit small. Had to exchange for a larger size. The return process was smooth though.",
    date: "2026-04-28",
    status: "published",
    helpful: 12,
  },
  {
    id: 4,
    product: {
      id: 4,
      name: "Minimalist Watch",
      image: "https://placehold.co/100x100/4a4a4a/ffffff",
    },
    rating: 5,
    title: "Elegant and precise",
    comment: "Beautiful design and keeps perfect time. The minimalist look goes with everything. Got many compliments already!",
    date: "2026-04-20",
    status: "published",
    helpful: 31,
    images: [
      "https://placehold.co/80x80/EEE/333",
    ],
  },
  {
    id: 5,
    product: {
      id: 5,
      name: "Organic Cotton T-Shirt",
      image: "https://placehold.co/100x100/5a5a5a/ffffff",
    },
    rating: 4,
    title: "",
    comment: "Soft and comfortable. Great for everyday wear.",
    date: "2026-05-12",
    status: "pending",
    helpful: 0,
  },
];

const pendingReviews = [
  {
    id: 101,
    product: {
      id: 6,
      name: "Stainless Steel Water Bottle",
      image: "https://placehold.co/100x100/6a6a6a/ffffff",
    },
    orderDate: "2026-05-08",
    orderNumber: "ORD-20260508-007",
  },
  {
    id: 102,
    product: {
      id: 7,
      name: "Running Shoes Pro",
      image: "https://placehold.co/100x100/7a7a7a/ffffff",
    },
    orderDate: "2026-04-25",
    orderNumber: "ORD-20260425-008",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'to_review'>('published');
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStar, setHoveredStar] = useState<{ reviewId: number; star: number } | null>(null);

  const filteredReviews = reviews.filter(r => 
    r.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedReviews = filteredReviews.filter(r => r.status === 'published' || r.status === 'edited');
  const pendingApproval = filteredReviews.filter(r => r.status === 'pending');

  const averageRating = publishedReviews.length > 0
    ? (publishedReviews.reduce((acc, r) => acc + r.rating, 0) / publishedReviews.length).toFixed(1)
    : "0.0";

  const renderStars = (rating: number, reviewId?: number, interactive?: boolean) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const filled = interactive 
        ? (hoveredStar?.reviewId === reviewId ? starValue <= hoveredStar.star : starValue <= rating)
        : starValue <= rating;
      
      return (
        <Star
          key={index}
          className={`w-4 h-4 ${
            filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
          } ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''}`}
          onMouseEnter={() => interactive && setHoveredStar({ reviewId: reviewId!, star: starValue })}
          onMouseLeave={() => interactive && setHoveredStar(null)}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            {publishedReviews.length} published reviews • Average rating: {averageRating} ⭐
          </p>
        </div>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Published', count: publishedReviews.length, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Pending', count: pendingApproval.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'To Review', count: pendingReviews.length, icon: Edit3, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Helpful Votes', count: reviews.reduce((acc, r) => acc + r.helpful, 0), icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bg} rounded-lg p-3`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-gray-600">{stat.label}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">{stat.count}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {[
            { id: 'published', label: 'Published', count: publishedReviews.length },
            { id: 'pending', label: 'Pending Approval', count: pendingApproval.length },
            { id: 'to_review', label: 'To Review', count: pendingReviews.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Published Reviews */}
        {activeTab === 'published' && (
          <div className="divide-y divide-gray-100">
            {publishedReviews.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No reviews yet</h3>
                <p className="text-xs text-gray-500">Share your experience with products you've purchased</p>
              </div>
            ) : (
              publishedReviews.map((review) => (
                <div key={review.id} className="p-4 sm:p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <Link href={`/products/${review.product.id}`} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={review.product.image}
                        alt={review.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      {/* Product Name & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/products/${review.product.id}`}>
                            <h3 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1">
                              {review.product.name}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/dashboard/reviews/${review.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Review Title */}
                      {review.title && (
                        <h4 className="text-sm font-semibold text-gray-900 mt-2">
                          {review.title}
                        </h4>
                      )}

                      {/* Review Comment */}
                      <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                        {review.comment}
                      </p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {review.images.map((img, index) => (
                            <div key={index} className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                              <Image
                                src={img}
                                alt={`Review image ${index + 1}`}
                                width={56}
                                height={56}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {review.date}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <ThumbsUp className="w-2.5 h-2.5" />
                            {review.helpful} found helpful
                          </span>
                          {review.status === 'edited' && (
                            <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Edited</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pending Approval */}
        {activeTab === 'pending' && (
          <div className="divide-y divide-gray-100">
            {pendingApproval.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">No pending reviews</h3>
                <p className="text-xs text-gray-500">All your reviews have been published</p>
              </div>
            ) : (
              pendingApproval.map((review) => (
                <div key={review.id} className="p-4 sm:p-5">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={review.product.image}
                        alt={review.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{review.product.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{review.comment}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Under Review
                        </span>
                        <span className="text-[10px] text-gray-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* To Review */}
        {activeTab === 'to_review' && (
          <div className="divide-y divide-gray-100">
            {pendingReviews.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">All caught up!</h3>
                <p className="text-xs text-gray-500">You've reviewed all your purchased items</p>
              </div>
            ) : (
              pendingReviews.map((item) => (
                <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">
                        Ordered on {item.orderDate} • {item.orderNumber}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/reviews/write/${item.product.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-all flex-shrink-0"
                  >
                    <Edit3 className="w-3 h-3" />
                    Write Review
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Write Review Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Share Your Experience</h3>
              <p className="text-xs text-white/80 mt-0.5">Help other shoppers make informed decisions</p>
            </div>
          </div>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2 bg-white text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-50 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}