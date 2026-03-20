import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const FOLLOWER_RANGES: Record<string, { gte: number; lt?: number }> = {
  micro: { gte: 10_000, lt: 50_000 },
  mid: { gte: 50_000, lt: 100_000 },
  macro: { gte: 100_000, lt: 500_000 },
  mega: { gte: 500_000 },
}

const SORT_OPTIONS: Record<string, Prisma.InfluencerOrderByWithRelationInput> = {
  followers: { instagramFollowers: 'desc' },
  engagement: { instagramEngagement: 'desc' },
  'price-low': { pricePerPost: 'asc' },
  'price-high': { pricePerPost: 'desc' },
  recent: { createdAt: 'desc' },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const search = searchParams.get('search')
    const niche = searchParams.get('niche')
    const followers = searchParams.get('followers')
    const sort = searchParams.get('sort') ?? 'followers'

    const where: Prisma.InfluencerWhereInput = {
      status: 'APPROVED',
    }

    if (search) {
      where.OR = [
        { handle: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (niche) {
      where.niche = { has: niche }
    }

    if (followers && FOLLOWER_RANGES[followers]) {
      const range = FOLLOWER_RANGES[followers]
      where.instagramFollowers = {
        gte: range.gte,
        ...(range.lt != null ? { lt: range.lt } : {}),
      }
    }

    const sortOrder = SORT_OPTIONS[sort] ?? SORT_OPTIONS.followers

    const influencers = await prisma.influencer.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, sortOrder],
      select: {
        id: true,
        handle: true,
        bio: true,
        niche: true,
        instagramFollowers: true,
        tiktokFollowers: true,
        instagramEngagement: true,
        pricePerPost: true,
        isVerified: true,
        isFeatured: true,
      },
    })

    return NextResponse.json({ influencers }, { status: 200 })
  } catch (error) {
    console.error('GET /api/influencers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch influencers' },
      { status: 500 },
    )
  }
}
