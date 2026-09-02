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
    const { success } = await rateLimit(`delete-account:${ip}`, 3, 900000) // 3 attempts per 15 minutes
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

    // Check for active financial obligations
    if (profile.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({ where: { userId: user.userId }, select: { id: true, balance: true, frozenBalance: true } })
      if (brand && brand.balance > 0) {
        return NextResponse.json({ error: 'Cannot delete account with remaining balance. Please withdraw your funds first.' }, { status: 400 })
      }
      if (brand && brand.frozenBalance > 0) {
        return NextResponse.json({ error: 'Cannot delete account with frozen funds. Complete or cancel active collaborations first.' }, { status: 400 })
      }
      const activeCollabs = await prisma.collaboration.count({
        where: { campaign: { brandId: brand?.id }, status: { in: ['AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED'] } },
      })
      if (activeCollabs > 0) {
        return NextResponse.json({ error: 'Cannot delete account with active collaborations. Complete or cancel them first.' }, { status: 400 })
      }
    }
    if (profile.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({ where: { userId: user.userId }, select: { id: true, balance: true } })
      if (influencer && influencer.balance > 0) {
        return NextResponse.json({ error: 'Cannot delete account with remaining balance. Please withdraw your funds first.' }, { status: 400 })
      }
      if (influencer) {
        const activeCollabs = await prisma.collaboration.count({
          where: { influencerId: influencer.id, status: { in: ['AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED'] } },
        })
        if (activeCollabs > 0) {
          return NextResponse.json({ error: 'Cannot delete account with active collaborations. Complete or cancel them first.' }, { status: 400 })
        }
      }
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
