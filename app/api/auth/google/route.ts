import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createToken, hashPassword } from '@/lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const COOKIE_NAME = 'influx-token'

function getBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host') || 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  return `${protocol}://${host}`
}

function redirectWithCookie(url: string, token: string, isProduction: boolean): NextResponse {
  const response = NextResponse.redirect(url)
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return response
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const baseUrl = getBaseUrl(request)
  const REDIRECT_URI = `${baseUrl}/api/auth/google`
  const isProduction = process.env.NODE_ENV === 'production'

  if (!code) {
    return NextResponse.json({ error: 'Authorization code required' }, { status: 400 })
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      console.error('Google token exchange failed:', tokens)
      return NextResponse.redirect(`${baseUrl}/login?error=google_failed`)
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_email`)
    }

    const cleanEmail = googleUser.email.trim().toLowerCase()

    let profile = await prisma.profile.findUnique({ where: { email: cleanEmail } })

    if (profile) {
      if (!profile.emailVerified) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { emailVerified: true },
        })
      }

      const token = await createToken({ userId: profile.id, role: profile.role })

      const redirectPath = profile.role === 'ADMIN' ? '/admin'
        : profile.role === 'BRAND' ? '/dashboard/brand'
        : '/dashboard/influencer'

      return redirectWithCookie(`${baseUrl}${redirectPath}`, token, isProduction)
    }

    const userType = state || 'creator'
    const role = userType === 'brand' ? 'BRAND' : 'INFLUENCER'

    const randomPassword = crypto.randomUUID() + 'A1!'
    const passwordHash = await hashPassword(randomPassword)

    profile = await prisma.profile.create({
      data: {
        email: cleanEmail,
        passwordHash,
        fullName: googleUser.name || null,
        role: role as 'BRAND' | 'INFLUENCER',
        emailVerified: true,
        avatarUrl: googleUser.picture || null,
      },
    })

    try {
      if (role === 'BRAND') {
        await prisma.brand.create({
          data: {
            userId: profile.id,
            companyName: googleUser.name || 'My Company',
          },
        })
      } else {
        await prisma.influencer.create({
          data: {
            userId: profile.id,
            handle: cleanEmail.split('@')[0] + '_' + Math.random().toString(36).substring(2, 6),
            status: 'PENDING',
          },
        })
      }
    } catch (roleError) {
      await prisma.profile.delete({ where: { id: profile.id } })
      throw roleError
    }

    const token = await createToken({ userId: profile.id, role: profile.role })

    const redirectPath = role === 'BRAND' ? '/onboarding/brand' : '/onboarding/influencer'
    return redirectWithCookie(`${baseUrl}${redirectPath}`, token, isProduction)

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(`${baseUrl}/login?error=google_failed`)
  }
}
