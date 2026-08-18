import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const disputes = await prisma.collaboration.findMany({
      where: { status: { in: ['DISPUTED', 'RESOLVED'] } },
      select: {
        id: true,
        status: true,
        disputeReason: true,
        disputeResult: true,
        disputedAt: true,
        resolvedAt: true,
        agreedPrice: true,
        contentUrl: true,
        publishedUrl: true,
        publishedUrls: true,
        brandTerms: true,
        influencerTerms: true,
        proposedPrice: true,
        campaign: {
          select: {
            id: true,
            title: true,
            description: true,
            brand: { select: { companyName: true, userId: true, profile: { select: { email: true } } } },
          },
        },
        influencer: {
          select: {
            id: true,
            handle: true,
            userId: true,
            profile: { select: { email: true } },
          },
        },
      },
      orderBy: { disputedAt: 'desc' },
    })

    return NextResponse.json({ disputes })
  } catch (error) {
    console.error('Admin disputes error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
