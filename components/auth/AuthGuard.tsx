"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { tokenService } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export function AuthGuard({ children, requiredRoles = [] }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useUserStore();
  const hasToken = tokenService.getToken();

  useEffect(() => {
    // If no token and not on login/register page, redirect to login
    if (!hasToken && !isAuthenticated && !isLoading) {
      if (!pathname.includes('/login') && !pathname.includes('/register')) {
        router.push('/login');
      }
      return;
    }

    // Check role-based access
    if (user && requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.includes(user.role || 'user');
      if (!hasRequiredRole) {
        router.push('/unauthorized');
      }
    }
  }, [hasToken, isAuthenticated, isLoading, router, pathname, user, requiredRoles]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated or on public routes, render children
  if (hasToken || isAuthenticated || pathname.includes('/login') || pathname.includes('/register')) {
    return <>{children}</>;
  }

  // Default: return null while redirecting
  return null;
}