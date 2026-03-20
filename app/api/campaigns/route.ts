import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({
        where: { userId: user.userId },
      })
      if (!brand) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
      }

      const campaigns = await prisma.campaign.findMany({
        where: { brandId: brand.id },
        include: {
          collaborations: {
            select: { id: true, status: true, agreedPrice: true, proposedPrice: true },
          },
          _count: { select: { collaborations: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ campaigns })
    }

    if (user.role === 'INFLUENCER') {
      const campaigns = await prisma.campaign.findMany({
        where: { status: 'ACTIVE' },
        include: {
          brand: { select: { companyName: true, industry: true } },
          _count: { select: { collaborations: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ campaigns })
    }

    if (user.role === 'ADMIN') {
      const campaigns = await prisma.campaign.findMany({
        include: {
          brand: { select: { id: true, companyName: true, industry: true } },
          collaborations: {
            select: { id: true, status: true, agreedPrice: true },
          },
          _count: { select: { collaborations: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ campaigns })
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

    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Only brands can create campaigns' }, { status: 403 })
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: user.userId },
    })
    if (!brand) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, budgetMin, budgetMax, desiredInfluencerCount, deliverables } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
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

    if (brand.balance < budgetMinCents) {
      return NextResponse.json(
        { error: 'Insufficient balance. Please top up your wallet.' },
        { status: 400 },
      )
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
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    console.error('POST /api/campaigns error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
