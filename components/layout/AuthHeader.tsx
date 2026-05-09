"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Shield, Sparkles, ChevronLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoImage from "@/public/logo.png";

export const AuthHeader = ({ title = "Account", showBackButton = true }) => {
  const router = useRouter();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <Image 
                src={LogoImage} 
                alt="Logo" 
                height={35} 
                className="object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold text-gray-800 tracking-tight">
                ShopHub
              </h1>
              <p className="text-[8px] text-gray-400 tracking-wider">PREMIUM STORE</p>
            </div>
          </Link>

          {/* Title / Page Indicator */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <User size={14} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 tracking-wide">Current Page</p>
              <p className="text-sm font-semibold text-gray-800">{title}</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Trust Badges */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-full">
                <Shield size={11} className="text-indigo-500" />
                <span className="text-[10px] text-indigo-600 font-medium">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-full">
                <Sparkles size={11} className="text-amber-500" />
                <span className="text-[10px] text-amber-600 font-medium">Trusted Store</span>
              </div>
            </div>
            
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm group"
                aria-label="Go back"
              >
                <ChevronLeft size={14} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                <span className="text-xs text-gray-600 group-hover:text-gray-800 hidden sm:inline">Back</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};