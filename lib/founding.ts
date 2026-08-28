import prisma from '@/lib/prisma'

const MAX_FOUNDING_BRANDS = 10
const MAX_FOUNDING_CREATORS = 20
const FOUNDING_WINDOW_DAYS = 30
const MIN_CAMPAIGN_AMOUNT_CENTS = 10000 // $100

/**
 * Check and grant founding member status.
 * Called directly from server code — no HTTP endpoint, no auth bypass risk.
 *
 * For projects: called after Start Campaign (funds frozen, collab IN_PROGRESS)
 * For creators: called after Approve & Pay (collab COMPLETED, final 50% paid)
 */
export async function checkFoundingEligibility(
  type: 'brand' | 'creator',
  id: string
): Promise<{ foundingMember: boolean; reason?: string }> {
  try {
    if (type === 'brand') {
      const brand = await prisma.brand.findUnique({ where: { id } })
      if (!brand) return { foundingMember: false, reason: 'Not found' }
      if (brand.foundingMember) return { foundingMember: true, reason: 'Already granted' }

      const daysSinceRegistration = (Date.now() - brand.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceRegistration > FOUNDING_WINDOW_DAYS) {
        return { foundingMember: false, reason: 'Registration window expired' }
      }

      const currentFoundingBrands = await prisma.brand.count({ where: { foundingMember: true } })
      if (currentFoundingBrands >= MAX_FOUNDING_BRANDS) {
        return { foundingMember: false, reason: 'All founding spots taken' }
      }

      const fundedCollab = await prisma.collaboration.findFirst({
        where: {
          campaign: { brandId: id },
          status: { in: ['IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED', 'COMPLETED', 'RESOLVED'] },
          agreedPrice: { gte: MIN_CAMPAIGN_AMOUNT_CENTS },
        },
      })

      if (!fundedCollab) {
        return { foundingMember: false, reason: 'No funded campaign ($100 min) yet' }
      }

      await prisma.brand.update({
        where: { id },
        data: { foundingMember: true, foundingMemberAt: new Date() },
      })

      console.log(`[founding] Brand ${id} granted founding member status`)
      return { foundingMember: true }
    }

    if (type === 'creator') {
      const influencer = await prisma.influencer.findUnique({ where: { id } })
      if (!influencer) return { foundingMember: false, reason: 'Not found' }
      if (influencer.foundingMember) return { foundingMember: true, reason: 'Already granted' }

      const daysSinceRegistration = (Date.now() - influencer.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceRegistration > FOUNDING_WINDOW_DAYS) {
        return { foundingMember: false, reason: 'Registration window expired' }
      }

      const currentFoundingCreators = await prisma.influencer.count({ where: { foundingMember: true } })
      if (currentFoundingCreators >= MAX_FOUNDING_CREATORS) {
        return { foundingMember: false, reason: 'All founding spots taken' }
      }

      const completedCollab = await prisma.collaboration.findFirst({
        where: {
          influencerId: id,
          status: { in: ['COMPLETED', 'RESOLVED'] },
        },
      })

      if (!completedCollab) {
        return { foundingMember: false, reason: 'No completed collaboration yet' }
      }

      await prisma.influencer.update({
        where: { id },
        data: { foundingMember: true, foundingMemberAt: new Date() },
      })

      console.log(`[founding] Creator ${id} granted founding member status`)
      return { foundingMember: true }
    }

    return { foundingMember: false, reason: 'Invalid type' }
  } catch (error) {
    console.error('Founding eligibility check failed:', error)
    return { foundingMember: false, reason: 'Check failed' }
  }
}
