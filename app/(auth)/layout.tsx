"use client";

import { AuthHeader } from "@/components/layout/AuthHeader";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname.includes("login")) return "Sign In";
    if (pathname.includes("register")) return "Create Account";
    return "Account";
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <AuthHeader title={getPageTitle()} showBackButton={true} />
      {/* <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"> */}
        {children}
      {/* </main> */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4">
        <div className="shop-container mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}