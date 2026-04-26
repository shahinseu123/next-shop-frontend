// components/layout/AuthHeader.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Store, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoImage from "@/public/logo.png";

export const AuthHeader = ({ title = "Account", showBackButton = true }) => {
  const router = useRouter();

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="shop-container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative">
              <Image 
                src={LogoImage} 
                alt="Logo" 
                height={35} 
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white tracking-tight">
                ShopHub
              </h1>
              <p className="text-[8px] text-gray-500 tracking-wider">PREMIUM STORE</p>
            </div>
          </Link>

          {/* Title / Page Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Welcome to</p>
              <p className="text-sm font-semibold text-white">{title}</p>
            </div>
            
            {/* Back Button */}
            {showBackButton && (
              <button
                onClick={() => router.back()}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-300 group"
                aria-label="Go back"
              >
                <ArrowLeft size={18} className="text-gray-400 group-hover:text-white" />
              </button>
            )}
          </div>

          {/* Trust Badge (Optional) */}
          <div className="hidden md:flex items-center gap-2">
            <Shield size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">Secure Connection</span>
          </div>
        </div>
      </div>
    </header>
  );
};