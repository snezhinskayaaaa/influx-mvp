import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createToken, setAuthCookie, hashPassword } from '@/lib/auth'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  // Build redirect URI from the actual request URL (works in any environment)
  const REDIRECT_URI = `${url.origin}/api/auth/google`
  const state = url.searchParams.get('state') // contains userType for signup

  if (!code) {
    return NextResponse.json({ error: 'Authorization code required' }, { status: 400 })
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
  }

  try {
    // Exchange code for tokens
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
      return NextResponse.redirect(new URL('/login?error=google_failed', request.url))
    }

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const googleUser = await userRes.json()

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url))
    }

    const cleanEmail = googleUser.email.trim().toLowerCase()

    // Check if user exists
    let profile = await prisma.profile.findUnique({ where: { email: cleanEmail } })

    if (profile) {
      // Existing user — log them in
      // Mark email as verified (Google verified it)
      if (!profile.emailVerified) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { emailVerified: true },
        })
      }

      const token = await createToken({ userId: profile.id, role: profile.role })
      await setAuthCookie(token)

      const redirectUrl = profile.role === 'ADMIN' ? '/admin'
        : profile.role === 'BRAND' ? '/dashboard/brand'
        : '/dashboard/influencer'

      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // New user — create account
    // Parse state to get userType (brand or creator)
    const userType = state || 'creator'
    const role = userType === 'brand' ? 'BRAND' : 'INFLUENCER'

    // Generate a random password hash (user won't need it — they use Google)
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

    // Create role-specific record
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
      // If role-specific creation fails, clean up the profile
      await prisma.profile.delete({ where: { id: profile.id } })
      throw roleError
    }

    const token = await createToken({ userId: profile.id, role: profile.role })
    await setAuthCookie(token)

    // Redirect to onboarding for new users
    const redirectUrl = role === 'BRAND' ? '/onboarding/brand' : '/onboarding/influencer'
    return NextResponse.redirect(new URL(redirectUrl, request.url))

  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(new URL('/login?error=google_failed', request.url))
  }
}
