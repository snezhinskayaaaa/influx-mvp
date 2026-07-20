import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { notifyBrandContentSubmitted, notifyBrandContentDelivered } from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(`collab-submit:${user.userId}`, 5, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const { id } = await params
    const body = await request.json()

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: { include: { brand: { select: { userId: true } } } },
        influencer: { select: { id: true, userId: true, handle: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    // Only the influencer on this collaboration can submit
    if (collaboration.influencer.userId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { contentUrl, publishedUrl } = body as { contentUrl?: string; publishedUrl?: string }

    // Submit draft content (IN_PROGRESS or REVISION -> CONTENT_REVIEW)
    if (collaboration.status === 'IN_PROGRESS' || collaboration.status === 'REVISION') {
      if (!contentUrl || typeof contentUrl !== 'string' || contentUrl.trim().length === 0) {
        return NextResponse.json({ error: 'contentUrl is required' }, { status: 400 })
      }

      const updated = await prisma.collaboration.update({
        where: { id },
        data: {
          contentUrl: contentUrl.trim(),
          status: 'CONTENT_REVIEW',
        },
      })

      // Fire-and-forget notification: draft submitted for review
      notifyBrandContentSubmitted(collaboration.campaign.brand.userId, collaboration.influencer.handle, collaboration.campaign.title)

      return NextResponse.json({ collaboration: updated })
    }

    // Submit published post (PUBLISHING -> DELIVERED)
    if (collaboration.status === 'PUBLISHING') {
      if (!publishedUrl || typeof publishedUrl !== 'string' || publishedUrl.trim().length === 0) {
        return NextResponse.json({ error: 'publishedUrl is required' }, { status: 400 })
      }

      const updated = await prisma.collaboration.update({
        where: { id },
        data: {
          publishedUrl: publishedUrl.trim(),
          status: 'DELIVERED',
          deliveredAt: new Date(),
        },
      })

      // Fire-and-forget notification: published content delivered
      notifyBrandContentDelivered(collaboration.campaign.brand.userId, collaboration.influencer.handle, collaboration.campaign.title)

      return NextResponse.json({ collaboration: updated })
    }

    return NextResponse.json(
      { error: `Cannot submit from status: ${collaboration.status}` },
      { status: 400 }
    )
  } catch (error) {
    console.error('POST /api/collaborations/[id]/submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
