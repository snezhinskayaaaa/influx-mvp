import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter and one number' }, { status: 400 })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    let payload
    try {
      const result = await jwtVerify(token, JWT_SECRET)
      payload = result.payload
    } catch {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (!payload.userId || payload.purpose !== 'password-reset') {
      return NextResponse.json({ error: 'Invalid reset token' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({ where: { id: payload.userId as string } })
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }
    // Check token was issued before any password change
    if (payload.phash !== profile.passwordHash.substring(0, 10)) {
      return NextResponse.json({ error: 'This reset link has already been used' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.profile.update({
      where: { id: payload.userId as string },
      data: { passwordHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
