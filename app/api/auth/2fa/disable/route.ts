import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser, comparePassword } from '@/lib/auth'
import { verifySync } from 'otplib'

/**
 * POST /api/auth/2fa/disable
 * Disable 2FA. Accepts password, TOTP code, or backup code.
 * Body: { code: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { code } = body as { code: string }

    if (!code) return NextResponse.json({ error: 'Enter your password, authenticator code, or backup code' }, { status: 400 })

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { passwordHash: true, totpEnabled: true, totpSecret: true, totpBackupCodes: true },
    })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (!profile.totpEnabled) return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 })

    // Try password
    const isPasswordValid = await comparePassword(code, profile.passwordHash)

    // Try TOTP code
    const isTotpValid = profile.totpSecret ? verifySync({ token: code, secret: profile.totpSecret }) : false

    // Try backup code
    const isBackupCode = profile.totpBackupCodes.includes(code.toUpperCase())

    if (!isPasswordValid && !isTotpValid && !isBackupCode) {
      return NextResponse.json({ error: 'Invalid password, code, or backup code' }, { status: 403 })
    }

    await prisma.profile.update({
      where: { id: user.userId },
      data: { totpEnabled: false, totpSecret: null, totpBackupCodes: [] },
    })

    return NextResponse.json({ disabled: true })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json({ error: 'Failed to disable 2FA' }, { status: 500 })
  }
}
