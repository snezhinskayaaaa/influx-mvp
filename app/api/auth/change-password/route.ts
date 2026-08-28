import { rateLimit } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser, hashPassword, comparePassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(`change-password:${ip}`, 3, 60000)
    if (!success) return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { currentPassword, newPassword } = body as { currentPassword: string; newPassword: string }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { passwordHash: true },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isValid = await comparePassword(currentPassword, profile.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 })
    }

    const newHash = await hashPassword(newPassword)
    await prisma.profile.update({
      where: { id: user.userId },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
