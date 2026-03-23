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

    const { success } = rateLimit(`withdraw:${user.userId}`, 3, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many withdrawal attempts. Please wait a minute.' }, { status: 429 })
    }

    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Only influencers can withdraw funds' }, { status: 403 })
    }

    // Check email verification for financial/critical operations
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true },
    })
    if (!profile?.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before using this feature' }, { status: 403 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })
    if (!influencer) {
      return NextResponse.json({ error: 'Influencer profile not found' }, { status: 404 })
    }

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
    const feePercent = settings ? Number(settings.withdrawalFeePercent) : 3
    const fee = Math.round(amountCents * (feePercent / 100))
    const payout = amountCents - fee

    // Atomic: deduct balance + create PENDING transaction
    let transaction: { id: string }
    try {
      transaction = await prisma.$transaction(async (tx) => {
        const result = await tx.influencer.updateMany({
          where: {
            id: influencer.id,
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

      return NextResponse.json({
        transactionId: transaction.id,
        status: 'pending',
      })
    } catch (apiError) {
      // If 0xProcessing API fails, refund balance and mark transaction as failed
      console.error('0xProcessing withdrawal API failed:', apiError)

      await prisma.$transaction([
        prisma.influencer.update({
          where: { id: influencer.id },
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
