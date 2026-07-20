import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData: Record<string, boolean> = {}

    if (typeof body.emailNotifications === 'boolean') {
      updateData.emailNotifications = body.emailNotifications
    }
    if (typeof body.campaignUpdates === 'boolean') {
      updateData.campaignUpdates = body.campaignUpdates
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const profile = await prisma.profile.update({
      where: { id: user.userId },
      data: updateData,
      select: { emailNotifications: true, campaignUpdates: true },
    })

    return NextResponse.json({ notifications: profile })
  } catch (error) {
    console.error('PATCH /api/profiles/me/notifications error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 },
    )
  }
}
