import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const MAX_FOUNDING_BRANDS = 10
const MAX_FOUNDING_CREATORS = 20
const FOUNDING_WINDOW_DAYS = 30
const MIN_CAMPAIGN_AMOUNT_CENTS = 10000 // $100

/**
 * POST /api/founding/check
 * Check and grant founding member status.
 * Called after: campaign start (brand), withdrawal (creator)
 * Body: { type: "brand", brandId: string } | { type: "creator", influencerId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type } = body as { type: string }

    if (type === 'brand') {
      const { brandId } = body as { brandId: string }
      if (!brandId) return NextResponse.json({ error: 'brandId required' }, { status: 400 })

      const brand = await prisma.brand.findUnique({ where: { id: brandId } })
      if (!brand) return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
      if (brand.foundingMember) return NextResponse.json({ foundingMember: true, alreadyGranted: true })

      // Check if within 30 days of registration
      const daysSinceRegistration = (Date.now() - brand.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceRegistration > FOUNDING_WINDOW_DAYS) {
        return NextResponse.json({ foundingMember: false, reason: 'Registration window expired' })
      }

      // Check if spots available
      const currentFoundingBrands = await prisma.brand.count({ where: { foundingMember: true } })
      if (currentFoundingBrands >= MAX_FOUNDING_BRANDS) {
        return NextResponse.json({ foundingMember: false, reason: 'All founding spots taken' })
      }

      // Check if brand has a funded collaboration with agreedPrice >= $100
      const fundedCollab = await prisma.collaboration.findFirst({
        where: {
          campaign: { brandId },
          status: { in: ['IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED', 'COMPLETED', 'RESOLVED'] },
          agreedPrice: { gte: MIN_CAMPAIGN_AMOUNT_CENTS },
        },
      })

      if (!fundedCollab) {
        return NextResponse.json({ foundingMember: false, reason: 'No funded campaign ($100 min) yet' })
      }

      // Grant founding status
      await prisma.brand.update({
        where: { id: brandId },
        data: { foundingMember: true, foundingMemberAt: new Date() },
      })

      return NextResponse.json({ foundingMember: true, granted: true })
    }

    if (type === 'creator') {
      const { influencerId } = body as { influencerId: string }
      if (!influencerId) return NextResponse.json({ error: 'influencerId required' }, { status: 400 })

      const influencer = await prisma.influencer.findUnique({ where: { id: influencerId } })
      if (!influencer) return NextResponse.json({ error: 'Influencer not found' }, { status: 404 })
      if (influencer.foundingMember) return NextResponse.json({ foundingMember: true, alreadyGranted: true })

      // Check if within 30 days of registration
      const daysSinceRegistration = (Date.now() - influencer.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceRegistration > FOUNDING_WINDOW_DAYS) {
        return NextResponse.json({ foundingMember: false, reason: 'Registration window expired' })
      }

      // Check if spots available
      const currentFoundingCreators = await prisma.influencer.count({ where: { foundingMember: true } })
      if (currentFoundingCreators >= MAX_FOUNDING_CREATORS) {
        return NextResponse.json({ foundingMember: false, reason: 'All founding spots taken' })
      }

      // Check if creator has completed a withdrawal (has any completed collaboration with payment)
      const completedCollab = await prisma.collaboration.findFirst({
        where: {
          influencerId,
          status: { in: ['COMPLETED', 'RESOLVED'] },
        },
      })

      if (!completedCollab) {
        return NextResponse.json({ foundingMember: false, reason: 'No completed withdrawal yet' })
      }

      // Grant founding status
      await prisma.influencer.update({
        where: { id: influencerId },
        data: { foundingMember: true, foundingMemberAt: new Date() },
      })

      return NextResponse.json({ foundingMember: true, granted: true })
    }

    return NextResponse.json({ error: 'Invalid type. Use "brand" or "creator"' }, { status: 400 })
  } catch (error) {
    console.error('Founding check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
