"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonPrimary } from "../utility/ButtonPrimary";
import { 
  Heart, 
  Settings, 
  ShoppingBag, 
  User, 
  UserCircle, 
  Lock, 
  LogOut,
  Loader2 
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { tokenService } from "@/lib/auth";

export const UserDropdown = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get auth state from store
  const { user, isAuthenticated, setUser, setAuthenticated } = useUserStore();

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear token from storage
      tokenService.clearToken();
      
      // Clear user state
      setUser(null);
      setAuthenticated(false);
      
      // Close dropdown
      setIsOpen(false);
      
      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.name || user.username || "User";
  };
  const getUserName = () => {
    if (!user) return "User";
    return user.username || "user";
  };

  // Get user email
  const getUserEmail = () => {
    if (!user) return "";
    return user.email || "";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // If not authenticated, show sign in button
  if (!isAuthenticated) {
    return (
      <ButtonPrimary
        title="Sign In"
        icon={<User size={18} strokeWidth={1.8} />}
        variant="text"
        bgColor="#6B7280"
        onClick={() => router.push("/login")}
        size="sm"
      />
    );
  }

  return (
    <div className="relative user-dropdown">
      {/* User Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
          <span className="text-xs font-medium text-white">
            {getUserInitials()}
          </span>
        </div>
        <span className="text-xs font-medium text-gray-700 hidden sm:inline">
          {getUserDisplayName()} 
        </span>
        <svg 
          className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-slideDown">
          {/* User Info */}
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {getUserEmail()}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <UserCircle size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span>My Profile</span>
            </Link>
            
            <Link
              href={`/${getUserName()}/orders`}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span>My Orders</span>
              <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">
                3
              </span>
            </Link>
            
            <Link
              href="/account/wishlist"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Heart size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span>Wishlist</span>
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <Link
              href="/account/settings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span>Account Settings</span>
            </Link>
            
            <Link
              href="/account/change-password"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <Lock size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
              <span>Change Password</span>
            </Link>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};