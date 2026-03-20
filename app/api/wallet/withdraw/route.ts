import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// TODO: Integrate with 0xprocessing.com for actual payout
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Only influencers can withdraw funds' }, { status: 403 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })
    if (!influencer) {
      return NextResponse.json({ error: 'Influencer profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)

    if (influencer.balance < amountCents) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    const fee = Math.round(amountCents * 0.03) // 3% withdrawal fee
    const payout = amountCents - fee

    const result = await prisma.influencer.update({
      where: { id: influencer.id },
      data: { balance: { decrement: amountCents } },
    })

    await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: 'WITHDRAWAL',
        amount: amountCents,
        fee,
        description: `Withdrawal of $${amount.toFixed(2)} (fee: $${(fee / 100).toFixed(2)}, payout: $${(payout / 100).toFixed(2)})`,
      },
    })

    return NextResponse.json({
      payout,
      fee,
      remainingBalance: result.balance,
    })
  } catch (error) {
    console.error('POST /api/wallet/withdraw error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
