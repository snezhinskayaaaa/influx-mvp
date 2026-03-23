import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyDepositSignature } from '@/lib/0xprocessing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ignore test webhooks in production
    if (body.Test === true) {
      return NextResponse.json({ ok: true })
    }

    // Verify signature
    const isValid = verifyDepositSignature({
      PaymentId: body.PaymentId,
      MerchantId: body.MerchantId,
      Email: body.Email,
      Currency: body.Currency,
      Signature: body.Signature,
    })

    if (!isValid) {
      console.error('Invalid deposit webhook signature', { PaymentId: body.PaymentId })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // BillingID is our transaction.id
    const transactionId = body.BillingID
    if (!transactionId) {
      console.error('Missing BillingID in deposit webhook')
      return NextResponse.json({ error: 'Missing BillingID' }, { status: 400 })
    }

    // Find the transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    })

    if (!transaction) {
      // Unknown transaction — return 200 to prevent retries
      console.error('Transaction not found for deposit webhook', { transactionId })
      return NextResponse.json({ ok: true })
    }

    // Idempotency: if already confirmed or failed, skip
    if (transaction.status === 'confirmed' || transaction.status === 'failed') {
      return NextResponse.json({ ok: true })
    }

    if (body.Status === 'Success') {
      const netAmount = transaction.amount - transaction.fee

      // Find brand by userId from transaction
      const brand = await prisma.brand.findUnique({
        where: { userId: transaction.userId },
      })

      if (!brand) {
        console.error('Brand not found for deposit webhook', { userId: transaction.userId })
        return NextResponse.json({ ok: true })
      }

      // Credit brand balance and update transaction atomically
      await prisma.$transaction([
        prisma.brand.update({
          where: { id: brand.id },
          data: { balance: { increment: netAmount } },
        }),
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'confirmed',
            externalId: body.PaymentId?.toString(),
            externalStatus: 'Success',
            currency: body.Currency,
            txHash: Array.isArray(body.TxHashes) && body.TxHashes.length > 0
              ? body.TxHashes[0]
              : null,
            confirmedAt: new Date(),
          },
        }),
      ])

      return NextResponse.json({ ok: true })
    }

    if (body.Status === 'Canceled' || body.Status === 'Insufficient') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'failed',
          externalStatus: body.Status,
          externalId: body.PaymentId?.toString(),
        },
      })

      return NextResponse.json({ ok: true })
    }

    // Unknown status — acknowledge to prevent retries
    console.warn('Unknown deposit webhook status', { Status: body.Status, PaymentId: body.PaymentId })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Deposit webhook error:', error)
    // Return 200 even on error to prevent webhook retries that could cause duplicate processing
    return NextResponse.json({ ok: true })
  }
}
