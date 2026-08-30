import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })

    if (!influencer) {
      return NextResponse.json(
        { error: 'Influencer profile not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ influencer }, { status: 200 })
  } catch (error) {
    console.error('GET /api/influencers/me error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch influencer profile' },
      { status: 500 },
    )
  }
}

const STRING_FIELDS = [
  'handle',
  'bio',
  'location',
  'instagramHandle',
  'tiktokHandle',
  'youtubeHandle',
  'twitterHandle',
  'telegramHandle',
] as const

const ARRAY_FIELDS = [
  'niche',
  'languages',
  'pastCollaborations',
] as const

const INT_FIELDS = [
  'instagramFollowers',
  'instagramAvgViews',
  'tiktokFollowers',
  'tiktokAvgViews',
  'youtubeSubscribers',
  'youtubeAvgViews',
  'twitterFollowers',
  'twitterAvgViews',
  'telegramFollowers',
  'telegramAvgViews',
] as const

const ENGAGEMENT_FIELDS = [
  'instagramEngagement',
  'tiktokEngagement',
  'youtubeEngagement',
] as const

const PRICE_FIELDS = [
  'pricePerPost',
  'pricePerStory',
  'pricePerVideo',
  'cpmMin',
  'cpmMax',
  'cpcMin',
  'cpcMax',
  'cpeMin',
  'cpeMax',
  'cpmRate',
  'cpcRate',
  'cpeRate',
  'averagePostPrice',
] as const

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'INFLUENCER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    for (const field of STRING_FIELDS) {
      if (field in body) {
        updateData[field] = String(body[field] ?? '')
      }
    }

    for (const field of ARRAY_FIELDS) {
      if (field in body) {
        updateData[field] = Array.isArray(body[field]) ? body[field] : []
      }
    }

    for (const field of INT_FIELDS) {
      if (field in body) {
        const parsed = parseInt(body[field], 10)
        updateData[field] = Number.isFinite(parsed) ? parsed : 0
      }
    }

    for (const field of ENGAGEMENT_FIELDS) {
      if (field in body) {
        const parsed = parseFloat(body[field])
        // Clamp to Decimal(5,2) max: 999.99
        updateData[field] = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 999.99) : 0
      }
    }

    for (const field of PRICE_FIELDS) {
      if (field in body) {
        const dollars = parseFloat(body[field])
        updateData[field] = Number.isFinite(dollars)
          ? Math.round(dollars * 100)
          : 0
      }
    }

    // Reset per-platform verification when social media fields change
    const platformResetMap: Record<string, string> = {
      twitterHandle: 'twitterVerified', twitterFollowers: 'twitterVerified', twitterAvgViews: 'twitterVerified',
      instagramHandle: 'instagramVerified', instagramFollowers: 'instagramVerified', instagramAvgViews: 'instagramVerified',
      tiktokHandle: 'tiktokVerified', tiktokFollowers: 'tiktokVerified', tiktokAvgViews: 'tiktokVerified',
      youtubeHandle: 'youtubeVerified', youtubeAvgViews: 'youtubeVerified',
      telegramHandle: 'telegramVerified', telegramFollowers: 'telegramVerified', telegramAvgViews: 'telegramVerified',
    }
    const verifiedToReset = new Set<string>()
    for (const field of Object.keys(updateData)) {
      if (platformResetMap[field]) verifiedToReset.add(platformResetMap[field])
    }
    for (const vField of verifiedToReset) {
      updateData[vField] = false
    }

    if ('handle' in body) {
      const existing = await prisma.influencer.findUnique({
        where: { handle: String(body.handle) },
        select: { userId: true },
      })
      if (existing && existing.userId !== user.userId) {
        return NextResponse.json(
          { error: 'Handle is already taken' },
          { status: 409 },
        )
      }
    }

    const influencer = await prisma.influencer.update({
      where: { userId: user.userId },
      data: updateData,
    })

    // Activate pending referral when profile is complete (name + niche + at least 1 social)
    const profileComplete = !!(
      influencer.handle?.trim() &&
      influencer.niche.length > 0 &&
      (influencer.twitterHandle || influencer.instagramHandle || influencer.tiktokHandle || influencer.youtubeHandle || influencer.telegramHandle)
    )
    if (profileComplete) {
      try {
        const activated = await prisma.referral.updateMany({
          where: { referredId: influencer.id, status: 'pending' },
          data: { status: 'active' },
        })

        if (activated.count > 0) {
          // Notify referrer
          const referral = await prisma.referral.findFirst({
            where: { referredId: influencer.id, status: 'active' },
            include: {
              referrer: {
                select: {
                  handle: true,
                  userId: true,
                  profile: { select: { email: true, emailNotifications: true } },
                },
              },
            },
          })

          if (referral?.referrer.profile?.emailNotifications) {
            try {
              const { sendCollaborationEmail } = await import('@/lib/email')
              await sendCollaborationEmail(
                referral.referrer.profile.email,
                'New Referral',
                'Someone joined through your link!',
                `@${influencer.handle} signed up on Influx using your referral link and completed onboarding. You'll earn 10% of platform fees from their campaigns.`,
                'View Referrals',
                `${process.env.NEXT_PUBLIC_APP_URL || 'https://aiinflux.io'}/dashboard/influencer?tab=referrals`,
              )
            } catch (emailErr) {
              console.error('Failed to send referral notification email:', emailErr)
            }

            // Check tier upgrade
            const activeCount = await prisma.referral.count({
              where: { referrerId: referral.referrerId, status: 'active' },
            })

            const tierThresholds = [
              { count: 15, name: 'Community Leader' },
              { count: 5, name: 'Community Builder' },
              { count: 1, name: 'Community Member' },
            ]
            const newTier = tierThresholds.find(t => activeCount === t.count)

            if (newTier) {
              try {
                const { sendCollaborationEmail } = await import('@/lib/email')
                await sendCollaborationEmail(
                  referral.referrer.profile.email,
                  `You're now a ${newTier.name}!`,
                  `You've reached ${newTier.name}!`,
                  `Congratulations! With ${activeCount} referral${activeCount !== 1 ? 's' : ''}, you've earned the ${newTier.name} badge. Keep inviting creators to climb the leaderboard.`,
                  'View Your Badge',
                  `${process.env.NEXT_PUBLIC_APP_URL || 'https://aiinflux.io'}/dashboard/influencer?tab=referrals`,
                )
              } catch (emailErr) {
                console.error('Failed to send tier notification email:', emailErr)
              }
            }
          }
        }
      } catch (refError) {
        console.error('Failed to activate referral:', refError)
      }
    }

    return NextResponse.json({ influencer }, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/influencers/me error:', error)
    let message = 'Failed to update influencer profile'
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) message = 'Handle is already taken'
      else if (error.message.includes('Record to update not found')) message = 'Influencer profile not found. Please contact support.'
      else message = error.message
    }
    return NextResponse.json(
      { error: message },
      { status: 500 },
    )
  }
}
