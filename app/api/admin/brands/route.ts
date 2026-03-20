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

    const [brands, aggregate] = await Promise.all([
      prisma.brand.findMany({
        include: {
          profile: {
            select: {
              email: true,
            },
          },
          _count: {
            select: {
              campaigns: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.brand.aggregate({
        _count: { id: true },
        _sum: { balance: true },
      }),
    ])

    const stats = {
      totalBrands: aggregate._count.id,
      totalBalance: aggregate._sum.balance ?? 0,
    }

    return NextResponse.json({ brands, stats })
  } catch (error) {
    console.error('Failed to fetch brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 },
    )
  }
}
