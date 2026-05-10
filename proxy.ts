// proxy.ts (place in project root, same level as app directory)
import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/orders', 
  '/wishlist',
  '/addresses',
  '/payment-methods',
  '/settings',
  '/returns',
  '/reviews',
];

// Auth routes (redirect to dashboard if already logged in)
const authRoutes = ['/login', '/register', '/forgot-password'];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies (adjust based on your auth implementation)
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;
  
  // Check if this is a user route (e.g., /123, /123/profile)
  const isUserRoute = /^\/(\d+)/.test(pathname);
  
  // Check if route needs protection
  const needsAuth = protectedRoutes.some(route => 
    pathname.includes(route)
  ) || isUserRoute;
  
  // Redirect to login if accessing protected route without auth
  if (needsAuth && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    const userId = request.cookies.get('user-id')?.value;
    if (userId) {
      return NextResponse.redirect(new URL(`/${userId}`, request.url));
    }
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes trigger the proxy
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};