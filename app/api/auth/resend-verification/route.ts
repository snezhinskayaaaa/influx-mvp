import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { SignJWT } from 'jose'

export async function POST() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
    })
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }
    if (profile.emailVerified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ userId: profile.id, purpose: 'email-verification' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET)

    await sendVerificationEmail(profile.email, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
