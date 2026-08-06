import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, createToken, setAuthCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { verifySync } from 'otplib'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`login:${ip}`, 5, 60000) // 5 attempts per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const { email, password, totpCode } = body

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }
    if (password.length > 128) {
      return NextResponse.json(
        { success: false, error: 'Password must not exceed 128 characters' },
        { status: 400 }
      )
    }

    // Normalize email
    const cleanEmail = email.trim().toLowerCase()

    // Find user by email
    const profile = await prisma.profile.findUnique({
      where: { email: cleanEmail },
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Compare passwords
    const isValidPassword = await comparePassword(password, profile.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check 2FA if enabled
    if (profile.totpEnabled && profile.totpSecret) {
      if (!totpCode) {
        return NextResponse.json(
          { success: false, requires2FA: true, error: 'Two-factor authentication code required' },
          { status: 200 }
        )
      }
      // Check TOTP code
      const isValidTotp = verifySync({ token: totpCode, secret: profile.totpSecret })
      // Check backup codes
      const isBackupCode = !isValidTotp && profile.totpBackupCodes.includes(totpCode.toUpperCase())
      if (!isValidTotp && !isBackupCode) {
        return NextResponse.json(
          { success: false, requires2FA: true, error: 'Invalid 2FA code' },
          { status: 401 }
        )
      }
      // If backup code used, remove it
      if (isBackupCode) {
        await prisma.profile.update({
          where: { id: profile.id },
          data: { totpBackupCodes: profile.totpBackupCodes.filter(c => c !== totpCode.toUpperCase()) },
        })
      }
    }

    // Create token and set cookie
    const token = await createToken({ userId: profile.id, role: profile.role })
    await setAuthCookie(token)

    return NextResponse.json(
      {
        success: true,
        user: {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          emailVerified: profile.emailVerified,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
