import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import {
  notifyInfluencerContentApproved,
  notifyInfluencerPaymentReceived,
  notifyInfluencerRevisionRequested,
  notifyInfluencerDisputeCreated,
} from '@/lib/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(`collab-review:${user.userId}`, 5, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const { id } = await params
    const body = await request.json()

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

    // Only the brand owner can review
    if (collaboration.campaign.brand.userId !== user.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const { action, note } = body as { action?: string; note?: string }

    if (!action || !['approve', 'request_revision', 'dispute'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: approve, request_revision, dispute' },
        { status: 400 }
      )
    }

    // --- APPROVE ---
    if (action === 'approve') {
      // Content approved -> move to PUBLISHING
      if (collaboration.status === 'CONTENT_REVIEW') {
        const updated = await prisma.collaboration.update({
          where: { id },
          data: { status: 'PUBLISHING' },
        })

        // Fire-and-forget notification: content approved
        notifyInfluencerContentApproved(collaboration.influencer.userId, collaboration.campaign.title)

        return NextResponse.json({ collaboration: updated })
      }

      // Delivered approved -> COMPLETED with final 50% payout
      if (collaboration.status === 'DELIVERED') {
        if (!collaboration.agreedPrice) {
          return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
        }

        const remainingPayout = Math.round(collaboration.agreedPrice / 2)

        try {
          const result = await prisma.$transaction(async (tx) => {
            // Guard frozen balance
            const brand = await tx.brand.findUniqueOrThrow({
              where: { id: collaboration.campaign.brand.id },
              select: { frozenBalance: true },
            })
            if (brand.frozenBalance < remainingPayout) {
              throw new Error('INSUFFICIENT_FROZEN_BALANCE')
            }

            await tx.brand.update({
              where: { id: collaboration.campaign.brand.id },
              data: { frozenBalance: { decrement: remainingPayout } },
            })

            await tx.influencer.update({
              where: { id: collaboration.influencer.id },
              data: { balance: { increment: remainingPayout } },
            })

            await tx.transaction.create({
              data: {
                userId: collaboration.campaign.brand.userId,
                type: 'CAMPAIGN_PAYOUT',
                amount: remainingPayout,
                description: 'Final 50% payment for completed collaboration',
                referenceId: collaboration.id,
              },
            })

            await tx.transaction.create({
              data: {
                userId: collaboration.influencer.userId,
                type: 'CAMPAIGN_PAYOUT',
                amount: remainingPayout,
                description: 'Final 50% earnings from collaboration',
                referenceId: collaboration.id,
              },
            })

            return await tx.collaboration.update({
              where: { id },
              data: {
                status: 'COMPLETED',
                completedAt: new Date(),
              },
            })
          })

          // Fire-and-forget notification: final payment received
          notifyInfluencerPaymentReceived(collaboration.influencer.userId, collaboration.campaign.title, remainingPayout)

          return NextResponse.json({ collaboration: result })
        } catch (txError) {
          if (txError instanceof Error && txError.message === 'INSUFFICIENT_FROZEN_BALANCE') {
            return NextResponse.json({ error: 'Insufficient frozen balance for payout' }, { status: 400 })
          }
          throw txError
        }
      }

      return NextResponse.json(
        { error: `Cannot approve from status: ${collaboration.status}` },
        { status: 400 }
      )
    }

    // --- REQUEST REVISION ---
    if (action === 'request_revision') {
      if (collaboration.status !== 'CONTENT_REVIEW') {
        return NextResponse.json(
          { error: 'Can only request revision from CONTENT_REVIEW status' },
          { status: 400 }
        )
      }

      if (collaboration.revisionCount >= 3) {
        return NextResponse.json({ error: 'Maximum revisions reached' }, { status: 400 })
      }

      const updated = await prisma.collaboration.update({
        where: { id },
        data: {
          status: 'REVISION',
          revisionNote: note ?? null,
          revisionCount: { increment: 1 },
        },
      })

      // Fire-and-forget notification: revision requested
      notifyInfluencerRevisionRequested(collaboration.influencer.userId, collaboration.campaign.title, note ?? '')

      return NextResponse.json({ collaboration: updated })
    }

    // --- DISPUTE ---
    if (action === 'dispute') {
      if (collaboration.status !== 'DELIVERED') {
        return NextResponse.json(
          { error: 'Can only dispute from DELIVERED status' },
          { status: 400 }
        )
      }

      const updated = await prisma.collaboration.update({
        where: { id },
        data: {
          status: 'DISPUTED',
          disputeReason: note ?? null,
          disputedAt: new Date(),
        },
      })

      // Fire-and-forget notification: dispute created
      notifyInfluencerDisputeCreated(collaboration.influencer.userId, collaboration.campaign.title, note ?? '')

      return NextResponse.json({ collaboration: updated })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('POST /api/collaborations/[id]/review error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
