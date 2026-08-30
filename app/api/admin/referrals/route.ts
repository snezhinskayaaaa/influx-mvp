import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    // Total stats
    const [totalReferrals, activeReferrals, totalEarnings] = await Promise.all([
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'active' } }),
      prisma.referral.aggregate({ _sum: { totalEarnings: true } }),
    ])

    // Top referrers
    const topReferrers = await prisma.$queryRaw<Array<{
      id: string
      handle: string
      referral_count: string
      total_earnings: string
    }>>`
      SELECT i.id, i.handle,
        COUNT(r.id)::text as referral_count,
        COALESCE(SUM(r.total_earnings), 0)::text as total_earnings
      FROM influencers i
      INNER JOIN referrals r ON r.referrer_id = i.id AND r.status = 'active'
      GROUP BY i.id, i.handle
      ORDER BY COUNT(r.id) DESC
      LIMIT 20
    `

    // Recent referrals
    const recentReferrals = await prisma.referral.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        referrer: { select: { handle: true } },
        referred: { select: { handle: true } },
      },
    })

    // This week count
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const thisWeek = await prisma.referral.count({
      where: { createdAt: { gte: weekAgo } },
    })

    return NextResponse.json({
      stats: {
        totalReferrals,
        activeReferrals,
        pendingReferrals: totalReferrals - activeReferrals,
        totalEarnings: totalEarnings._sum.totalEarnings || 0,
        thisWeek,
        activeReferrers: topReferrers.length,
      },
      topReferrers: topReferrers.map((r, i) => ({
        rank: i + 1,
        handle: r.handle,
        referralCount: parseInt(r.referral_count),
        totalEarnings: parseInt(r.total_earnings),
      })),
      recentReferrals: recentReferrals.map(r => ({
        referrerHandle: r.referrer.handle,
        referredHandle: r.referred.handle,
        status: r.status,
        earnings: r.totalEarnings,
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('Admin referrals error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
