import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const VALID_PLATFORMS = ['twitter', 'instagram', 'tiktok', 'youtube', 'telegram', 'linkedin'] as const
type Platform = typeof VALID_PLATFORMS[number]

const PLATFORM_HANDLE_FIELD: Record<Platform, string> = {
  twitter: 'twitterHandle',
  instagram: 'instagramHandle',
  tiktok: 'tiktokHandle',
  youtube: 'youtubeHandle',
  telegram: 'telegramHandle',
  linkedin: 'linkedinHandle',
}

const PLATFORM_VERIFIED_FIELD: Record<Platform, string> = {
  twitter: 'twitterVerified',
  instagram: 'instagramVerified',
  tiktok: 'tiktokVerified',
  youtube: 'youtubeVerified',
  telegram: 'telegramVerified',
  linkedin: 'linkedinHandle', // brands only, no verified field for linkedin
}

/**
 * POST /api/social/verify
 * Request verification for a platform. Creates admin notification.
 * Body: { platform: "twitter" | "instagram" | "tiktok" | "youtube" | "telegram" }
 *
 * For YouTube: also auto-verifies subscribers via YouTube API before sending to admin.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'INFLUENCER' && user.role !== 'BRAND') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { platform } = body as { platform: string }

    if (!VALID_PLATFORMS.includes(platform as Platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // For brands — just send admin notification, no per-platform verification fields
    if (user.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({ where: { userId: user.userId } })
      if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })

      const handle = (brand as Record<string, unknown>)[PLATFORM_HANDLE_FIELD[platform as Platform]] as string | null
      if (!handle) return NextResponse.json({ error: `No ${platform} handle set. Fill it in first.` }, { status: 400 })

      const platformLabel = platform === 'twitter' ? 'X (Twitter)' : platform.charAt(0).toUpperCase() + platform.slice(1)
      const admins = await prisma.profile.findMany({ where: { role: 'ADMIN' }, select: { id: true } })
      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: `Brand Verification: ${platformLabel}`,
            body: `${brand.companyName} requested verification for ${platformLabel}: ${handle}`,
            link: `/admin?verify=${brand.id}&platform=${platform}&type=brand`,
          },
        })
      }
      return NextResponse.json({ requested: true, platform })
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId: user.userId },
    })
    if (!influencer) return NextResponse.json({ error: 'Influencer not found' }, { status: 404 })

    const handleField = PLATFORM_HANDLE_FIELD[platform as Platform]
    const handle = (influencer as Record<string, unknown>)[handleField] as string | null
    if (!handle) {
      return NextResponse.json({ error: `No ${platform} handle set. Fill it in first.` }, { status: 400 })
    }

    const verifiedField = PLATFORM_VERIFIED_FIELD[platform as Platform]
    if ((influencer as Record<string, unknown>)[verifiedField]) {
      return NextResponse.json({ verified: true, alreadyVerified: true })
    }

    // For YouTube: auto-verify subscribers first
    let youtubeAutoResult = null
    if (platform === 'youtube') {
      try {
        const ytRes = await fetch(new URL('/api/social/youtube', request.url), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ youtubeUrl: handle }),
        })
        if (ytRes.ok) {
          const ytData = await ytRes.json()
          await prisma.influencer.update({
            where: { id: influencer.id },
            data: { youtubeSubscribers: ytData.subscribers },
          })
          youtubeAutoResult = { subscribers: ytData.subscribers, title: ytData.title }
        }
      } catch {
        // YouTube API failed, continue with manual verification
      }
    }

    // Create notification for admin
    const admins = await prisma.profile.findMany({
      where: { role: 'ADMIN' },
      select: { id: true },
    })

    const platformLabel = platform === 'twitter' ? 'X (Twitter)' : platform.charAt(0).toUpperCase() + platform.slice(1)
    const message = `${influencer.handle} requested verification for ${platformLabel}: ${handle}`

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          title: `Verification Request: ${platformLabel}`,
          body: message,
          link: `/admin?verify=${influencer.id}&platform=${platform}`,
        },
      })
    }

    return NextResponse.json({
      requested: true,
      platform,
      ...(youtubeAutoResult ? { youtubeAutoResult } : {}),
    })
  } catch (error) {
    console.error('Social verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
