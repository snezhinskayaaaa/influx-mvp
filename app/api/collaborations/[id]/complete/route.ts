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

    if (collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
    }

    // Fully atomic: status update + fund transfer in one transaction
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Atomic status check — only complete if still AGREED or IN_PROGRESS
        const collabUpdate = await tx.collaboration.updateMany({
          where: {
            id,
            status: { in: ['AGREED', 'IN_PROGRESS'] },
          },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        })

        if (collabUpdate.count === 0) {
          throw new Error('INVALID_STATUS')
        }

        // Transfer funds
        await tx.brand.update({
          where: { id: collaboration.campaign.brand.id },
          data: { frozenBalance: { decrement: collaboration.agreedPrice! } },
        })

        await tx.influencer.update({
          where: { id: collaboration.influencer.id },
          data: { balance: { increment: collaboration.agreedPrice! } },
        })

        await tx.transaction.create({
          data: {
            userId: collaboration.campaign.brand.userId,
            type: 'CAMPAIGN_PAYOUT',
            amount: collaboration.agreedPrice!,
            description: 'Payment to influencer for collaboration',
            referenceId: id,
          },
        })

        await tx.transaction.create({
          data: {
            userId: collaboration.influencer.userId,
            type: 'CAMPAIGN_PAYOUT',
            amount: collaboration.agreedPrice!,
            description: 'Earnings from collaboration',
            referenceId: id,
          },
        })

        return await tx.collaboration.findUnique({ where: { id } })
      })

      return NextResponse.json({ collaboration: result })
    } catch (innerError) {
      if (innerError instanceof Error && innerError.message === 'INVALID_STATUS') {
        return NextResponse.json({ error: 'Collaboration already completed or not in valid state' }, { status: 400 })
      }
      throw innerError
    }
  } catch (error) {
    console.error('POST /api/collaborations/[id]/complete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
