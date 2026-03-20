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

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        brand: { select: { id: true, companyName: true, industry: true, userId: true } },
        collaborations: {
          include: {
            influencer: { select: { id: true, handle: true, instagramFollowers: true, pricePerPost: true, userId: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const isBrandOwner = campaign.brand.userId === user.userId
    const isCollaborator = campaign.collaborations.some(c => c.influencer.userId === user.userId)
    const isAdmin = user.role === 'ADMIN'

    if (!isBrandOwner && !isCollaborator && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ campaign })
  } catch (error) {
    console.error('GET /api/campaigns/[id] error:', error)
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

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { brand: { select: { userId: true } } },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (campaign.status !== 'DRAFT' && campaign.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Cannot update a completed or cancelled campaign' }, { status: 400 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description || null
    if (body.desiredInfluencerCount !== undefined) updateData.desiredInfluencerCount = body.desiredInfluencerCount
    if (body.status !== undefined) updateData.status = body.status
    if (body.budgetMin !== undefined) updateData.budgetMin = Math.round(body.budgetMin * 100)
    if (body.budgetMax !== undefined) updateData.budgetMax = Math.round(body.budgetMax * 100)

    if (body.deliverables !== undefined) {
      if (typeof body.deliverables === 'string') {
        updateData.deliverables = body.deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      } else if (Array.isArray(body.deliverables)) {
        updateData.deliverables = body.deliverables
      }
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ campaign: updated })
  } catch (error) {
    console.error('PATCH /api/campaigns/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
