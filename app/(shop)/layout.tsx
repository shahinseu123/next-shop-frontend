"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import CartDrawer from "@/components/cart/CartDrawer";
import { Toaster } from 'sonner';

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop view - fixed sidebar always visible
  if (!isMobile) {
    return (
      <div className="lg:flex" style={{ overflowX: 'hidden' }}>
        <aside 
          className="lg:fixed lg:left-0 lg:top-0 lg:h-screen overflow-y-auto bg-gray-50" 
          style={{ width: 'clamp(200px, 20%, 280px)', zIndex: 40 }}
        >
          <Sidebar />
        </aside>
        
        <div 
          className="flex-1" 
          style={{ 
            marginLeft: 'clamp(200px, 20%, 280px)',
            width: `calc(100% - clamp(200px, 20%, 280px))`,
            overflowX: 'hidden'
          }}
        >
          <Header />
          <main style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <div style={{ maxWidth: '100%' }}>
              {children}
            </div>
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <Toaster 
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
        />
      </div>
    );
  }

  // Mobile view - sidebar hidden, button to open
  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-full w-[280px] bg-gray-50 z-50 shadow-xl animate-slide-in">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Menu</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <Sidebar onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Mobile Content */}
      <Header />
      <main style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <div style={{ maxWidth: '100%' }}>
          {children}
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}