// app/dashboard/notifications/page.tsx
"use client";

import { useState } from "react";
import { 
  Bell, 
  BellOff, 
  Package, 
  Tag, 
  Heart, 
  MessageCircle, 
  Star, 
  AlertCircle,
  Check,
  Trash2,
  Settings,
  Clock,
  ChevronRight,
  Filter,
  Mail,
  Smartphone,
  Search,
  X,
  ShoppingBag,
  Gift,
  Truck,
  RefreshCw,
  Megaphone,
  Info
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: number;
  type: 'order' | 'promotion' | 'wishlist' | 'review' | 'system' | 'message';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  actionLabel?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order ORD-20260513-001 has been confirmed and is being processed.',
    time: '5 minutes ago',
    read: false,
    link: '/dashboard/orders/1',
    actionLabel: 'Track Order',
  },
  {
    id: 2,
    type: 'promotion',
    title: 'Flash Sale! 50% Off',
    message: 'Huge discount on electronics. Limited time offer. Grab your favorites now!',
    time: '1 hour ago',
    read: false,
    link: '/products?category=electronics',
    actionLabel: 'Shop Now',
  },
  {
    id: 3,
    type: 'wishlist',
    title: 'Price Drop Alert',
    message: 'Premium Leather Jacket from your wishlist is now 20% off. Don\'t miss out!',
    time: '3 hours ago',
    read: true,
    link: '/products/1',
    actionLabel: 'View Product',
  },
  {
    id: 4,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order ORD-20260510-002 has been shipped. Expected delivery by May 15.',
    time: '1 day ago',
    read: true,
    link: '/dashboard/orders/2',
    actionLabel: 'Track Package',
  },
  {
    id: 5,
    type: 'review',
    title: 'Review Request',
    message: 'How was your experience with Wireless Headphones? Leave a review and earn rewards!',
    time: '2 days ago',
    read: true,
    link: '/products/2/review',
    actionLabel: 'Write Review',
  },
  {
    id: 6,
    type: 'system',
    title: 'Password Changed',
    message: 'Your account password was changed successfully. If this wasn\'t you, contact support immediately.',
    time: '3 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'promotion',
    title: 'New Arrivals',
    message: 'Check out our latest collection of summer fashion. New styles added daily!',
    time: '4 days ago',
    read: true,
    link: '/products?category=fashion',
    actionLabel: 'Explore',
  },
  {
    id: 8,
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order ORD-20260505-003 has been delivered. Enjoy your purchase!',
    time: '5 days ago',
    read: true,
    link: '/dashboard/orders/3',
  },
];

const notificationTypeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  order: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Orders' },
  promotion: { icon: Tag, color: 'text-pink-600', bg: 'bg-pink-50', label: 'Promotions' },
  wishlist: { icon: Heart, color: 'text-red-600', bg: 'bg-red-50', label: 'Wishlist' },
  review: { icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Reviews' },
  system: { icon: Info, color: 'text-purple-600', bg: 'bg-purple-50', label: 'System' },
  message: { icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Messages' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [showActions, setShowActions] = useState<number | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications
    .filter(n => activeFilter === 'all' || n.type === activeFilter)
    .filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filterCounts = {
    all: notifications.length,
    order: notifications.filter(n => n.type === 'order').length,
    promotion: notifications.filter(n => n.type === 'promotion').length,
    wishlist: notifications.filter(n => n.type === 'wishlist').length,
    review: notifications.filter(n => n.type === 'review').length,
    system: notifications.filter(n => n.type === 'system').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up! No new notifications'
            }
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark All Read */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Mark All Read
            </button>
          )}

          {/* Clear All */}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
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
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {Object.entries(filterCounts).map(([key, count]) => {
            const config = key === 'all' 
              ? { icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50', label: 'All' }
              : notificationTypeConfig[key];
            const Icon = config.icon;
            const isActive = activeFilter === key;

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? `${config.bg} ${config.color} ring-1 ring-current`
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white' : 'bg-gray-200'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              {searchQuery ? (
                <Search className="w-10 h-10 text-gray-400" />
              ) : (
                <BellOff className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No notifications found' : 'No notifications yet'}
            </h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {searchQuery 
                ? `No notifications match "${searchQuery}"`
                : 'When you get notifications, they\'ll show up here'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = notificationTypeConfig[notification.type];
            const Icon = config.icon;

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border transition-all duration-200 relative ${
                  notification.read 
                    ? 'border-gray-100 hover:border-gray-200' 
                    : 'border-l-4 border-l-indigo-500 border-gray-100 shadow-sm'
                }`}
                onMouseEnter={() => setShowActions(notification.id)}
                onMouseLeave={() => setShowActions(null)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm ${notification.read ? 'font-medium text-gray-900' : 'font-semibold text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions */}
                        {showActions === notification.id && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-all"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(notification.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Time & Actions Row */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {notification.time}
                        </span>

                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                          >
                            {notification.actionLabel || 'View Details'}
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Notification Preferences Link */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Notification Preferences
                </p>
                <p className="text-xs text-gray-500">
                  Customize what notifications you receive
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email
                </span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />
                  Push
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </Link>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Unread', count: unreadCount, icon: Bell, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Orders', count: filterCounts.order, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Promotions', count: filterCounts.promotion, icon: Megaphone, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Total', count: notifications.length, icon: Bell, color: 'text-gray-600', bg: 'bg-gray-50' },
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
    </div>
  );
}