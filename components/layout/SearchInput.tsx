"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchValue.trim()) {
      params.set("query", searchValue.trim());
      console.log("Searching for:", searchValue);
    } else {
      params.delete("query");
    }
    
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  return (
    <div className="flex-1 max-w-2xl mx-4">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`relative transition-all duration-300 ${searchFocused ? "shadow-lg" : ""}`}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-28 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all bg-white text-gray-900 placeholder-gray-400"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-all text-xs font-medium flex items-center gap-1.5"
          >
            <Search size={12} />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}