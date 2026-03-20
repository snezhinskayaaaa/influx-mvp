import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: {
          include: { brand: { select: { id: true, companyName: true, industry: true, userId: true } } },
        },
        influencer: { select: { id: true, handle: true, instagramFollowers: true, pricePerPost: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    const isBrandOwner = collaboration.campaign.brand.userId === user.userId
    const isInfluencer = collaboration.influencer.userId === user.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isBrandOwner && !isInfluencer && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ collaboration })
  } catch (error) {
    console.error('GET /api/collaborations/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: { include: { brand: { select: { userId: true } } } },
        influencer: { select: { userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    const isBrandOwner = collaboration.campaign.brand.userId === user.userId
    const isInfluencer = collaboration.influencer.userId === user.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isBrandOwner && !isInfluencer && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    // Brand can set agreedPrice and brandAgreed, and accept application (NEGOTIATING)
    if (isBrandOwner || isAdmin) {
      if (body.agreedPrice !== undefined) {
        updateData.agreedPrice = Math.round(body.agreedPrice * 100)
      }
      if (body.brandAgreed !== undefined) {
        updateData.brandAgreed = body.brandAgreed
      }
      if (body.status === 'NEGOTIATING' && collaboration.status === 'APPLIED') {
        updateData.status = 'NEGOTIATING'
      }
    }

    // Influencer can set influencerAgreed
    if (isInfluencer || isAdmin) {
      if (body.influencerAgreed !== undefined) {
        updateData.influencerAgreed = body.influencerAgreed
      }
    }

    // Either party can cancel
    if (body.status === 'CANCELLED') {
      updateData.status = 'CANCELLED'
    }

    // Either party or admin can update deliverables
    if (body.deliverables !== undefined) {
      if (typeof body.deliverables === 'string') {
        updateData.deliverables = body.deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      } else if (Array.isArray(body.deliverables)) {
        updateData.deliverables = body.deliverables
      }
    }

    // Brand can move to IN_PROGRESS after agreement
    if (body.status === 'IN_PROGRESS' && collaboration.status === 'AGREED' && (isBrandOwner || isAdmin)) {
      updateData.status = 'IN_PROGRESS'
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ collaboration: updated })
  } catch (error) {
    console.error('PATCH /api/collaborations/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
