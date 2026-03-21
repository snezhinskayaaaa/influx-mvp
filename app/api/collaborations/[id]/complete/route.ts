import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
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
          include: { brand: { select: { id: true, userId: true } } },
        },
        influencer: { select: { id: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    // Only brand owner or admin can mark as complete
    if (collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (collaboration.status !== 'AGREED' && collaboration.status !== 'IN_PROGRESS') {
      return NextResponse.json({ error: 'Collaboration must be agreed or in progress to complete' }, { status: 400 })
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
    }

    // Atomic: only complete if status is still AGREED or IN_PROGRESS
    const collabUpdate = await prisma.collaboration.updateMany({
      where: {
        id,
        status: { in: ['AGREED', 'IN_PROGRESS'] }
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    if (collabUpdate.count === 0) {
      return NextResponse.json({ error: 'Collaboration already completed or not in valid state' }, { status: 400 })
    }

    // Atomically transfer funds
    await prisma.$transaction([
      prisma.brand.update({
        where: { id: collaboration.campaign.brand.id },
        data: { frozenBalance: { decrement: collaboration.agreedPrice! } },
      }),
      prisma.influencer.update({
        where: { id: collaboration.influencer.id },
        data: { balance: { increment: collaboration.agreedPrice! } },
      }),
      prisma.transaction.create({
        data: {
          userId: collaboration.campaign.brand.userId,
          type: 'CAMPAIGN_PAYOUT',
          amount: collaboration.agreedPrice!,
          description: 'Payment to influencer for collaboration',
          referenceId: id,
        },
      }),
      prisma.transaction.create({
        data: {
          userId: collaboration.influencer.userId,
          type: 'CAMPAIGN_PAYOUT',
          amount: collaboration.agreedPrice!,
          description: 'Earnings from collaboration',
          referenceId: id,
        },
      }),
    ])

    const result = await prisma.collaboration.findUnique({ where: { id } })

    return NextResponse.json({ collaboration: result })
  } catch (error) {
    console.error('POST /api/collaborations/[id]/complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
