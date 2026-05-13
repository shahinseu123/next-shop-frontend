// app/dashboard/orders/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Package, 
  Search, 
  Filter, 
  ChevronRight,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RotateCcw,
  CreditCard,
  Banknote,
  Calendar,
  ChevronDown,
  SlidersHorizontal
} from "lucide-react";

// Mock data
const orders = [
  {
    id: 1,
    orderNumber: "ORD-20260513-001",
    date: "2026-05-13",
    status: "Processing",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    total: 1250,
    items: 3,
    images: [
      "https://placehold.co/60x60/EEE/31343C",
      "https://placehold.co/60x60/DDD/31343C",
      "https://placehold.co/60x60/CCC/31343C",
    ]
  },
  {
    id: 2,
    orderNumber: "ORD-20260510-002",
    date: "2026-05-10",
    status: "Shipped",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    total: 850,
    items: 2,
    images: [
      "https://placehold.co/60x60/EEE/31343C",
      "https://placehold.co/60x60/DDD/31343C",
    ]
  },
  {
    id: 3,
    orderNumber: "ORD-20260505-003",
    date: "2026-05-05",
    status: "Delivered",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    total: 2100,
    items: 5,
    images: [
      "https://placehold.co/60x60/EEE/31343C",
      "https://placehold.co/60x60/DDD/31343C",
      "https://placehold.co/60x60/CCC/31343C",
    ]
  },
  {
    id: 4,
    orderNumber: "ORD-20260428-004",
    date: "2026-04-28",
    status: "Cancelled",
    paymentMethod: "COD",
    paymentStatus: "Failed",
    total: 450,
    items: 1,
    images: [
      "https://placehold.co/60x60/EEE/31343C",
    ]
  },
  {
    id: 5,
    orderNumber: "ORD-20260420-005",
    date: "2026-04-20",
    status: "Delivered",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    total: 3200,
    items: 4,
    images: [
      "https://placehold.co/60x60/EEE/31343C",
      "https://placehold.co/60x60/DDD/31343C",
      "https://placehold.co/60x60/CCC/31343C",
      "https://placehold.co/60x60/AAA/31343C",
    ]
  },
];

// Status configurations
const orderStatusConfig: Record<string, { icon: any; color: string; bg: string; border: string; label: string }> = {
  Processing: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Processing" },
  Shipped: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Shipped" },
  Delivered: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Delivered" },
  Cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Cancelled" },
};

const paymentStatusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  Paid: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", label: "Paid" },
  Pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  Failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Failed" },
  Refunded: { icon: RotateCcw, color: "text-purple-600", bg: "bg-purple-50", label: "Refunded" },
};

const paymentMethodIcons: Record<string, any> = {
  COD: Banknote,
  Online: CreditCard,
};

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your orders</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order number..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 border rounded-lg transition-all ${showFilters ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Filter Chips */}
      {showFilters && (
        <div className="flex items-center gap-2 flex-wrap bg-white rounded-lg border border-gray-100 p-3">
          <span className="text-xs text-gray-500 mr-1">Filter by:</span>
          <button
            onClick={() => setStatusFilter(null)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
              !statusFilter ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Orders
          </button>
          {Object.entries(orderStatusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(statusFilter === key ? null : key)}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  statusFilter === key
                    ? `${config.bg} ${config.color} ${config.border}`
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Orders Grid */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-xs text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Start shopping to see your orders here'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = orderStatusConfig[order.status];
            const paymentConfig = paymentStatusConfig[order.paymentStatus];
            const StatusIcon = statusConfig.icon;
            const PaymentIcon = paymentConfig.icon;
            const MethodIcon = paymentMethodIcons[order.paymentMethod] || CreditCard;
            
            return (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="p-4 sm:p-5">
                  {/* Top Row - Order Info */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {order.orderNumber}
                          </h3>
                          {/* Status Chip */}
                          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                            <StatusIcon className="w-2.5 h-2.5" />
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.date}
                          </span>
                          <span className="text-xs text-gray-500">
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  </div>

                  {/* Bottom Row - Product Images, Payment & Total */}
                  <div className="flex items-end justify-between">
                    {/* Product Images */}
                    <div className="flex items-center gap-1">
                      {order.images.slice(0, 4).map((img, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative"
                        >
                          <Image
                            src={img}
                            alt={`Product ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {index === 3 && order.images.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white text-[10px] font-medium">+{order.images.length - 4}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Payment & Total */}
                    <div className="flex items-center gap-4">
                      {/* Payment Info Chips */}
                      <div className="hidden sm:flex items-center gap-2">
                        {/* Payment Method */}
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                          <MethodIcon className="w-2.5 h-2.5" />
                          {order.paymentMethod}
                        </span>
                        {/* Payment Status */}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${paymentConfig.bg} ${paymentConfig.color}`}>
                          <PaymentIcon className="w-2.5 h-2.5" />
                          {paymentConfig.label}
                        </span>
                      </div>
                      
                      {/* Total */}
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase">Total</p>
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          BDT {order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Payment Chips */}
                  <div className="flex sm:hidden items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <MethodIcon className="w-2.5 h-2.5" />
                      {order.paymentMethod}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${paymentConfig.bg} ${paymentConfig.color}`}>
                      <PaymentIcon className="w-2.5 h-2.5" />
                      {paymentConfig.label}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {/* Order Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(orderStatusConfig).map(([key, config]) => {
          const count = orders.filter(o => o.status === key).length;
          return (
            <div key={key} className={`rounded-lg border p-3 ${config.bg} ${config.border}`}>
              <div className="flex items-center gap-2">
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-xs font-medium text-gray-700">{config.label}</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}