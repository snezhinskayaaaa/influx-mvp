import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { InfluencerStatus } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    const body = await request.json()
    const { status, isVerified, isFeatured, instagramFollowers, tiktokFollowers, youtubeSubscribers } = body

    if (status !== undefined) {
      const validStatuses: string[] = Object.values(InfluencerStatus)
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 },
        )
      }
    }

    const updateData: Record<string, unknown> = {}

    if (status !== undefined) {
      updateData.status = status as InfluencerStatus
    }
    if (isVerified !== undefined) {
      updateData.isVerified = Boolean(isVerified)
    }
    if (isFeatured !== undefined) {
      updateData.isFeatured = Boolean(isFeatured)
    }
    if (instagramFollowers !== undefined) {
      updateData.instagramFollowers = parseInt(String(instagramFollowers)) || 0
    }
    if (tiktokFollowers !== undefined) {
      updateData.tiktokFollowers = parseInt(String(tiktokFollowers)) || 0
    }
    if (youtubeSubscribers !== undefined) {
      updateData.youtubeSubscribers = parseInt(String(youtubeSubscribers)) || 0
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      )
    }

    const influencer = await prisma.influencer.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ influencer })
  } catch (error) {
    console.error('Failed to update influencer:', error)
    return NextResponse.json(
      { error: 'Failed to update influencer' },
      { status: 500 },
    )
  }
}
