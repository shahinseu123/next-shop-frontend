// components/sidebar/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Toggle Button - No icons library needed */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 bg-blue-600 text-white text-2xl px-3 py-1 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={` fixed 
          bg-white dark:bg-gray-800 shadow-lg
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `fixed top-0 left-0 h-full z-40 w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : "relative w-64 flex-shrink-0"
          }
        `}
      >
        {children}
      </aside>
    </>
  );
}