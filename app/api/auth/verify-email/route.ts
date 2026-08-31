import { rateLimit } from '@/lib/rate-limit'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(`verify-email:${ip}`, 5, 60000)
    if (!success) return NextResponse.json({ error: 'Too many attempts. Please wait a minute.' }, { status: 429 })
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    let payload
    try {
      const result = await jwtVerify(token, JWT_SECRET)
      payload = result.payload
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    if (!payload.userId || payload.purpose !== 'email-verification') {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
    }

    const profile = await prisma.profile.update({
      where: { id: payload.userId as string },
      data: { emailVerified: true },
    })

    // Auto-approve influencer when email verified + profile complete
    if (profile.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({
        where: { userId: profile.id },
        select: { status: true, handle: true, niche: true, twitterHandle: true, instagramHandle: true, tiktokHandle: true, youtubeHandle: true, telegramHandle: true },
      })
      if (influencer && influencer.status === 'PENDING') {
        const profileComplete = !!(
          influencer.handle?.trim() &&
          influencer.niche.length > 0 &&
          (influencer.twitterHandle || influencer.instagramHandle || influencer.tiktokHandle || influencer.youtubeHandle || influencer.telegramHandle)
        )
        if (profileComplete) {
          await prisma.influencer.update({
            where: { userId: profile.id },
            data: { status: 'APPROVED' },
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
