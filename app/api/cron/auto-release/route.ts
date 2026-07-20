import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { notifyBrandAutoRelease, notifyInfluencerPaymentReceived } from '@/lib/notifications'

const CRON_SECRET = process.env.CRON_SECRET

export async function POST(request: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { autoReleased: 0, autoExpired: 0, errors: [] as string[] }

  // 1. Auto-release: DELIVERED for more than 7 days → pay influencer
  try {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const staleDelivered = await prisma.collaboration.findMany({
      where: {
        status: 'DELIVERED',
        deliveredAt: { lte: sevenDaysAgo },
      },
      include: {
        campaign: {
          include: { brand: { select: { id: true, userId: true } } },
        },
        influencer: { select: { id: true, userId: true } },
      },
    })

    for (const collab of staleDelivered) {
      try {
        if (!collab.agreedPrice) continue

        const remaining = Math.round(collab.agreedPrice / 2)

        await prisma.$transaction([
          prisma.collaboration.update({
            where: { id: collab.id },
            data: { status: 'COMPLETED', completedAt: now },
          }),
          prisma.brand.update({
            where: { id: collab.campaign.brand.id },
            data: { frozenBalance: { decrement: remaining } },
          }),
          prisma.influencer.update({
            where: { id: collab.influencer.id },
            data: { balance: { increment: remaining } },
          }),
          prisma.transaction.create({
            data: {
              userId: collab.campaign.brand.userId,
              type: 'CAMPAIGN_PAYOUT_AUTO',
              amount: remaining,
              description: 'Auto-released: brand did not respond within 7 days',
              referenceId: collab.id,
            },
          }),
          prisma.transaction.create({
            data: {
              userId: collab.influencer.userId,
              type: 'CAMPAIGN_PAYOUT_AUTO',
              amount: remaining,
              description: 'Auto-released: payment received after 7-day window',
              referenceId: collab.id,
            },
          }),
        ])

        // Fire-and-forget notifications: auto-release completed
        notifyBrandAutoRelease(collab.campaign.brand.userId, collab.campaign.title, remaining)
        notifyInfluencerPaymentReceived(collab.influencer.userId, collab.campaign.title, remaining)

        results.autoReleased++
      } catch (err) {
        results.errors.push(`Auto-release failed for collab ${collab.id}: ${err instanceof Error ? err.message : 'unknown'}`)
      }
    }
  } catch (err) {
    results.errors.push(`Auto-release query failed: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  // 2. Auto-expire: AGREED for more than 14 days → cancel and unfreeze
  try {
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const staleAgreed = await prisma.collaboration.findMany({
      where: {
        status: 'AGREED',
        frozenAt: { lte: fourteenDaysAgo },
      },
      include: {
        campaign: {
          include: { brand: { select: { id: true, userId: true } } },
        },
      },
    })

    for (const collab of staleAgreed) {
      try {
        if (!collab.agreedPrice) continue

        await prisma.$transaction([
          prisma.collaboration.update({
            where: { id: collab.id },
            data: { status: 'CANCELLED' },
          }),
          prisma.brand.update({
            where: { id: collab.campaign.brand.id },
            data: {
              frozenBalance: { decrement: collab.agreedPrice },
              balance: { increment: collab.agreedPrice },
            },
          }),
          prisma.transaction.create({
            data: {
              userId: collab.campaign.brand.userId,
              type: 'CAMPAIGN_UNFREEZE',
              amount: collab.agreedPrice,
              description: 'Auto-cancelled: no activity for 14 days',
              referenceId: collab.id,
            },
          }),
        ])

        results.autoExpired++
      } catch (err) {
        results.errors.push(`Auto-expire failed for collab ${collab.id}: ${err instanceof Error ? err.message : 'unknown'}`)
      }
    }
  } catch (err) {
    results.errors.push(`Auto-expire query failed: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  // 3. Auto-resolve: DISPUTED for more than 14 days → release to influencer
  try {
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    const staleDisputed = await prisma.collaboration.findMany({
      where: {
        status: 'DISPUTED',
        disputedAt: { lte: fourteenDaysAgo },
      },
      include: {
        campaign: {
          include: { brand: { select: { id: true, userId: true } } },
        },
        influencer: { select: { id: true, userId: true } },
      },
    })

    for (const collab of staleDisputed) {
      try {
        if (!collab.agreedPrice) continue

        const remaining = Math.round(collab.agreedPrice / 2)

        await prisma.$transaction([
          prisma.collaboration.update({
            where: { id: collab.id },
            data: {
              status: 'RESOLVED',
              resolvedAt: now,
              disputeResult: 'Auto-resolved in favor of creator: admin did not respond within 14 days',
            },
          }),
          prisma.brand.update({
            where: { id: collab.campaign.brand.id },
            data: { frozenBalance: { decrement: remaining } },
          }),
          prisma.influencer.update({
            where: { id: collab.influencer.id },
            data: { balance: { increment: remaining } },
          }),
          prisma.transaction.create({
            data: {
              userId: collab.influencer.userId,
              type: 'DISPUTE_PAYOUT',
              amount: remaining,
              description: 'Auto-resolved: dispute decided in favor of creator after 14 days',
              referenceId: collab.id,
            },
          }),
        ])

        results.autoReleased++
      } catch (err) {
        results.errors.push(`Auto-resolve failed for collab ${collab.id}: ${err instanceof Error ? err.message : 'unknown'}`)
      }
    }
  } catch (err) {
    results.errors.push(`Auto-resolve query failed: ${err instanceof Error ? err.message : 'unknown'}`)
  }

  console.log(`[cron/auto-release] Released: ${results.autoReleased}, Expired: ${results.autoExpired}, Errors: ${results.errors.length}`)

  return NextResponse.json({
    ok: true,
    ...results,
    timestamp: now.toISOString(),
  })
}
