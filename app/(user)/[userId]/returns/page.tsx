// app/dashboard/returns/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  RotateCcw, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search,
  Filter,
  Truck,
  Shield,
  AlertCircle,
  Info,
  ArrowRight,
  Calendar,
  RefreshCw,
  Plus
} from "lucide-react";

interface ReturnItem {
  id: number;
  returnNumber: string;
  orderNumber: string;
  product: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  };
  reason: string;
  status: 'pending' | 'approved' | 'in_transit' | 'received' | 'completed' | 'rejected';
  requestDate: string;
  updatedDate: string;
  refundAmount: number;
  refundMethod: string;
}

const returns: ReturnItem[] = [
  {
    id: 1,
    returnNumber: "RET-20260513-001",
    orderNumber: "ORD-20260505-003",
    product: {
      name: "Wireless Noise Cancelling Headphones",
      image: "https://placehold.co/100x100/1a1a1a/ffffff",
      quantity: 1,
      price: 3500,
    },
    reason: "Product is defective - Left earbud not working",
    status: "pending",
    requestDate: "2026-05-13",
    updatedDate: "2026-05-13",
    refundAmount: 3500,
    refundMethod: "Original Payment",
  },
  {
    id: 2,
    returnNumber: "RET-20260508-002",
    orderNumber: "ORD-20260428-004",
    product: {
      name: "Classic White Sneakers",
      image: "https://placehold.co/100x100/2a2a2a/ffffff",
      quantity: 1,
      price: 1499,
    },
    reason: "Wrong size - Ordered 42 but received 40",
    status: "approved",
    requestDate: "2026-05-08",
    updatedDate: "2026-05-10",
    refundAmount: 1499,
    refundMethod: "Original Payment",
  },
  {
    id: 3,
    returnNumber: "RET-20260420-003",
    orderNumber: "ORD-20260415-005",
    product: {
      name: "Premium Leather Jacket",
      image: "https://placehold.co/100x100/3a3a3a/ffffff",
      quantity: 1,
      price: 1999,
    },
    reason: "Changed mind - Item not as expected",
    status: "completed",
    requestDate: "2026-04-20",
    updatedDate: "2026-04-28",
    refundAmount: 1999,
    refundMethod: "bKash",
  },
  {
    id: 4,
    returnNumber: "RET-20260315-004",
    orderNumber: "ORD-20260310-006",
    product: {
      name: "Minimalist Watch",
      image: "https://placehold.co/100x100/4a4a4a/ffffff",
      quantity: 1,
      price: 3499,
    },
    reason: "Item arrived damaged",
    status: "rejected",
    requestDate: "2026-03-15",
    updatedDate: "2026-03-18",
    refundAmount: 3499,
    refundMethod: "Original Payment",
  },
];

const statusConfig: Record<string, { 
  icon: any; 
  label: string; 
  color: string; 
  bg: string; 
  border: string;
  dot: string;
}> = {
  pending: { 
    icon: Clock, 
    label: 'Pending Review', 
    color: 'text-amber-600', 
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  approved: { 
    icon: CheckCircle, 
    label: 'Approved', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  in_transit: { 
    icon: Truck, 
    label: 'In Transit', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  received: { 
    icon: Package, 
    label: 'Received', 
    color: 'text-indigo-600', 
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
  },
  completed: { 
    icon: CheckCircle, 
    label: 'Completed', 
    color: 'text-emerald-600', 
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  rejected: { 
    icon: XCircle, 
    label: 'Rejected', 
    color: 'text-red-600', 
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
};

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredReturns = returns
    .filter(r => activeFilter === 'all' || r.status === activeFilter)
    .filter(r => 
      r.returnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Returns</h1>
          <p className="text-sm text-gray-500 mt-1">Track your return requests</p>
        </div>
        <Link
          href="/dashboard/returns/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Return Request
        </Link>
      </div>

      {/* Return Policy Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Return Policy</h3>
            <div className="grid sm:grid-cols-3 gap-3 mt-3">
              {[
                { icon: RotateCcw, text: "7-day return window", desc: "From delivery date" },
                { icon: Package, text: "Free returns", desc: "On eligible items" },
                { icon: RefreshCw, text: "Quick refunds", desc: "Within 5-7 business days" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-indigo-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{item.text}</p>
                      <p className="text-[10px] text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by return number, order number, or product..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            All Returns ({returns.length})
          </button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = returns.filter(r => r.status === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === key
                    ? `${config.bg} ${config.color} ring-1 ring-current`
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Returns List */}
      <div className="space-y-3">
        {filteredReturns.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <RotateCcw className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No returns found</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
              {searchQuery 
                ? 'No returns match your search criteria'
                : 'You haven\'t made any return requests yet'
              }
            </p>
            <Link
              href="/dashboard/orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all"
            >
              <Package className="w-4 h-4" />
              View Orders
            </Link>
          </div>
        ) : (
          filteredReturns.map((returnItem) => {
            const status = statusConfig[returnItem.status];
            const StatusIcon = status.icon;

            return (
              <Link
                key={returnItem.id}
                href={`/dashboard/returns/${returnItem.id}`}
                className="block bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all group"
              >
                <div className="p-4 sm:p-5">
                  {/* Top Row - Status & Numbers */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.color} ${status.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">{returnItem.returnNumber}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0" />
                  </div>

                  {/* Product Info */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={returnItem.product.image}
                        alt={returnItem.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {returnItem.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Order: {returnItem.orderNumber} • Qty: {returnItem.product.quantity}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {returnItem.requestDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            BDT {returnItem.refundAmount}
                          </span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="mt-2 flex items-start gap-1.5">
                        <Info className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {returnItem.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline for Active Returns */}
                  {(returnItem.status === 'approved' || returnItem.status === 'in_transit' || returnItem.status === 'received') && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {[
                          { step: 'Approved', done: true },
                          { step: 'In Transit', done: returnItem.status === 'in_transit' || returnItem.status === 'received' },
                          { step: 'Received', done: returnItem.status === 'received' },
                          { step: 'Refunded', done: false },
                        ].map((step, index) => (
                          <div key={index} className="flex-1">
                            <div className="flex items-center gap-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                step.done ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {step.done ? <CheckCircle className="w-3 h-3" /> : index + 1}
                              </div>
                              <div className={`flex-1 h-0.5 ${step.done ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                            </div>
                            <p className="text-[9px] text-gray-500 mt-0.5 text-center">{step.step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/dashboard/orders"
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">View Orders</p>
            <p className="text-xs text-gray-500">Find items to return</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </Link>

        <Link
          href="/help/returns"
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Return Policy</p>
            <p className="text-xs text-gray-500">Learn about our return process</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = returns.filter(r => r.status === key).length;
          if (count === 0 && key !== 'pending') return null;
          const Icon = config.icon;
          return (
            <div key={key} className={`rounded-lg border p-3 ${config.bg} ${config.border}`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${config.color}`} />
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