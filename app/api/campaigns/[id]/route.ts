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

    if (campaign.status === 'COMPLETED' || campaign.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Cannot update a completed or cancelled campaign' }, { status: 400 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    // Status changes with transition validation
    if (body.status !== undefined) {
      const validStatuses = ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] as const
      if (!(validStatuses as readonly string[]).includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status. Must be ACTIVE, PAUSED, COMPLETED, or CANCELLED' }, { status: 400 })
      }

      // Allowed transitions: ACTIVE can come from DRAFT or PAUSED; PAUSED can come from ACTIVE
      const allowed: Record<string, string[]> = {
        'ACTIVE': ['DRAFT', 'PAUSED'],
        'PAUSED': ['ACTIVE'],
        'COMPLETED': ['ACTIVE', 'PAUSED'],
        'CANCELLED': ['DRAFT', 'ACTIVE', 'PAUSED'],
      }
      if (!allowed[body.status]?.includes(campaign.status)) {
        return NextResponse.json(
          { error: `Cannot change status from ${campaign.status} to ${body.status}` },
          { status: 400 }
        )
      }
      updateData.status = body.status
    }

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length === 0) {
        return NextResponse.json({ error: 'Title must be a non-empty string' }, { status: 400 })
      }
      if (body.title.length > 500) {
        return NextResponse.json({ error: 'Title is too long' }, { status: 400 })
      }
      updateData.title = body.title.trim()
    }
    if (body.description !== undefined) {
      if (body.description && body.description.length > 5000) {
        return NextResponse.json({ error: 'Description is too long' }, { status: 400 })
      }
      updateData.description = body.description || null
    }
    if (body.desiredInfluencerCount !== undefined) updateData.desiredInfluencerCount = body.desiredInfluencerCount
    if (body.budgetMin !== undefined) {
      if (typeof body.budgetMin !== 'number' || body.budgetMin <= 0) {
        return NextResponse.json({ error: 'Minimum budget must be a positive number' }, { status: 400 })
      }
      updateData.budgetMin = Math.round(body.budgetMin * 100)
    }
    if (body.budgetMax !== undefined) {
      if (typeof body.budgetMax !== 'number' || body.budgetMax <= 0) {
        return NextResponse.json({ error: 'Maximum budget must be a positive number' }, { status: 400 })
      }
      updateData.budgetMax = Math.round(body.budgetMax * 100)
    }

    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null
    }
    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null
    }

    if (body.deliverables !== undefined) {
      if (typeof body.deliverables === 'string') {
        updateData.deliverables = body.deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      } else if (Array.isArray(body.deliverables)) {
        updateData.deliverables = body.deliverables
      }
    }

    // Project details & creator instructions
    if (body.productName !== undefined) updateData.productName = body.productName || null
    if (body.productPrice !== undefined) updateData.productPrice = body.productPrice || null
    if (body.productPhoto !== undefined) updateData.productPhoto = body.productPhoto || null
    if (body.productLink !== undefined) updateData.productLink = body.productLink || null
    if (body.productDescription !== undefined) updateData.productDescription = body.productDescription || null
    if (body.brandTag !== undefined) updateData.brandTag = body.brandTag || null
    if (body.hashtags !== undefined) updateData.hashtags = body.hashtags || null
    if (body.creatorScript !== undefined) updateData.creatorScript = body.creatorScript || null
    if (body.goal !== undefined) updateData.goal = body.goal || null
    if (body.platforms !== undefined) updateData.platforms = Array.isArray(body.platforms) ? body.platforms : []
    if (body.contentFormats !== undefined) updateData.contentFormats = Array.isArray(body.contentFormats) ? body.contentFormats : []
    if (body.contentType !== undefined) updateData.contentType = body.contentType || null
    if (body.influencerNiches !== undefined) updateData.influencerNiches = Array.isArray(body.influencerNiches) ? body.influencerNiches : []
    if (body.pricingModels !== undefined) updateData.pricingModels = Array.isArray(body.pricingModels) ? body.pricingModels : []
    if (body.targetViews !== undefined) updateData.targetViews = body.targetViews || null
    if (body.targetClicks !== undefined) updateData.targetClicks = body.targetClicks || null
    if (body.targetEngagements !== undefined) updateData.targetEngagements = body.targetEngagements || null

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
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

export async function DELETE(
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
        brand: { select: { userId: true } },
        collaborations: {
          where: {
            status: {
              in: ['APPLIED', 'INVITED', 'NEGOTIATING', 'AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED', 'DISPUTED'],
            },
          },
        },
      },
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (campaign.collaborations.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete campaign with active collaborations' },
        { status: 400 }
      )
    }

    await prisma.campaign.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('DELETE /api/campaigns/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
