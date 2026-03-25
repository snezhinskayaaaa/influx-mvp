import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getYouTubeStats } from '@/lib/youtube'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { youtubeUrl } = await request.json()

    if (!youtubeUrl || typeof youtubeUrl !== 'string') {
      return NextResponse.json({ error: 'YouTube URL is required' }, { status: 400 })
    }

    const stats = await getYouTubeStats(youtubeUrl)

    if (!stats) {
      return NextResponse.json({ error: `Could not find YouTube channel for "${youtubeUrl}". Make sure the URL is correct and the channel exists.` }, { status: 404 })
    }

    // Auto-update subscriber count in DB if user is an influencer
    if (user.role === 'INFLUENCER') {
      await prisma.influencer.updateMany({
        where: { userId: user.userId },
        data: { youtubeSubscribers: stats.subscriberCount },
      })
    }

    return NextResponse.json({
      subscribers: stats.subscriberCount,
      views: stats.viewCount,
      videos: stats.videoCount,
      title: stats.title,
      thumbnail: stats.thumbnail,
    })
  } catch (error) {
    console.error('YouTube stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch YouTube stats' }, { status: 500 })
  }
}
