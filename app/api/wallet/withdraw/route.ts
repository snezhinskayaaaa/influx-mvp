import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { createWithdrawal } from '@/lib/0xprocessing'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = await rateLimit(`withdraw:${user.userId}`, 3, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many withdrawal attempts. Please wait a minute.' }, { status: 429 })
    }

    if (user.role !== 'INFLUENCER' && user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Withdrawal not available for this role' }, { status: 403 })
    }

    // Check email verification for financial/critical operations
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true },
    })
    if (!profile?.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before using this feature' }, { status: 403 })
    }

    // Get the entity (influencer or brand) for balance check
    let entityId: string
    let currentBalance: number

    if (user.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({ where: { userId: user.userId } })
      if (!influencer) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      entityId = influencer.id
      currentBalance = influencer.balance
    } else {
      const brand = await prisma.brand.findUnique({ where: { userId: user.userId } })
      if (!brand) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
      entityId = brand.id
      currentBalance = brand.balance
    }
    void currentBalance // used for context, actual check is atomic

    const body = await request.json()
    const { amount, address, currency } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }
    if (amount < 10) {
      return NextResponse.json({ error: 'Minimum withdrawal is $10' }, { status: 400 })
    }
    if (amount > 100000) {
      return NextResponse.json({ error: 'Maximum withdrawal is $100,000' }, { status: 400 })
    }
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)

    const settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } })
    const standardFee = settings ? Number(settings.withdrawalFeePercent) : 6
    const foundingFee = 3 // Founding members locked rate
    // Check if user is a founding member
    let isFoundingMember = false
    if (user.role === 'INFLUENCER') {
      const inf = await prisma.influencer.findUnique({ where: { userId: user.userId }, select: { foundingMember: true } })
      isFoundingMember = inf?.foundingMember || false
    } else {
      const br = await prisma.brand.findUnique({ where: { userId: user.userId }, select: { foundingMember: true } })
      isFoundingMember = br?.foundingMember || false
    }
    const feePercent = isFoundingMember ? foundingFee : standardFee
    const fee = Math.round(amountCents * (feePercent / 100))
    const payout = amountCents - fee

    // Atomic: deduct balance + create PENDING transaction
    let transaction: { id: string }
    try {
      transaction = await prisma.$transaction(async (tx) => {
        const model = user.role === 'INFLUENCER' ? tx.influencer : tx.brand
        const result = await (model as typeof tx.influencer).updateMany({
          where: {
            id: entityId,
            balance: { gte: amountCents },
          },
          data: { balance: { decrement: amountCents } },
        })

        if (result.count === 0) {
          throw new Error('INSUFFICIENT_BALANCE')
        }

        const txn = await tx.transaction.create({
          data: {
            userId: user.userId,
            type: 'WITHDRAWAL',
            amount: amountCents,
            fee,
            status: 'pending',
            walletAddress: address.trim(),
            currency: currency || 'USDT (TRC20)',
            description: `Withdrawal of $${amount.toFixed(2)} (fee: $${(fee / 100).toFixed(2)}, payout: $${(payout / 100).toFixed(2)})`,
          },
        })

        return txn
      })
    } catch (innerError) {
      if (innerError instanceof Error && innerError.message === 'INSUFFICIENT_BALANCE') {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
      }
      throw innerError
    }

    // Call 0xProcessing withdrawal API
    try {
      const withdrawalResponse = await createWithdrawal({
        currency: currency || 'USDT (TRC20)',
        amount: payout / 100, // convert cents to dollars for API
        address: address.trim(),
        clientId: user.userId,
        externalId: transaction.id,
      })

      // Update transaction with external ID
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          externalId: withdrawalResponse.id.toString(),
        },
      })

      // Referral revenue share: 10% of platform fee to referrer
      if (user.role === 'INFLUENCER' && fee > 0) {
        try {
          // Find active referral where THIS influencer is the referred one
          const referral = await prisma.referral.findFirst({
            where: {
              referredId: entityId,
              status: 'active',
            },
            select: {
              id: true,
              referrerId: true,
              referrer: { select: { userId: true } },
            },
          })

          if (referral) {
            const revenueShare = Math.floor(fee * 0.1) // 10% of platform fee, rounded down
            if (revenueShare > 0) {
              await prisma.$transaction([
                // Credit referrer's balance
                prisma.influencer.update({
                  where: { id: referral.referrerId },
                  data: { balance: { increment: revenueShare } },
                }),
                // Track earnings on referral record
                prisma.referral.update({
                  where: { id: referral.id },
                  data: { totalEarnings: { increment: revenueShare } },
                }),
                // Create transaction record for referrer
                prisma.transaction.create({
                  data: {
                    userId: referral.referrer.userId,
                    type: 'REFERRAL_PAYOUT',
                    amount: revenueShare,
                    fee: 0,
                    status: 'confirmed',
                    description: `Referral revenue share (10% of $${(fee / 100).toFixed(2)} fee)`,
                    confirmedAt: new Date(),
                  },
                }),
              ])
            }
          }
        } catch (refError) {
          // Don't block withdrawal if referral payout fails
          console.error('Referral revenue share failed:', refError)
        }
      }

      return NextResponse.json({
        transactionId: transaction.id,
        status: 'pending',
      })
    } catch (apiError) {
      // If 0xProcessing API fails, refund balance and mark transaction as failed
      console.error('0xProcessing withdrawal API failed:', apiError)

      const refundModel = user.role === 'INFLUENCER' ? prisma.influencer : prisma.brand
      await prisma.$transaction([
        (refundModel as typeof prisma.influencer).update({
          where: { id: entityId },
          data: { balance: { increment: amountCents } },
        }),
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            externalStatus: 'api_error',
            description: `Withdrawal failed: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`,
          },
        }),
      ])

      return NextResponse.json({ error: 'Withdrawal processing failed. Your balance has been refunded.' }, { status: 502 })
    }
  } catch (error) {
    console.error('POST /api/wallet/withdraw error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
