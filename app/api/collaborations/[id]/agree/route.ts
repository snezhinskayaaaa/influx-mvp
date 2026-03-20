import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: {
          include: { brand: { select: { id: true, userId: true, balance: true, frozenBalance: true } } },
        },
        influencer: { select: { id: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    // Only brand owner or admin can trigger the freeze
    if (collaboration.campaign.brand.userId !== user.userId && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (collaboration.status !== 'NEGOTIATING') {
      return NextResponse.json({ error: 'Collaboration must be in negotiating status' }, { status: 400 })
    }

    if (!collaboration.brandAgreed || !collaboration.influencerAgreed) {
      return NextResponse.json({ error: 'Both parties must agree first' }, { status: 400 })
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'Agreed price must be set before confirming' }, { status: 400 })
    }

    const brand = collaboration.campaign.brand
    if (brand.balance < collaboration.agreedPrice) {
      return NextResponse.json(
        { error: 'Insufficient balance to confirm this collaboration. Please top up your wallet.' },
        { status: 400 },
      )
    }

    // Freeze funds atomically
    const [_, result, __] = await prisma.$transaction([
      prisma.brand.update({
        where: { id: brand.id },
        data: {
          balance: { decrement: collaboration.agreedPrice! },
          frozenBalance: { increment: collaboration.agreedPrice! },
        },
      }),
      prisma.collaboration.update({
        where: { id },
        data: {
          status: 'AGREED',
          frozenAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          userId: brand.userId,
          type: 'CAMPAIGN_FREEZE',
          amount: collaboration.agreedPrice!,
          description: `Funds frozen for collaboration`,
          referenceId: collaboration.id,
        },
      }),
    ])

    return NextResponse.json({ collaboration: result })
  } catch (error) {
    console.error('POST /api/collaborations/[id]/agree error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
