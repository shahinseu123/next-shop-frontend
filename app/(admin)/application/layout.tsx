"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  BarChart3,
  UserCog,
  Layers,
  ShoppingBag,
  Truck,
  DollarSign,
  Percent,
  Star,
  Archive,
  Gift,
  MessageSquare,
  Shield,
  Database,
  FileText,
  Bell,
  Globe,
  CreditCard,
  MapPin,
  Box,
  RefreshCw,
  Plus,
  Clock,
  CheckCircle,
  Image as ImageIcon,
  AlertCircle,
  Lock,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items with nested structure
  const navItems = [
    {
      name: "Dashboard",
      href: "/application/shop/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Catalog",
      icon: Package,
      isNested: true,
      children: [
        { name: "All Products", href: "/application/shop/admin/products", icon: Package },
        { name: "Add New Product", href: "/application/shop/admin/products/new", icon: Plus },
        { name: "Categories", href: "/application/shop/admin/categories", icon: Tag },
        { name: "Brands", href: "/application/shop/admin/brands", icon: Building2 },
        { name: "Attributes", href: "/application/shop/admin/attributes", icon: Layers },
        { name: "Reviews", href: "/application/shop/admin/reviews", icon: Star },
      ],
    },
    {
      name: "Sales",
      icon: ShoppingCart,
      isNested: true,
      children: [
        { name: "All Orders", href: "/application/shop/admin/orders", icon: ShoppingCart },
        { name: "Pending Orders", href: "/application/shop/admin/orders/pending", icon: Clock },
        { name: "Completed Orders", href: "/application/shop/admin/orders/completed", icon: CheckCircle },
        { name: "Returns", href: "/application/shop/admin/returns", icon: RefreshCw },
        { name: "Invoices", href: "/application/shop/admin/invoices", icon: FileText },
      ],
    },
    {
      name: "Customers",
      icon: Users,
      isNested: true,
      children: [
        { name: "All Customers", href: "/application/shop/admin/customers", icon: Users },
        { name: "Customer Groups", href: "/application/shop/admin/customer-groups", icon: UserCog },
        { name: "Address Book", href: "/application/shop/admin/addresses", icon: MapPin },
        { name: "Subscribers", href: "/application/shop/admin/subscribers", icon: Bell },
      ],
    },
    {
      name: "Marketing",
      icon: BarChart3,
      isNested: true,
      children: [
        { name: "Promotions", href: "/application/shop/admin/promotions", icon: Percent },
        { name: "Coupons", href: "/application/shop/admin/coupons", icon: Gift },
        { name: "Discount Rules", href: "/application/shop/admin/discounts", icon: DollarSign },
        { name: "Banners", href: "/application/shop/admin/banners", icon: ImageIcon },
        { name: "Newsletter", href: "/application/shop/admin/newsletter", icon: MessageSquare },
      ],
    },
    {
      name: "Inventory",
      icon: Box,
      isNested: true,
      children: [
        { name: "Stock Management", href: "/application/shop/admin/inventory", icon: Archive },
        { name: "Low Stock", href: "/application/shop/admin/inventory/low-stock", icon: AlertCircle },
        { name: "Stock Transfers", href: "/application/shop/admin/inventory/transfers", icon: Truck },
        { name: "Warehouses", href: "/application/shop/admin/warehouses", icon: Building2 },
      ],
    },
    {
      name: "Reports",
      icon: BarChart3,
      isNested: true,
      children: [
        { name: "Sales Report", href: "/application/shop/admin/reports/sales", icon: DollarSign },
        { name: "Product Report", href: "/application/shop/admin/reports/products", icon: Package },
        { name: "Customer Report", href: "/application/shop/admin/reports/customers", icon: Users },
        { name: "Inventory Report", href: "/application/shop/admin/reports/inventory", icon: Archive },
      ],
    },
    {
      name: "System",
      icon: Settings,
      isNested: true,
      children: [
        { name: "General Settings", href: "/application/shop/admin/settings", icon: Settings },
        { name: "Payment Methods", href: "/application/shop/admin/payments", icon: CreditCard },
        { name: "Shipping Methods", href: "/application/shop/admin/shipping", icon: Truck },
        { name: "Tax Settings", href: "/application/shop/admin/taxes", icon: Percent },
        { name: "Email Templates", href: "/application/shop/admin/email-templates", icon: MessageSquare },
        { name: "SEO Settings", href: "/application/shop/admin/seo", icon: Globe },
      ],
    },
    {
      name: "Users",
      icon: Shield,
      isNested: true,
      children: [
        { name: "Admin Users", href: "/application/shop/admin/users", icon: UserCog },
        { name: "Roles", href: "/application/shop/admin/roles", icon: Shield },
        { name: "Permissions", href: "/application/shop/admin/permissions", icon: Lock },
        { name: "Activity Logs", href: "/application/shop/admin/activity-logs", icon: FileText },
      ],
    },
  ];

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/application/shop/admin/login");
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col`}
      >
        {/* Logo - Fixed at top */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-base">Ecommerce Admin</span>
            </div>
          ) : (
            <ShoppingBag className="w-5 h-5 text-blue-400 mx-auto" />
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation - Scrollable middle section */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            if (item.isNested) {
              const isOpen = openMenus.includes(item.name);
              return (
                <div key={item.name} className="mb-1">
                  <button
                    onClick={() => sidebarOpen && toggleMenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      isOpen ? "bg-gray-800" : "hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                    </div>
                    {sidebarOpen && (
                      <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>
                  
                  {sidebarOpen && isOpen && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const active = isActive(child.href);
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{child.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            
            // Non-nested items
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 my-1 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-white" : "group-hover:text-white"}`} />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700 bg-gray-900">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 w-full text-gray-300 hover:bg-red-600 hover:text-white group`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0 group-hover:text-white" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-2.5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800">
                Welcome back, Admin
              </h1>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                {sidebarOpen && (
                  <>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">Admin User</p>
                      <p className="text-xs text-gray-500">admin@shop.com</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border">
                  <Link
                    href="/application/shop/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/application/shop/admin/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Notifications
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}