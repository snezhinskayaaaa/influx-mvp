import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { SignJWT } from 'jose'
import { Resend } from 'resend'

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { email: true },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store code in a JWT that expires in 10 minutes
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    const codeToken = await new SignJWT({ code, purpose: 'admin-settings-change' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('10m')
      .sign(JWT_SECRET)

    // Send email with code
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@aiinflux.io'

      await resend.emails.send({
        from: FROM_EMAIL,
        to: profile.email,
        subject: 'Influx Admin - Settings Change Verification Code',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 16px;">Settings Change Verification</h1>
            <p style="color: #666; font-size: 16px; margin-bottom: 24px;">
              Your verification code for changing platform fee settings:
            </p>
            <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
            </div>
            <p style="color: #999; font-size: 14px;">
              This code expires in 10 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send admin code:', emailError)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, codeToken })
  } catch (error) {
    console.error('Send admin code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
