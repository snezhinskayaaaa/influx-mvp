import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const auth = await getCurrentUser()
    if (!auth || auth.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: auth.userId },
      select: {
        id: true, referralCode: true, handle: true, niche: true,
        twitterHandle: true, instagramHandle: true, tiktokHandle: true,
        youtubeHandle: true, telegramHandle: true,
      },
    })

    if (!influencer) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Activate pending referrals for me if profile is complete (fallback)
    const myProfileComplete = !!(
      influencer.handle?.trim() &&
      influencer.niche.length > 0 &&
      (influencer.twitterHandle || influencer.instagramHandle || influencer.tiktokHandle || influencer.youtubeHandle || influencer.telegramHandle)
    )
    if (myProfileComplete) {
      await prisma.referral.updateMany({
        where: { referredId: influencer.id, status: 'pending' },
        data: { status: 'active' },
      }).catch(() => {})
    }

    // Get my referrals
    const referrals = await prisma.referral.findMany({
      where: { referrerId: influencer.id },
      include: {
        referred: {
          select: {
            handle: true,
            status: true,
            createdAt: true,
            collaborations: {
              where: { status: { in: ['COMPLETED', 'RESOLVED'] } },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate stats
    const totalReferrals = referrals.filter(r => r.status === 'active').length
    const pendingReferrals = referrals.filter(r => r.status === 'pending').length
    const totalEarnings = referrals.reduce((sum, r) => sum + r.totalEarnings, 0)

    // Determine badge tier
    let badgeTier: 'none' | 'member' | 'builder' | 'leader' = 'none'
    if (totalReferrals >= 15) badgeTier = 'leader'
    else if (totalReferrals >= 5) badgeTier = 'builder'
    else if (totalReferrals >= 1) badgeTier = 'member'

    // Next tier progress
    let nextTierAt = 1
    if (badgeTier === 'member') nextTierAt = 5
    else if (badgeTier === 'builder') nextTierAt = 15
    else if (badgeTier === 'leader') nextTierAt = totalReferrals // already max

    // Format referral list
    const referralList = referrals.map(r => ({
      handle: r.referred.handle,
      status: r.status,
      hasCompletedCampaigns: r.referred.collaborations.length > 0,
      joinedAt: r.createdAt,
      earnings: r.totalEarnings,
    }))

    // Leaderboard: top 10 referrers
    const leaderboard = await prisma.$queryRaw<Array<{
      id: string
      handle: string
      referral_count: string
    }>>`
      SELECT i.id, i.handle, COUNT(r.id)::text as referral_count
      FROM influencers i
      INNER JOIN referrals r ON r.referrer_id = i.id AND r.status = 'active'
      GROUP BY i.id, i.handle
      ORDER BY COUNT(r.id) DESC
      LIMIT 10
    `

    // My rank
    const myRank = await prisma.$queryRaw<Array<{ rank: string }>>`
      SELECT rank FROM (
        SELECT referrer_id, RANK() OVER (ORDER BY COUNT(id) DESC) as rank
        FROM referrals
        WHERE status = 'active'
        GROUP BY referrer_id
      ) ranked
      WHERE referrer_id = ${influencer.id}::uuid
    `

    return NextResponse.json({
      referralCode: influencer.referralCode,
      stats: {
        totalReferrals,
        pendingReferrals,
        totalEarnings,
        badgeTier,
        nextTierAt,
        remainingToNextTier: Math.max(0, nextTierAt - totalReferrals),
      },
      referrals: referralList,
      leaderboard: leaderboard.map((entry, i) => ({
        rank: i + 1,
        handle: entry.handle,
        referralCount: parseInt(entry.referral_count),
        isMe: entry.id === influencer.id,
      })),
      myRank: myRank.length > 0 ? parseInt(myRank[0].rank) : null,
    })
  } catch (error) {
    console.error('Referrals API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
