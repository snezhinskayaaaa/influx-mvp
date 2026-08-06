import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { TOTP, generateSecret, generateURI } from 'otplib'
import QRCode from 'qrcode'

/**
 * POST /api/auth/2fa/setup
 * Generate TOTP secret and QR code for setup.
 * Does NOT enable 2FA yet — user must verify with a code first.
 */
export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { email: true, totpEnabled: true },
    })
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    if (profile.totpEnabled) return NextResponse.json({ error: '2FA is already enabled' }, { status: 400 })

    const secret = generateSecret()

    // Save secret (not yet enabled)
    await prisma.profile.update({
      where: { id: user.userId },
      data: { totpSecret: secret, totpEnabled: false },
    })

    const otpauth = generateURI({ issuer: 'Influx', label: profile.email, secret })
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth)

    return NextResponse.json({ secret, qrCode: qrCodeDataUrl })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json({ error: 'Failed to setup 2FA' }, { status: 500 })
  }
}
