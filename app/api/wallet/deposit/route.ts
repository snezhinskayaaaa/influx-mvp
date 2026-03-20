import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// TODO: Integrate with 0xprocessing.com — currently adds balance directly for testing
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Only brands can deposit funds' }, { status: 403 })
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: user.userId },
    })
    if (!brand) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { amount } = body

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    if (amount > 100000) {
      return NextResponse.json({ error: 'Maximum deposit is $100,000' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)
    const settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } })
    const feePercent = settings ? Number(settings.depositFeePercent) : 2
    const fee = Math.round(amountCents * (feePercent / 100))

    const netAmount = amountCents - fee
    const result = await prisma.brand.update({
      where: { id: brand.id },
      data: { balance: { increment: netAmount } },
    })

    await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: 'DEPOSIT',
        amount: amountCents,
        fee,
        description: `Deposit of $${amount.toFixed(2)} (fee: $${(fee / 100).toFixed(2)})`,
      },
    })

    return NextResponse.json({
      balance: result.balance,
      deposited: amountCents,
      fee,
      netAmount,
    })
  } catch (error) {
    console.error('POST /api/wallet/deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
