import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="lg:flex" style={{ overflowX: 'hidden' }}>
      <aside 
        className="lg:fixed lg:left-0 lg:top-0 lg:h-screen overflow-y-auto bg-gray-50 " 
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
          <div className="" style={{ maxWidth: '100%' }}>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}