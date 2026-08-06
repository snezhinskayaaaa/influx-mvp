import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createToken, setAuthCookie } from '@/lib/auth'
import { verifySync } from 'otplib'

/**
 * POST /api/auth/2fa/google-verify
 * Verify 2FA code for Google OAuth users (no password needed).
 * Body: { email: string, totpCode: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, totpCode } = body as { email: string; totpCode: string }

    if (!email || !totpCode) {
      return NextResponse.json({ error: 'Email and 2FA code required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!profile || !profile.totpEnabled || !profile.totpSecret) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const isValidTotp = verifySync({ token: totpCode, secret: profile.totpSecret })
    const isBackupCode = !isValidTotp && profile.totpBackupCodes.includes(totpCode.toUpperCase())

    if (!isValidTotp && !isBackupCode) {
      return NextResponse.json({ error: 'Invalid 2FA code' }, { status: 401 })
    }

    if (isBackupCode) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { totpBackupCodes: profile.totpBackupCodes.filter(c => c !== totpCode.toUpperCase()) },
      })
    }

    const token = await createToken({ userId: profile.id, role: profile.role })
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: { id: profile.id, email: profile.email, role: profile.role },
    })
  } catch (error) {
    console.error('Google 2FA verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
