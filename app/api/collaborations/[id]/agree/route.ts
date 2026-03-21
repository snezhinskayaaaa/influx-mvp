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
          include: { brand: { select: { id: true, userId: true, balance: true, frozenBalance: true } } },
        },
        influencer: { select: { id: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    // Only brand owner or admin can trigger the freeze
    if (collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (collaboration.status !== 'NEGOTIATING') {
      return NextResponse.json({ error: 'Collaboration must be in negotiating status' }, { status: 400 })
    }

    if (!collaboration.brandAgreed || !collaboration.influencerAgreed) {
      return NextResponse.json({ error: 'Both parties must agree first' }, { status: 400 })
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'Agreed price must be set before confirming' }, { status: 400 })
    }

    const brand = collaboration.campaign.brand

    // Atomic: freeze balance, update collaboration status, and create audit log
    try {
      const result = await prisma.$transaction(async (tx) => {
        const brandUpdate = await tx.brand.updateMany({
          where: {
            id: brand.id,
            balance: { gte: collaboration.agreedPrice! },
          },
          data: {
            balance: { decrement: collaboration.agreedPrice! },
            frozenBalance: { increment: collaboration.agreedPrice! },
          },
        })

        if (brandUpdate.count === 0) {
          throw new Error('INSUFFICIENT_BALANCE')
        }

        const updated = await tx.collaboration.update({
          where: { id },
          data: { status: 'AGREED', frozenAt: new Date() },
        })

        await tx.transaction.create({
          data: {
            userId: brand.userId,
            type: 'CAMPAIGN_FREEZE',
            amount: collaboration.agreedPrice!,
            description: `Funds frozen for collaboration`,
            referenceId: collaboration.id,
          },
        })

        return updated
      })

      return NextResponse.json({ collaboration: result })
    } catch (txError) {
      if (txError instanceof Error && txError.message === 'INSUFFICIENT_BALANCE') {
        return NextResponse.json(
          { error: 'Insufficient balance to confirm this collaboration.' },
          { status: 400 },
        )
      }
      throw txError
    }
  } catch (error) {
    console.error('POST /api/collaborations/[id]/agree error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
