import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyWithdrawalSignature } from '@/lib/0xprocessing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ignore test webhooks — log a warning in production
    if (body.Test === true) {
      if (process.env.NODE_ENV === 'production') {
        console.warn('Test webhook received in production, ignoring')
      }
      return NextResponse.json({ ok: true })
    }

    // Verify signature
    const isValid = verifyWithdrawalSignature({
      ID: body.ID,
      MerchantID: body.MerchantID,
      Address: body.Address,
      Currency: body.Currency,
      Signature: body.Signature,
    })

    if (!isValid) {
      console.error('Invalid withdrawal webhook signature', { ID: body.ID })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // ExternalID is our transaction.id; also try finding by externalId matching body.ID
    const transaction = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: body.ExternalID || undefined },
          { externalId: body.ID?.toString() },
        ],
      },
    })

    if (!transaction) {
      console.error('Transaction not found for withdrawal webhook', { ID: body.ID, ExternalID: body.ExternalID })
      return NextResponse.json({ ok: true })
    }

    // Idempotency: if already confirmed or failed, skip
    if (transaction.status === 'confirmed' || transaction.status === 'failed') {
      return NextResponse.json({ ok: true })
    }

    if (body.Status === 'Success') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'confirmed',
          externalStatus: 'Success',
          txHash: body.Hash || null,
          confirmedAt: new Date(),
        },
      })

      // Referral revenue share: 10% of platform fee to referrer (only on confirmed withdrawal)
      if (transaction.type === 'WITHDRAWAL' && transaction.fee > 0) {
        try {
          const influencer = await prisma.influencer.findUnique({
            where: { userId: transaction.userId },
            select: { id: true },
          })
          if (influencer) {
            const referral = await prisma.referral.findFirst({
              where: { referredId: influencer.id, status: 'active' },
              select: { id: true, referrerId: true, referrer: { select: { userId: true } } },
            })
            if (referral) {
              const revenueShare = Math.floor(transaction.fee * 0.1)
              if (revenueShare > 0) {
                await prisma.$transaction([
                  prisma.influencer.update({
                    where: { id: referral.referrerId },
                    data: { balance: { increment: revenueShare } },
                  }),
                  prisma.referral.update({
                    where: { id: referral.id },
                    data: { totalEarnings: { increment: revenueShare } },
                  }),
                  prisma.transaction.create({
                    data: {
                      userId: referral.referrer.userId,
                      type: 'REFERRAL_PAYOUT',
                      amount: revenueShare,
                      fee: 0,
                      status: 'confirmed',
                      description: `Referral revenue share (10% of $${(transaction.fee / 100).toFixed(2)} fee)`,
                      confirmedAt: new Date(),
                    },
                  }),
                ])
              }
            }
          }
        } catch (refError) {
          console.error('Referral revenue share failed:', refError)
        }
      }

      return NextResponse.json({ ok: true })
    }

    if (body.Status === 'Canceled') {
      // Refund balance — check both influencer and brand
      const influencer = await prisma.influencer.findUnique({
        where: { userId: transaction.userId },
      })
      const brand = await prisma.brand.findUnique({
        where: { userId: transaction.userId },
      })

      const refundEntity = influencer
        ? { model: prisma.influencer, id: influencer.id }
        : brand
        ? { model: prisma.brand, id: brand.id }
        : null

      if (refundEntity) {
        await prisma.$transaction([
          (refundEntity.model as typeof prisma.influencer).update({
            where: { id: refundEntity.id },
            data: { balance: { increment: transaction.amount } },
          }),
          prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              status: 'failed',
              externalStatus: 'Canceled',
            },
          }),
        ])
      } else {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            externalStatus: 'Canceled',
          },
        })
        console.error('User not found for withdrawal refund', { userId: transaction.userId })
      }

      return NextResponse.json({ ok: true })
    }

    // Unknown status
    console.warn('Unknown withdrawal webhook status', { Status: body.Status, ID: body.ID })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Withdrawal webhook error:', error)
    // Return 500 on unexpected errors so 0xProcessing retries the webhook
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
