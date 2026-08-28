import { rateLimit } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { verifySync } from 'otplib'
import crypto from 'crypto'

/**
 * POST /api/auth/2fa/verify
 * Verify TOTP code and enable 2FA. Returns backup codes.
 * Body: { code: string }
 */
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(`2fa-verify:${ip}`, 5, 60000)
    if (!success) return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { code } = body as { code: string }

    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Enter a 6-digit code' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { totpSecret: true, totpEnabled: true },
    })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (!profile.totpSecret) return NextResponse.json({ error: 'Run setup first' }, { status: 400 })
    if (profile.totpEnabled) return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 })

    const isValid = verifySync({ token: code, secret: profile.totpSecret })
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 400 })
    }

    // Generate 8 backup codes
    const backupCodes = Array.from({ length: 8 }, () =>
      crypto.randomBytes(4).toString('hex').toUpperCase()
    )

    await prisma.profile.update({
      where: { id: user.userId },
      data: { totpEnabled: true, totpBackupCodes: backupCodes },
    })

    return NextResponse.json({ enabled: true, backupCodes })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json({ error: 'Failed to verify' }, { status: 500 })
  }
}
