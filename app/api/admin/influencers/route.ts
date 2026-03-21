import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { InfluencerStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}

    if (status) {
      const validStatuses: string[] = Object.values(InfluencerStatus)
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 },
        )
      }
      where.status = status as InfluencerStatus
    }

    if (search) {
      where.OR = [
        { handle: { contains: search, mode: 'insensitive' } },
        { profile: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    const [influencers, total] = await Promise.all([
      prisma.influencer.findMany({
        where,
        include: {
          profile: {
            select: {
              email: true,
              fullName: true,
            },
          },
          _count: {
            select: {
              collaborations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.influencer.count({ where }),
    ])

    return NextResponse.json({
      influencers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Failed to fetch influencers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch influencers' },
      { status: 500 },
    )
  }
}
