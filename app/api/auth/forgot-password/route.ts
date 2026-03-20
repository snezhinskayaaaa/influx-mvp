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

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    const profile = await prisma.profile.findUnique({ where: { email: cleanEmail } })

    // Always return success even if email not found (prevent email enumeration)
    if (!profile) {
      return NextResponse.json({ success: true })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ userId: profile.id, purpose: 'password-reset', phash: profile.passwordHash.substring(0, 10) })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(JWT_SECRET)

    try {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail(cleanEmail, token)
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
