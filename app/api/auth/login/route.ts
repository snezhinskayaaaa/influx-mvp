import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, createToken, setAuthCookie } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`login:${ip}`, 5, 60000) // 5 attempts per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many login attempts. Please wait a minute.' }, { status: 429 })
    }

    const body = await request.json()
    const { email, password } = body

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
