import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set. Please configure it before starting the application.');
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Paths that require authentication
const protectedPaths = ['/profile', '/chat', '/notifications'];

const authUserDefaultPath = '/chat/list';

// Paths that do not require authentication
const noAuthUserPaths = ['/', '/login', '/signup'];
const apiPaths = ['/api'];

const validPaths = [
  ...protectedPaths,
  ...noAuthUserPaths,
  ...apiPaths,
  '/404',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.match(/\.(jpg|png|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Check if the request is for a protected path
  const token = request.cookies.get('session-token')?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      isAuthenticated = false;
    }
  }

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isNoAuthUserPath = noAuthUserPaths.some(path => pathname === path);

  // Check if the path exists in our known routes
  const isKnownPath = validPaths.some(path => pathname === path || pathname.startsWith(path + '/'));

  if (!isKnownPath) {
    if (isAuthenticated) {
      // If authenticated, redirect to default path
      return NextResponse.redirect(new URL(authUserDefaultPath, request.url));
    } else {
      // If not authenticated, redirect to root page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // if authenticated, redirect to default path
  if (isAuthenticated && isNoAuthUserPath) {
    return NextResponse.redirect(new URL(authUserDefaultPath, request.url));
  }

  // if not authenticated and trying to access a protected path, redirect to login
  if (!isAuthenticated && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. Static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};