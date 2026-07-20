import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { notifyBrandNewApplication } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    if (user.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({
        where: { userId: user.userId },
      })
      if (!influencer) {
        return NextResponse.json({ error: 'Influencer profile not found' }, { status: 404 })
      }

      const where = { influencerId: influencer.id }
      const [collaborations, total] = await Promise.all([
        prisma.collaboration.findMany({
          where,
          include: {
            campaign: {
              include: { brand: { select: { companyName: true, industry: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.collaboration.count({ where }),
      ])

      return NextResponse.json({
        collaborations,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    if (user.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({
        where: { userId: user.userId },
      })
      if (!brand) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
      }

      const where = { campaign: { brandId: brand.id } }
      const [collaborations, total] = await Promise.all([
        prisma.collaboration.findMany({
          where,
          include: {
            campaign: { select: { id: true, title: true } },
            influencer: { select: { id: true, handle: true, instagramFollowers: true, pricePerPost: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.collaboration.count({ where }),
      ])

      return NextResponse.json({
        collaborations,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    if (user.role === 'ADMIN') {
      const [collaborations, total] = await Promise.all([
        prisma.collaboration.findMany({
          include: {
            campaign: { include: { brand: { select: { companyName: true } } } },
            influencer: { select: { id: true, handle: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.collaboration.count(),
      ])

      return NextResponse.json({
        collaborations,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 })
  } catch (error) {
    console.error('GET /api/collaborations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(`collab-apply:${user.userId}`, 10, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Only influencers can apply to campaigns' }, { status: 403 })
    }

    // Check email verification for financial/critical operations
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true },
    })
    if (!profile?.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before using this feature' }, { status: 403 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })
    if (!influencer) {
      return NextResponse.json({ error: 'Influencer profile not found' }, { status: 404 })
    }

    if (influencer.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Your profile must be approved to apply' }, { status: 403 })
    }

    const body = await request.json()
    const { campaignId, proposedPrice, message, deliverables } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }
    if (!proposedPrice || typeof proposedPrice !== 'number' || proposedPrice <= 0 || proposedPrice > 1000000) {
      return NextResponse.json({ error: 'Proposed price must be a positive number up to 1,000,000' }, { status: 400 })
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { brand: { select: { userId: true } } },
    })
    if (!campaign || campaign.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Campaign not found or not active' }, { status: 400 })
    }

    const existing = await prisma.collaboration.findUnique({
      where: { campaignId_influencerId: { campaignId, influencerId: influencer.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'You have already applied to this campaign' }, { status: 409 })
    }

    const proposedPriceCents = Math.round(proposedPrice * 100)

    let parsedDeliverables: string[] = []
    if (typeof deliverables === 'string') {
      parsedDeliverables = deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
    } else if (Array.isArray(deliverables)) {
      parsedDeliverables = deliverables
    }

    const collaboration = await prisma.collaboration.create({
      data: {
        campaignId,
        influencerId: influencer.id,
        proposedPrice: proposedPriceCents,
        message: message || null,
        deliverables: parsedDeliverables,
        status: 'APPLIED',
      },
    })

    // Fire-and-forget notification to the brand
    notifyBrandNewApplication(campaign.brand.userId, influencer.handle, campaign.title)

    return NextResponse.json({ collaboration }, { status: 201 })
  } catch (error) {
    console.error('POST /api/collaborations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
