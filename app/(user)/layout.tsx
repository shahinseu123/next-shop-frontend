// app/(user)/[userId]/layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Menu, X } from 'lucide-react';
import { UserSidebar } from '@/components/user/UserSidebar';

interface UserLayoutProps {
  children: ReactNode;
}

function AuthenticatedLayout({ children, userId, userName, pathname }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 bottom-0 w-[20%] min-w-[200px] max-w-[280px] bg-white shadow-xl z-30 overflow-y-auto">
          <UserSidebar userId={userId} userName={userName} />
        </div>

        <div className="ml-[20%] w-[80%]">
          <main className="p-2 lg:p-2">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-2 lg:p-2">
                {children}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className={`
          fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <UserSidebar 
            userId={userId} 
            userName={userName} 
            onItemClick={() => setMobileMenuOpen(false)}
            isMobile={true}
          />
        </div>

        <div className="pt-2">
          <main className="p-1">
            <div className="bg-white rounded-2xl shadow-sm ">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

function LoadingLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="hidden lg:block">
        <div className="fixed left-0 top-0 bottom-0 w-[20%] min-w-[200px] max-w-[280px] bg-white shadow-xl z-30">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>

        <div className="ml-[20%] w-[80%]">
          <main className="p-2 lg:p-2">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-2 lg:p-2">
                <div className="animate-pulse space-y-4">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                  <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <div className="lg:hidden ">
        <main className="p-4">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function UserLayout({ children }: UserLayoutProps) {
  const [isClient, setIsClient] = useState(false);
  const getUserId = useUserStore((state) => state.getUserId);
  const getUserName = useUserStore((state) => state.getUserName);
  const userId = getUserId();
  const userName = getUserName();
  const pathname = usePathname() || '';
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingLayout />;
  }

  if (!userId) {
    router.push('/login');
    return <LoadingLayout />;
  }

  return (
    <AuthenticatedLayout
      children={children}
      userId={userId}
      userName={userName}
      pathname={pathname}
    />
  );
}