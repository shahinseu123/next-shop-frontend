// app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Package, 
  Clock, 
  ArrowRight, 
  User,
  Star,
  RotateCcw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ChevronRight,
  Bell,
  Gift,
  Truck
} from "lucide-react";

export default function DashboardPage() {
  // Mock data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    memberSince: "2024-01-15",
  };

  const stats = [
    { 
      label: "Total Orders", 
      value: 12, 
      change: "+3", 
      trend: "up", 
      icon: ShoppingBag, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/dashboard/orders"
    },
    { 
      label: "Wishlist", 
      value: 5, 
      change: "+2", 
      trend: "up", 
      icon: Heart, 
      color: "text-red-600", 
      bg: "bg-red-50",
      href: "/dashboard/wishlist"
    },
    { 
      label: "Reviews", 
      value: 8, 
      change: "+1", 
      trend: "up", 
      icon: Star, 
      color: "text-amber-600", 
      bg: "bg-amber-50",
      href: "/dashboard/reviews"
    },
    { 
      label: "Returns", 
      value: 1, 
      change: "0", 
      trend: "neutral", 
      icon: RotateCcw, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/dashboard/returns"
    },
  ];

  const recentOrders = [
    { id: 1, orderNumber: "ORD-20260513-001", date: "2026-05-13", status: "Processing", total: 1250, items: 3 },
    { id: 2, orderNumber: "ORD-20260510-002", date: "2026-05-10", status: "Shipped", total: 850, items: 2 },
    { id: 3, orderNumber: "ORD-20260505-003", date: "2026-05-05", status: "Delivered", total: 2100, items: 5 },
  ];

  const notifications = [
    { id: 1, text: "Your order ORD-20260513-001 is being processed", time: "5 min ago", type: "order" },
    { id: 2, text: "Flash sale! 50% off on electronics", time: "1 hour ago", type: "promotion" },
    { id: 3, text: "Price drop on your wishlist item", time: "3 hours ago", type: "wishlist" },
  ];

  const quickLinks = [
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart, color: "bg-red-50 text-red-600" },
    { label: "Addresses", href: "/dashboard/addresses", icon: MapPin, color: "bg-green-50 text-green-600" },
    { label: "Payment Methods", href: "/dashboard/payment-methods", icon: CreditCard, color: "bg-purple-50 text-purple-600" },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Returns", href: "/dashboard/returns", icon: RotateCcw, color: "bg-indigo-50 text-indigo-600" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-amber-50 text-amber-700 border-amber-200";
      case "Shipped": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 ring-4 ring-white/10">
              <span className="text-2xl sm:text-3xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user.name}! 👋</h1>
              <p className="text-sm text-white/80 mt-1">
                Member since {new Date(user.memberSince).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link
                  href="/dashboard/profile"
                  className="px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-all inline-flex items-center gap-1.5"
                >
                  <User className="w-3 h-3" />
                  Edit Profile
                </Link>
                <Link
                  href="/dashboard/orders"
                  className="px-3 py-1.5 bg-white/20 text-white text-xs font-medium rounded-lg hover:bg-white/30 transition-all inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3 h-3" />
                  My Orders
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{stats[0].value}</p>
              <p className="text-[10px] text-white/70">Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold">{stats[3].value}</p>
              <p className="text-[10px] text-white/70">Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-0.5 text-[10px] font-medium ${
                  stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-600" />
                Recent Orders
              </h2>
              <Link href="/dashboard/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.date} • {order.items} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {order.status}
                      </span>
                    </span>
                    <p className="text-sm font-semibold text-gray-900">BDT {order.total}</p>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
            {recentOrders.length === 0 && (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            )}
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all text-center group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2 ${link.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                    {link.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-600" />
                Notifications
              </h2>
              <Link href="/dashboard/notifications" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {notifications.map((notif) => (
                <div key={notif.id} className="px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                  <p className="text-xs text-gray-700 line-clamp-2">{notif.text}</p>
                  <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {notif.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-700 font-medium truncate ml-2">{user.email}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Member Since</span>
                <span className="text-gray-700 font-medium">Jan 2024</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Total Spent</span>
                <span className="text-gray-900 font-semibold">BDT 15,600</span>
              </div>
            </div>
            <Link
              href="/dashboard/profile"
              className="mt-4 w-full py-2 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3 h-3" />
              Manage Account
            </Link>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold">Get 10% Off Your Next Order</h3>
              <p className="text-xs text-white/80 mt-1">Use code WELCOME10 at checkout</p>
              <Link
                href="/"
                className="mt-3 px-4 py-1.5 bg-white text-amber-600 text-xs font-medium rounded-lg hover:bg-amber-50 transition-all inline-flex items-center gap-1.5"
              >
                Shop Now
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}