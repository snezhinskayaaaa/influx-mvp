import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

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

    if (user.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({
        where: { userId: user.userId },
      })
      if (!brand) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
      }

      const where = { brandId: brand.id }
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            collaborations: {
              select: { id: true, status: true, agreedPrice: true, proposedPrice: true },
            },
            _count: { select: { collaborations: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.campaign.count({ where }),
      ])

      return NextResponse.json({
        campaigns,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    if (user.role === 'INFLUENCER') {
      const where = { status: 'ACTIVE' as const }
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          where,
          include: {
            brand: { select: { companyName: true, industry: true, profile: { select: { avatarUrl: true } } } },
            _count: { select: { collaborations: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.campaign.count({ where }),
      ])

      return NextResponse.json({
        campaigns,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    if (user.role === 'ADMIN') {
      const [campaigns, total] = await Promise.all([
        prisma.campaign.findMany({
          include: {
            brand: { select: { id: true, companyName: true, industry: true } },
            collaborations: {
              select: { id: true, status: true, agreedPrice: true },
            },
            _count: { select: { collaborations: true } },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.campaign.count(),
      ])

      return NextResponse.json({
        campaigns,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 })
  } catch (error) {
    console.error('GET /api/campaigns error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = await rateLimit(`campaign-create:${user.userId}`, 10, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Only brands can create campaigns' }, { status: 403 })
    }

    // Check email verification for financial/critical operations
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true },
    })
    if (!profile?.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before using this feature' }, { status: 403 })
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: user.userId },
    })
    if (!brand) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, budgetMin, budgetMax, desiredInfluencerCount, deliverables, status: requestedStatus } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (title.length > 500) {
      return NextResponse.json({ error: 'Title is too long' }, { status: 400 })
    }
    if (description && description.length > 5000) {
      return NextResponse.json({ error: 'Description is too long' }, { status: 400 })
    }
    if (!budgetMin || typeof budgetMin !== 'number' || budgetMin <= 0) {
      return NextResponse.json({ error: 'Minimum budget must be a positive number' }, { status: 400 })
    }
    if (!budgetMax || typeof budgetMax !== 'number' || budgetMax <= 0) {
      return NextResponse.json({ error: 'Maximum budget must be a positive number' }, { status: 400 })
    }
    if (budgetMax < budgetMin) {
      return NextResponse.json({ error: 'Maximum budget must be >= minimum budget' }, { status: 400 })
    }

    const budgetMinCents = Math.round(budgetMin * 100)
    const budgetMaxCents = Math.round(budgetMax * 100)

    const campaignStatus = requestedStatus === 'DRAFT' ? 'DRAFT' : 'ACTIVE'

    // For ACTIVE campaigns, warn if balance is low (not blocking — actual freeze happens at agree step)
    if (campaignStatus === 'ACTIVE' && brand.balance < budgetMinCents) {
      // Still allow creation, but balance will need to be topped up before collaborations are agreed
    }

    let parsedDeliverables: string[] = []
    if (typeof deliverables === 'string') {
      parsedDeliverables = deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
    } else if (Array.isArray(deliverables)) {
      parsedDeliverables = deliverables
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        title: title.trim(),
        description: description || null,
        budgetMin: budgetMinCents,
        budgetMax: budgetMaxCents,
        desiredInfluencerCount: desiredInfluencerCount || 1,
        deliverables: parsedDeliverables,
        status: campaignStatus,
        goal: body.goal || null,
        platforms: Array.isArray(body.platforms) ? body.platforms : [],
        contentFormats: Array.isArray(body.contentFormats) ? body.contentFormats : [],
        contentType: body.contentType || null,
        influencerNiches: Array.isArray(body.influencerNiches) ? body.influencerNiches : [],
        pricingModels: Array.isArray(body.pricingModels) ? body.pricingModels : [],
        targetViews: body.targetViews || null,
        targetClicks: body.targetClicks || null,
        targetEngagements: body.targetEngagements || null,
        productName: body.productName || null,
        productPrice: body.productPrice || null,
        productPhoto: body.productPhoto || null,
        productLink: body.productLink || null,
        productDescription: body.productDescription || null,
        brandTag: body.brandTag || null,
        hashtags: body.hashtags || null,
        creatorScript: body.creatorScript || null,
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    console.error('POST /api/campaigns error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
