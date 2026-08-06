import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser, comparePassword } from '@/lib/auth'

/**
 * POST /api/auth/2fa/disable
 * Disable 2FA. Requires password confirmation.
 * Body: { password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { password } = body as { password: string }

    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { passwordHash: true, totpEnabled: true },
    })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (!profile.totpEnabled) return NextResponse.json({ error: '2FA is not enabled' }, { status: 400 })

    const isValid = await comparePassword(password, profile.passwordHash)
    if (!isValid) return NextResponse.json({ error: 'Incorrect password' }, { status: 403 })

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
