/**
 * Proxy for Route Protection
 * Handles authentication checks and role-based access control
 * Migrated from middleware.ts to proxy.ts for Next.js 16
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key'
);

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/settings',
  '/reservations',
];

// Role-based route access
const roleRoutes: Record<string, string[]> = {
  donor: ['/dashboard/donor', '/donations', '/my-donations'],
  receiver: ['/dashboard/receiver', '/reservations', '/explore-donations'],
  moderator: ['/dashboard/moderator', '/admin/reports', '/admin/users'],
  admin: ['/dashboard/admin', '/admin'],
};

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/login', '/auth/register', '/auth/error'];

/**
 * Get JWT token from cookies
 */
function getTokenFromCookie(request: NextRequest): string | null {
  const cookie = request.cookies.get('next-auth.session-token')?.value;
  if (!cookie) {
    return request.cookies.get('__Secure-next-auth.session-token')?.value || null;
  }
  return cookie;
}

/**
 * Decode and verify JWT token
 */
async function verifyToken(token: string): Promise<any> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = getTokenFromCookie(request);
  let session = null;

  if (token) {
    session = await verifyToken(token);
  }

  // Check if it's an auth route
  if (authRoutes.includes(pathname)) {
    if (session) {
      // Redirect authenticated users based on role
      const userRole = session.role || 'donor';
      const roleBaseUrl = roleRoutes[userRole]?.[0] || '/dashboard/donor';
      return NextResponse.redirect(new URL(roleBaseUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check if route requires authentication
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (session) {
    const userRole = session.role;

    // Check if user is trying to access a role-restricted dashboard
    const isDashboardAccess = pathname.startsWith('/dashboard/');
    if (isDashboardAccess) {
      const requestedRole = pathname.split('/')[2];
      if (requestedRole !== userRole) {
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }

    // Check if user is trying to access admin routes without permission
    if (pathname.startsWith('/admin') && userRole !== 'admin' && userRole !== 'moderator') {
      return NextResponse.redirect(new URL('/access-denied', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public|.*\\.png|.*\\.svg).*)',
  ],
};
