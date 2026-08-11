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
    const { status, isVerified, isFeatured, instagramFollowers, tiktokFollowers, youtubeSubscribers, twitterFollowers,
      twitterVerified, instagramVerified, tiktokVerified, youtubeVerified, telegramVerified,
      instagramAvgViews, tiktokAvgViews, youtubeAvgViews, twitterAvgViews, telegramFollowers, telegramAvgViews } = body

    if (status !== undefined) {
      const statusMap: Record<string, string> = {
        pending: 'PENDING', approved: 'APPROVED', rejected: 'REJECTED',
        PENDING: 'PENDING', APPROVED: 'APPROVED', REJECTED: 'REJECTED',
      }
      if (!statusMap[status]) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: pending, approved, rejected` },
          { status: 400 },
        )
      }
    }

    const updateData: Record<string, unknown> = {}

    if (status !== undefined) {
      const normalized = status.toUpperCase() as InfluencerStatus
      updateData.status = normalized
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
    if (twitterFollowers !== undefined) {
      updateData.twitterFollowers = parseInt(String(twitterFollowers)) || 0
    }
    if (twitterVerified !== undefined) updateData.twitterVerified = Boolean(twitterVerified)
    if (instagramVerified !== undefined) updateData.instagramVerified = Boolean(instagramVerified)
    if (tiktokVerified !== undefined) updateData.tiktokVerified = Boolean(tiktokVerified)
    if (youtubeVerified !== undefined) updateData.youtubeVerified = Boolean(youtubeVerified)
    if (telegramVerified !== undefined) updateData.telegramVerified = Boolean(telegramVerified)
    if (instagramAvgViews !== undefined) updateData.instagramAvgViews = parseInt(String(instagramAvgViews)) || 0
    if (tiktokAvgViews !== undefined) updateData.tiktokAvgViews = parseInt(String(tiktokAvgViews)) || 0
    if (youtubeAvgViews !== undefined) updateData.youtubeAvgViews = parseInt(String(youtubeAvgViews)) || 0
    if (twitterAvgViews !== undefined) updateData.twitterAvgViews = parseInt(String(twitterAvgViews)) || 0
    if (telegramFollowers !== undefined) updateData.telegramFollowers = parseInt(String(telegramFollowers)) || 0
    if (telegramAvgViews !== undefined) updateData.telegramAvgViews = parseInt(String(telegramAvgViews)) || 0

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
