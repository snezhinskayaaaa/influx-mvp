import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const [campaigns, totalCount, activeCount, budgetAggregate] = await Promise.all([
      prisma.campaign.findMany({
        include: {
          brand: {
            select: {
              companyName: true,
            },
          },
          _count: {
            select: {
              collaborations: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: 'ACTIVE' } }),
      prisma.campaign.aggregate({
        _sum: {
          budgetMin: true,
          budgetMax: true,
        },
      }),
    ])

    const stats = {
      totalCampaigns: totalCount,
      activeCampaigns: activeCount,
      totalBudgetMin: budgetAggregate._sum.budgetMin ?? 0,
      totalBudgetMax: budgetAggregate._sum.budgetMax ?? 0,
    }

    return NextResponse.json({ campaigns, stats })
  } catch (error) {
    console.error('Failed to fetch campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 },
    )
  }
}
