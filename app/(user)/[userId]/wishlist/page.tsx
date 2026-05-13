// app/dashboard/wishlist/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search,
  Grid3x3,
  List,
  SlidersHorizontal,
  X,
  ShoppingBag,
  ChevronDown
} from "lucide-react";

// Mock wishlist data
const initialWishlist = [
  {
    id: 1,
    name: "Premium Leather Jacket",
    brand: "Fashion House",
    price: 2500,
    discountPrice: 1999,
    discountPercentage: 20,
    image: "https://placehold.co/400x400/1a1a1a/ffffff",
    inStock: true,
    rating: 4.5,
    reviews: 128,
    addedDate: "2026-05-10",
  },
  {
    id: 2,
    name: "Wireless Noise Cancelling Headphones",
    brand: "AudioTech",
    price: 3500,
    discountPrice: null,
    discountPercentage: null,
    image: "https://placehold.co/400x400/2a2a2a/ffffff",
    inStock: true,
    rating: 4.8,
    reviews: 256,
    addedDate: "2026-05-08",
  },
  {
    id: 3,
    name: "Classic White Sneakers",
    brand: "StreetStep",
    price: 1800,
    discountPrice: 1499,
    discountPercentage: 17,
    image: "https://placehold.co/400x400/3a3a3a/ffffff",
    inStock: false,
    rating: 4.3,
    reviews: 89,
    addedDate: "2026-05-05",
  },
  {
    id: 4,
    name: "Minimalist Watch",
    brand: "TimeElegance",
    price: 4200,
    discountPrice: 3499,
    discountPercentage: 17,
    image: "https://placehold.co/400x400/4a4a4a/ffffff",
    inStock: true,
    rating: 4.7,
    reviews: 342,
    addedDate: "2026-04-28",
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    brand: "EcoWear",
    price: 800,
    discountPrice: null,
    discountPercentage: null,
    image: "https://placehold.co/400x400/5a5a5a/ffffff",
    inStock: true,
    rating: 4.2,
    reviews: 67,
    addedDate: "2026-04-20",
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle",
    brand: "HydroMax",
    price: 600,
    discountPrice: 499,
    discountPercentage: 17,
    image: "https://placehold.co/400x400/6a6a6a/ffffff",
    inStock: true,
    rating: 4.6,
    reviews: 193,
    addedDate: "2026-04-15",
  },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc' | 'name'>('date');
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setWishlist(prev => prev.filter(item => item.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const filteredAndSorted = wishlist
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.discountPrice || a.price) - (b.discountPrice || b.price);
        case 'price-desc':
          return (b.discountPrice || b.price) - (a.discountPrice || a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wishlist..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white cursor-pointer"
            >
              <option value="date">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <Grid3x3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredAndSorted.length === 0 && !searchQuery && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Save items you love to your wishlist. Review them anytime and make purchases easily.
          </p>
          <Link href="/">
            <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto">
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </button>
          </Link>
        </div>
      )}

      {/* No Search Results */}
      {filteredAndSorted.length === 0 && searchQuery && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No items found</h3>
          <p className="text-xs text-gray-500">
            No wishlist items match "{searchQuery}"
          </p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredAndSorted.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Product Image */}
              <Link href={`/products/${item.id}`} className="relative aspect-square bg-gray-50 block overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
                
                {/* Discount Badge */}
                {item.discountPercentage && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    -{item.discountPercentage}%
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                    className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                  {item.brand}
                </p>
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors mb-2">
                    {item.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400">({item.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    {item.discountPrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-900">BDT {item.discountPrice}</span>
                        <span className="text-xs text-gray-400 line-through">BDT {item.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">BDT {item.price}</span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!item.inStock}
                  className="w-full mt-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-1.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && filteredAndSorted.length > 0 && (
        <div className="space-y-3">
          {filteredAndSorted.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 ${
                removingId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex gap-4 p-4">
                {/* Product Image */}
                <Link href={`/products/${item.id}`} className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  {item.discountPercentage && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      -{item.discountPercentage}%
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                        {item.brand}
                      </p>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:text-indigo-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1.5 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'text-amber-400' : 'text-gray-200'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-400">({item.reviews} reviews)</span>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {item.discountPrice ? (
                        <>
                          <span className="text-lg font-bold text-gray-900">BDT {item.discountPrice}</span>
                          <span className="text-xs text-gray-400 line-through">BDT {item.price}</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">BDT {item.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!item.inStock && (
                        <span className="text-[10px] text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                      <button
                        disabled={!item.inStock}
                        className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-all flex items-center gap-1.5 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 mt-2">
                    Added on {new Date(item.addedDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {wishlist.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-gray-900">{wishlist.length}</p>
            <p className="text-[10px] text-gray-500">Total Items</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-emerald-600">{wishlist.filter(i => i.inStock).length}</p>
            <p className="text-[10px] text-gray-500">In Stock</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-100 p-3 text-center">
            <p className="text-lg font-bold text-red-500">{wishlist.filter(i => !i.inStock).length}</p>
            <p className="text-[10px] text-gray-500">Out of Stock</p>
          </div>
        </div>
      )}
    </div>
  );
}