import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { SignJWT } from 'jose'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`forgot:${ip}`, 3, 300000) // 3 attempts per 5 minutes
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({ where: { email } })

    // Always return success even if email not found (prevent email enumeration)
    if (!profile) {
      return NextResponse.json({ success: true })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ userId: profile.id, purpose: 'password-reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    try {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail(email, token)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Still return success to prevent enumeration
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
