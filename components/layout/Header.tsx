"use client";
import { ButtonPrimary } from "../utility/ButtonPrimary";
import { 
  User, 
  Languages, 
  Headset, 
  ShoppingCart, 
  Search, 
  Heart,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Truck,
  Home,
  Gift,
  Info,
  PhoneCall
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/logo.png";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeNav, setActiveNav] = useState("Home");
  
  const handleClick = () => {
    console.log("Button clicked");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log("Searching for:", searchValue);
    }
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
      {/* Top Bar - Dark Gray */}
      <div className="bg-gray-900 text-white py-2">
        <div className="shop-container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-1.5">
            <div className="flex items-center gap-2">
              <Sparkles size={11} className="text-gray-500" />
              <p className="text-[10px] md:text-xs tracking-wide text-gray-300">Welcome to ShopHub - Premium Quality Products</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Truck size={11} className="text-gray-500" />
                <span className="text-[10px] hidden md:inline text-gray-300">Free Shipping on Orders $50+</span>
              </div>
              <div className="w-px h-3 bg-gray-700 hidden md:block"></div>
              <span className="text-[10px] text-gray-300">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Header Row - Matching Dark Theme */}
      <div className="bg-gray-800 border-b border-gray-700 py-1.5">
        <div className="shop-container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1.5">
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-gray-400" />
              <p className="text-[11px] text-gray-300">✨ Free Express Shipping on orders over $50</p>
            </div>
            <div className="flex items-center gap-1">
              <ButtonPrimary
                title="My Account"
                icon={<User size={13} strokeWidth={1.8} />}
                variant="text"
                bgColor="#9CA3AF"
                onClick={handleClick}
                size="sm"
              />
              <div className="w-px h-3 bg-gray-600"></div>
              <ButtonPrimary
                title="Wishlist"
                icon={<Heart size={13} strokeWidth={1.8} />}
                variant="text"
                bgColor="#9CA3AF"
                onClick={handleClick}
                size="sm"
              />
              <div className="w-px h-3 bg-gray-600"></div>
              <ButtonPrimary
                title="English"
                icon={<Languages size={12} strokeWidth={1.8} />}
                variant="solid"
                bgColor="#6B7280"
                onClick={handleClick}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Dark Gray */}
      <div className="main-header bg-gray-900 shadow-lg sticky top-0 z-40 border-b border-gray-800">
        <div className="shop-container mx-auto px-4 py-2.5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <Image src={LogoImage} alt="Logo" height={38} className="object-contain brightness-0 invert" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  ShopHub
                </h1>
                <p className="text-[8px] text-gray-500 tracking-wider">PREMIUM STORE</p>
              </div>
            </Link>

            {/* Contact & Cart */}
            <div className="flex justify-end gap-4">
              {/* Call Support */}
              <div className="hidden md:flex items-center gap-2 group cursor-pointer">
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-all duration-300">
                  <Headset size={20} color="#9CA3AF" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="uppercase text-[9px] font-semibold text-gray-500 tracking-wider">Call Us Now</div>
                  <div className="font-semibold text-xs text-gray-300">+880 1307 692679</div>
                </div>
              </div>

              {/* Shopping Cart */}
              <div className="flex items-center gap-2 group cursor-pointer relative">
                <div className="p-1.5 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-all duration-300 relative">
                  <ShoppingCart size={20} color="#9CA3AF" strokeWidth={1.5} />
                  <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm">
                    0
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="uppercase text-[9px] font-semibold text-gray-500 tracking-wider">Cart</div>
                  <div className="font-medium text-xs text-gray-400">
                    <span className="font-semibold text-gray-300">$0.00</span>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Dark Gray, No White Borders */}
      <div className="bottom-header bg-gray-900">
        <div className="shop-container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center">
            <nav className="flex-1">
              <ul className="flex space-x-8">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      onClick={() => setActiveNav(link.name)}
                      className={`
                        group relative flex items-center gap-2 py-2.5 text-sm font-semibold transition-all duration-300
                        ${activeNav === link.name 
                          ? "text-white" 
                          : "text-gray-500 hover:text-gray-300"
                        }
                      `}
                    >
                      <span className={`
                        transition-all duration-300
                        ${activeNav === link.name ? "text-white" : "text-gray-600 group-hover:text-gray-400"}
                      `}>
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Search Bar */}
            <div className="flex items-center py-1.5 ml-8">
              <form onSubmit={handleSearch} className="relative">
                <div className={`relative transition-all duration-300 ${searchFocused ? 'w-96' : 'w-80'}`}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-28 py-2 text-sm border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-700 transition-all bg-gray-800 text-white placeholder-gray-500"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-4 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all text-xs font-medium flex items-center gap-1.5"
                  >
                    <Search size={12} />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 border-t border-gray-800 animate-slideDown">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        activeNav === link.name 
                          ? "bg-gray-800 text-white" 
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-300"
                      }`}
                      onClick={() => {
                        setActiveNav(link.name);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Mobile Search */}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-700 rounded-lg focus:outline-none focus:border-gray-600 bg-gray-800 text-white placeholder-gray-500 text-sm"
                  />
                  <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                  <button 
                    type="submit"
                    className="absolute right-1.5 top-1.5 px-3 py-1 bg-gray-700 text-white rounded-md text-xs font-medium hover:bg-gray-600 transition-all"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }
      `}</style>
    </>
  );
};