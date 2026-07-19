import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { success } = rateLimit(`collab-resolve:${user.userId}`, 3, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const { id } = await params
    const body = await request.json()

    const { decision, splitPercent } = body as {
      decision?: string
      splitPercent?: number
    }

    if (!decision || !['influencer', 'brand', 'split'].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision. Must be one of: influencer, brand, split' },
        { status: 400 }
      )
    }

    if (decision === 'split') {
      if (typeof splitPercent !== 'number' || splitPercent < 0 || splitPercent > 100) {
        return NextResponse.json(
          { error: 'splitPercent must be a number between 0 and 100' },
          { status: 400 }
        )
      }
    }

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: { include: { brand: { select: { id: true, userId: true } } } },
        influencer: { select: { id: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    if (collaboration.status !== 'DISPUTED') {
      return NextResponse.json(
        { error: 'Can only resolve disputes (status must be DISPUTED)' },
        { status: 400 }
      )
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
    }

    const remaining = Math.round(collaboration.agreedPrice / 2)

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Guard frozen balance
        const brand = await tx.brand.findUniqueOrThrow({
          where: { id: collaboration.campaign.brand.id },
          select: { frozenBalance: true },
        })
        if (brand.frozenBalance < remaining) {
          throw new Error('INSUFFICIENT_FROZEN_BALANCE')
        }

        let disputeResultText: string

        if (decision === 'influencer') {
          // All remaining goes to influencer
          await tx.brand.update({
            where: { id: collaboration.campaign.brand.id },
            data: { frozenBalance: { decrement: remaining } },
          })

          await tx.influencer.update({
            where: { id: collaboration.influencer.id },
            data: { balance: { increment: remaining } },
          })

          await tx.transaction.create({
            data: {
              userId: collaboration.influencer.userId,
              type: 'DISPUTE_PAYOUT',
              amount: remaining,
              description: 'Dispute resolved in favor of influencer',
              referenceId: collaboration.id,
            },
          })

          disputeResultText = 'Resolved in favor of influencer: full remaining payment released'
        } else if (decision === 'brand') {
          // All remaining goes back to brand
          await tx.brand.update({
            where: { id: collaboration.campaign.brand.id },
            data: {
              frozenBalance: { decrement: remaining },
              balance: { increment: remaining },
            },
          })

          await tx.transaction.create({
            data: {
              userId: collaboration.campaign.brand.userId,
              type: 'DISPUTE_REFUND',
              amount: remaining,
              description: 'Dispute resolved in favor of brand',
              referenceId: collaboration.id,
            },
          })

          disputeResultText = 'Resolved in favor of brand: frozen funds returned'
        } else {
          // Split: splitPercent% to influencer, rest to brand
          const influencerShare = Math.round(remaining * (splitPercent! / 100))
          const brandShare = remaining - influencerShare

          await tx.brand.update({
            where: { id: collaboration.campaign.brand.id },
            data: {
              frozenBalance: { decrement: remaining },
              balance: { increment: brandShare },
            },
          })

          if (influencerShare > 0) {
            await tx.influencer.update({
              where: { id: collaboration.influencer.id },
              data: { balance: { increment: influencerShare } },
            })

            await tx.transaction.create({
              data: {
                userId: collaboration.influencer.userId,
                type: 'DISPUTE_PAYOUT',
                amount: influencerShare,
                description: `Dispute resolved: ${splitPercent}% of remaining to influencer`,
                referenceId: collaboration.id,
              },
            })
          }

          if (brandShare > 0) {
            await tx.transaction.create({
              data: {
                userId: collaboration.campaign.brand.userId,
                type: 'DISPUTE_REFUND',
                amount: brandShare,
                description: `Dispute resolved: ${100 - splitPercent!}% of remaining to brand`,
                referenceId: collaboration.id,
              },
            })
          }

          disputeResultText = `Split resolution: ${splitPercent}% to influencer, ${100 - splitPercent!}% to brand`
        }

        return await tx.collaboration.update({
          where: { id },
          data: {
            status: 'RESOLVED',
            disputeResult: disputeResultText,
            resolvedAt: new Date(),
          },
        })
      })

      return NextResponse.json({ collaboration: result })
    } catch (txError) {
      if (txError instanceof Error && txError.message === 'INSUFFICIENT_FROZEN_BALANCE') {
        return NextResponse.json({ error: 'Insufficient frozen balance to resolve dispute' }, { status: 400 })
      }
      throw txError
    }
  } catch (error) {
    console.error('POST /api/collaborations/[id]/resolve error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
