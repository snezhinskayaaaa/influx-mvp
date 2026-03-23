import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { createPayment } from '@/lib/0xprocessing'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { success } = rateLimit(`deposit:${user.userId}`, 5, 60000)
    if (!success) {
      return NextResponse.json({ error: 'Too many deposit attempts. Please wait a minute.' }, { status: 429 })
    }

    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Only brands can deposit funds' }, { status: 403 })
    }

    // Check email verification for financial/critical operations
    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: { emailVerified: true, email: true },
    })
    if (!profile?.emailVerified) {
      return NextResponse.json({ error: 'Please verify your email before using this feature' }, { status: 403 })
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: user.userId },
    })
    if (!brand) {
      return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { amount, currency } = body

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

    // Create a PENDING transaction — balance is NOT credited yet
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.userId,
        type: 'DEPOSIT',
        amount: amountCents,
        fee,
        status: 'pending',
        currency: currency || 'USDT (TRC20)',
        description: `Deposit of $${amount.toFixed(2)} (fee: $${(fee / 100).toFixed(2)})`,
      },
    })

    // Call 0xProcessing to create a payment
    const paymentResponse = await createPayment({
      amountUSD: amount,
      currency,
      email: profile.email,
      clientId: user.userId,
      billingId: transaction.id,
    })

    // Update transaction with external ID from payment provider
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        externalId: paymentResponse.id.toString(),
      },
    })

    return NextResponse.json({
      redirectUrl: paymentResponse.redirectUrl,
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error('POST /api/wallet/deposit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
