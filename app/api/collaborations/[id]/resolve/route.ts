import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { checkCampaignAutoComplete } from '@/lib/campaign-auto-complete'
import { notifyDisputeResolved } from '@/lib/notifications'

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

    const { success } = await rateLimit(`collab-resolve:${user.userId}`, 3, 60000)
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

    // Determine where the dispute came from
    let fromStatus = 'DELIVERED'
    try {
      const parsed = JSON.parse(collaboration.disputeReason || '{}')
      if (parsed.fromStatus) fromStatus = parsed.fromStatus
    } catch {}

    const isFromContentReview = fromStatus === 'CONTENT_REVIEW'
    const advancePaid = Math.round(collaboration.agreedPrice / 2)
    const remaining = collaboration.agreedPrice - advancePaid

    try {
      const result = await prisma.$transaction(async (tx) => {
        let disputeResultText: string

        if (isFromContentReview && decision === 'influencer') {
          // Dispute from CONTENT_REVIEW, in favor of KOL → unlock flow to PUBLISHING
          // No money moves — frozen stays, KOL proceeds to publish
          disputeResultText = 'Resolved in favor of creator: content approved, proceed to publication'

          return await tx.collaboration.update({
            where: { id },
            data: {
              status: 'PUBLISHING',
              disputeResult: disputeResultText,
              resolvedAt: new Date(),
            },
          })
        }

        // For all other cases: distribute the frozen remainder
        // Advance ALWAYS stays with KOL (work was done)

        const brand = await tx.brand.findUniqueOrThrow({
          where: { id: collaboration.campaign.brand.id },
          select: { frozenBalance: true },
        })
        if (brand.frozenBalance < remaining) {
          throw new Error('INSUFFICIENT_FROZEN_BALANCE')
        }

        if (decision === 'influencer') {
          // From DELIVERED: all remaining goes to KOL
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
              description: 'Dispute resolved in favor of creator: full remaining payment released',
              referenceId: collaboration.id,
            },
          })
          disputeResultText = 'Resolved in favor of creator: full remaining payment released'

        } else if (decision === 'brand') {
          // Frozen remainder → project. Advance stays with KOL.
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
              description: 'Dispute resolved in favor of project: frozen remainder returned (advance kept by creator)',
              referenceId: collaboration.id,
            },
          })
          disputeResultText = 'Resolved in favor of project: frozen remainder returned, advance kept by creator'

        } else {
          // Split: splitPercent% of frozen to KOL, rest to project
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
                description: `Dispute split: ${splitPercent}% of frozen remainder to creator`,
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
                description: `Dispute split: ${100 - splitPercent!}% of frozen remainder to project`,
                referenceId: collaboration.id,
              },
            })
          }

          disputeResultText = `Split: ${splitPercent}% of frozen to creator, ${100 - splitPercent!}% to project. Advance kept by creator.`
        }

        return await tx.collaboration.update({
          where: { id },
          data: {
            status: isFromContentReview ? 'CANCELLED' : 'RESOLVED',
            disputeResult: disputeResultText,
            resolvedAt: new Date(),
          },
        })
      })

      notifyDisputeResolved(
        collaboration.influencer.userId,
        collaboration.campaign.brand.userId,
        collaboration.campaign.title,
        result.disputeResult || 'Resolved'
      )

      if (!isFromContentReview || decision !== 'influencer') {
        await checkCampaignAutoComplete(collaboration.campaignId)
      }

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
