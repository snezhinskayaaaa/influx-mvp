import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/auth-edge'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/admin']

// Routes that require specific roles
const adminRoutes = ['/admin']
const brandRoutes = ['/dashboard/brand']
const influencerRoutes = ['/dashboard/influencer']

// Routes that should redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

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
    '/login',
    '/signup',
  ],
}
