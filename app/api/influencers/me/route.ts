import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })

    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer profile not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ influencer }, { status: 200 })
  } catch (error) {
    console.error('GET /api/influencers/me error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch influencer profile' },
      { status: 500 },
    )
  }
}

const STRING_FIELDS = [
  'handle',
  'bio',
  'location',
  'instagramHandle',
  'tiktokHandle',
  'youtubeHandle',
  'twitterHandle',
] as const

const ARRAY_FIELDS = [
  'niche',
  'languages',
  'pastCollaborations',
] as const

const INT_FIELDS = [
  'instagramFollowers',
  'tiktokFollowers',
  'youtubeSubscribers',
  'twitterFollowers',
] as const

const ENGAGEMENT_FIELDS = [
  'instagramEngagement',
  'tiktokEngagement',
  'youtubeEngagement',
] as const

const PRICE_FIELDS = [
  'pricePerPost',
  'pricePerStory',
  'pricePerVideo',
  'cpmMin',
  'cpmMax',
  'cpcMin',
  'cpcMax',
  'cpeMin',
  'cpeMax',
] as const

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    for (const field of STRING_FIELDS) {
      if (field in body) {
        updateData[field] = String(body[field] ?? '')
      }
    }

    for (const field of ARRAY_FIELDS) {
      if (field in body) {
        updateData[field] = Array.isArray(body[field]) ? body[field] : []
      }
    }

    for (const field of INT_FIELDS) {
      if (field in body) {
        const parsed = parseInt(body[field], 10)
        updateData[field] = Number.isFinite(parsed) ? parsed : 0
      }
    }

    for (const field of ENGAGEMENT_FIELDS) {
      if (field in body) {
        const parsed = parseFloat(body[field])
        updateData[field] = Number.isFinite(parsed) ? parsed : 0
      }
    }

    for (const field of PRICE_FIELDS) {
      if (field in body) {
        const dollars = parseFloat(body[field])
        updateData[field] = Number.isFinite(dollars)
          ? Math.round(dollars * 100)
          : 0
      }
    }

    if ('handle' in body) {
      const existing = await prisma.influencer.findUnique({
        where: { handle: String(body.handle) },
        select: { userId: true },
      })
      if (existing && existing.userId !== user.userId) {
        return NextResponse.json(
          { error: 'Handle is already taken' },
          { status: 409 },
        )
      }
    }

    const influencer = await prisma.influencer.update({
      where: { userId: user.userId },
      data: updateData,
    })

    return NextResponse.json({ influencer }, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/influencers/me error:', error)
    return NextResponse.json(
      { error: 'Failed to update influencer profile' },
      { status: 500 },
    )
  }
}
