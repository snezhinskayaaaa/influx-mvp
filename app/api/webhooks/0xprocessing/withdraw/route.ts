import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyWithdrawalSignature } from '@/lib/0xprocessing'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Ignore test webhooks in production
    if (body.Test === true) {
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

      return NextResponse.json({ ok: true })
    }

    if (body.Status === 'Canceled') {
      // Refund the influencer balance
      const influencer = await prisma.influencer.findUnique({
        where: { userId: transaction.userId },
      })

      if (influencer) {
        await prisma.$transaction([
          prisma.influencer.update({
            where: { id: influencer.id },
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
        // No influencer found, just mark as failed
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'failed',
            externalStatus: 'Canceled',
          },
        })
        console.error('Influencer not found for withdrawal refund', { userId: transaction.userId })
      }

      return NextResponse.json({ ok: true })
    }

    // Unknown status
    console.warn('Unknown withdrawal webhook status', { Status: body.Status, ID: body.ID })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Withdrawal webhook error:', error)
    return NextResponse.json({ ok: true })
  }
}
