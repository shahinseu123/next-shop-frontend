// components/user/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { 
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  Shield, 
  Bell, 
  RotateCcw, 
  Star,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  userId: number;
  userName?: string | null;
  onItemClick?: () => void;
  isMobile?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/[userId]', icon: LayoutDashboard },
  { name: 'Profile', href: '/[userId]/profile', icon: User },
  { name: 'Orders', href: '/[userId]/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/[userId]/wishlist', icon: Heart },
  { name: 'Addresses', href: '/[userId]/addresses', icon: MapPin },
  { name: 'Payment Methods', href: '/[userId]/payment-methods', icon: CreditCard },
  { name: 'Account Settings', href: '/[userId]/settings/account', icon: Settings },
  { name: 'Security', href: '/[userId]/settings/security', icon: Shield },
  { name: 'Notifications', href: '/[userId]/settings/notifications', icon: Bell },
  { name: 'Returns', href: '/[userId]/returns', icon: RotateCcw },
  { name: 'Reviews', href: '/[userId]/reviews', icon: Star },
];

export function UserSidebar({ userId, userName, onItemClick, isMobile = false }: SidebarProps) {
  const pathname = usePathname() || '';
  
  const getHref = (href: string) => href.replace('[userId]', String(userId));

  const isActive = (href: string) => {
    const fullHref = getHref(href);
    return pathname === fullHref;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* User Profile Section - Elegant minimal design */}
      <div className="px-6 py-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg shadow-sm">
              {userName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Welcome back</p>
            <p className="font-semibold text-gray-900 truncate text-base mt-0.5">
              {userName?.split(' ')[0] || 'Customer'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Clean and minimal */}
      <nav className="flex-1 px-4 py-6 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          const href = getHref(item.href);

          return (
            <Link
              key={item.name}
              href={href}
              onClick={onItemClick}
              className={`
                group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-200
                ${active 
                  ? 'bg-gray-100 text-gray-900' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon 
                  size={18} 
                  className={`transition-all duration-200 ${
                    active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className={`text-sm font-normal tracking-wide ${
                  active ? 'text-gray-900 font-medium' : 'text-gray-600'
                }`}>
                  {item.name}
                </span>
              </div>
              {active && (
                <ChevronRight size={14} className="text-gray-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Section - Subtle */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => {
            useUserStore.getState().logout();
            window.location.href = '/login';
          }}
          className="group flex items-center gap-3 w-full px-3 py-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="text-sm font-normal tracking-wide">Sign out</span>
        </button>
      </div>
    </div>
  );
}