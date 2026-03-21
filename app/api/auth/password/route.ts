import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`password:${ip}`, 3, 60000) // 3 attempts per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })
    }

    // Check authentication
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || typeof currentPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Current password is required' },
        { status: 400 }
      )
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one uppercase letter and one number' },
        { status: 400 }
      )
    }

    // Find profile
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, profile.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword)

    await prisma.profile.update({
      where: { id: user.userId },
      data: { passwordHash: newPasswordHash },
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
