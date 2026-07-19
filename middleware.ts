import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/auth-edge'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin', '/onboarding']

// Routes that require specific roles
const adminRoutes = ['/admin']
const brandRoutes = ['/dashboard/brand']
const influencerRoutes = ['/dashboard/influencer']

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup']

// API routes that do NOT require authentication
const publicApiRoutes = [
  '/api/health',
  '/api/webhooks',
  '/api/auth',
  '/api/cron',
]

// API routes that allow unauthenticated GET requests only
const publicGetApiRoutes = [
  '/api/influencers',
]

// HTTP methods that mutate state and require CSRF protection
const mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * Check whether the request is to a public API route that does not require auth.
 * Some routes (e.g. /api/influencers) are public only for GET requests.
 */
function isPublicApiRoute(pathname: string, method: string): boolean {
  if (publicApiRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return true
  }
  if (method === 'GET' && publicGetApiRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return true
  }
  return false
}

/**
 * CSRF protection: for mutation requests on API routes, verify that the
 * Origin header matches the Host header. This prevents cross-site request
 * forgery by ensuring the request originates from the same site.
 */
function verifyCsrf(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) {
    // Requests without an Origin header (e.g. server-to-server) are allowed
    // because browsers always send Origin on cross-origin mutation requests.
    return true
  }

  const host = request.headers.get('host')
  if (!host) {
    return false
  }

  try {
    const originHost = new URL(origin).host
    return originHost === host
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value
  const method = request.method

  // --- API route protection ---
  if (pathname.startsWith('/api/')) {
    // CSRF protection for mutation requests on all API routes
    if (mutationMethods.has(method) && !verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
    }

    // Public API routes skip auth check
    if (isPublicApiRoute(pathname, method)) {
      return NextResponse.next()
    }

    // All other API routes require a valid JWT
    const apiUser = token ? await verifyTokenEdge(token) : null
    if (!apiUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin API routes require ADMIN role
    if (pathname.startsWith('/api/admin/') && apiUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.next()
  }

  // --- Page route protection ---

  // Check if route needs protection
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Verify token if present
  const user = token ? await verifyTokenEdge(token) : null

  // Protected route without auth → redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Auth route with valid token → redirect to appropriate dashboard
  if (isAuthRoute && user) {
    const dashboardUrl = user.role === 'ADMIN'
      ? '/admin'
      : user.role === 'BRAND'
        ? '/dashboard/brand'
        : '/dashboard/influencer'
    return NextResponse.redirect(new URL(dashboardUrl, request.url))
  }

  // Admin routes → check admin role
  if (adminRoutes.some(route => pathname.startsWith(route)) && user && user.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Brand routes → check brand role
  if (brandRoutes.some(route => pathname.startsWith(route)) && user && user.role !== 'BRAND') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Influencer routes → check influencer role
  if (influencerRoutes.some(route => pathname.startsWith(route)) && user && user.role !== 'INFLUENCER') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup',
    '/api/:path*',
  ],
}
