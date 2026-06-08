import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, removeAuthCookie } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = rateLimit(`delete-account:${ip}`, 3, 900000) // 3 attempts per 15 minutes
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 })
    }

    const { confirmation } = await request.json()

    if (!confirmation || confirmation !== 'DELETE') {
      return NextResponse.json({ error: 'Please type "DELETE" to confirm account deletion' }, { status: 400 })
    }

    // Verify the user still exists before deleting
    const profile = await prisma.profile.findUnique({ where: { id: user.userId } })
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete the profile - Prisma cascade will handle related records
    await prisma.profile.delete({ where: { id: user.userId } })

    // Clear the auth cookie
    await removeAuthCookie()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
