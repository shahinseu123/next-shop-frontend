"use client";
import { ButtonPrimary } from "../utility/ButtonPrimary";
import {
  User,
  Languages,
  Headset,
  Heart,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Truck,
  Home,
  Gift,
  Info,
  PhoneCall,
  LogOut,
  ShoppingBag,
  Settings,
  Lock,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/logo.png";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import CartIcon from "../cart/CartIcon";
import { useCartStore } from "@/store/cartStore";

import { UserDropdown } from "../user/UserDropdown";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    console.log("Button clicked");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={14} /> },
    { name: "New Arrival", href: "/new-arrival", icon: <Sparkles size={14} /> },
    { name: "Promotions", href: "/promotions", icon: <Gift size={14} /> },
    { name: "About Us", href: "/about-us", icon: <Info size={14} /> },
    { name: "Contact", href: "/contact", icon: <PhoneCall size={14} /> },
  ];

  return (
    <>
      {/* Top Bar - Not Sticky */}
      {/* <div className="bg-gray-50 border-b border-gray-200 text-gray-700 py-2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1.5">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-gray-400" />
              <p className="text-[10px] md:text-xs tracking-wide text-gray-600">
                Welcome to ShopHub - Premium Quality Products
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Truck size={11} className="text-gray-400" />
                <span className="text-[10px] hidden md:inline text-gray-600">
                  Free Shipping on Orders $50+
                </span>
              </div>
              <div className="w-px h-3 bg-gray-300 hidden md:block"></div>
              <span className="text-[10px] text-gray-600">24/7 Support</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Second Header Row - Not Sticky */}
      {/* <div className="bg-white border-b border-gray-200 py-1.5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-gray-500" />
              <p className="text-[11px] text-gray-600">
                ✨ Free Express Shipping on orders over $50
              </p>
            </div>
            <div className="flex items-center gap-1">
              <ButtonPrimary
                title="My Account"
                icon={<User size={13} strokeWidth={1.8} />}
                variant="text"
                bgColor="#6B7280"
                onClick={handleClick}
                size="sm"
              />
              <div className="w-px h-3 bg-gray-300"></div>
              <ButtonPrimary
                title="Wishlist"
                icon={<Heart size={13} strokeWidth={1.8} />}
                variant="text"
                bgColor="#6B7280"
                onClick={handleClick}
                size="sm"
              />
              <div className="w-px h-3 bg-gray-300"></div>
              <ButtonPrimary
                title="English"
                icon={<Languages size={12} strokeWidth={1.8} />}
                variant="solid"
                bgColor="#E5E7EB"
                onClick={handleClick}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header - Sticky */}
      <div style={{ width: 'calc(100% - 20%)', left: '20%' }} className="fixed top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <Image
                  src={LogoImage}
                  alt="Logo"
                  height={38}
                  className="object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  ShopHub
                </h1>
                <p className="text-[8px] text-gray-400 tracking-wider">
                  PREMIUM STORE
                </p>
              </div>
            </Link>

            {/* Search Bar - Centered */}
            <div className="flex-1 max-w-md">
              <SearchInput />
            </div>

          

            {/* Contact & Cart */}
            <div className="flex items-center gap-4">
              {/* Call Support */}
              <div className="hidden md:flex items-center gap-2 group cursor-pointer">
                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-all duration-300">
                  <Headset size={20} color="#6B7280" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="uppercase text-[9px] font-semibold text-gray-400 tracking-wider">
                    Call Us Now
                  </div>
                  <div className="font-semibold text-xs text-gray-700">
                    +880 1307 692679
                  </div>
                </div>
              </div>

              {/* Shopping Cart */}
              <div className="flex items-center gap-2 group cursor-pointer relative">
                <CartIcon />
                <div className="hidden md:block">
                  <div className="uppercase text-[9px] font-semibold text-gray-400 tracking-wider">
                    Cart
                  </div>
                  <div className="font-medium text-xs text-gray-600">
                    {mounted && <span className="font-semibold text-gray-900">BDT {getTotal().toFixed(2)}</span>}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-gray-900" />
                ) : (
                  <Menu size={20} className="text-gray-900" />
                )}
              </button>
            </div>
              {/* User Dropdown - Replacing the old button */}
            <UserDropdown />
          </div>
          

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};