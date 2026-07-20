import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { generateAgreementPDF } from '@/lib/agreement'

const AGREEMENT_STATUSES = [
  'AGREED',
  'IN_PROGRESS',
  'CONTENT_REVIEW',
  'REVISION',
  'PUBLISHING',
  'DELIVERED',
  'COMPLETED',
  'DISPUTED',
  'RESOLVED',
] as const

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const collaboration = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        campaign: {
          include: {
            brand: {
              include: {
                profile: { select: { email: true } },
              },
            },
          },
        },
        influencer: {
          include: {
            profile: { select: { email: true } },
          },
        },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    // Only parties involved or admin can download
    const isBrand = collaboration.campaign.brand.userId === user.userId
    const isInfluencer = collaboration.influencer.userId === user.userId
    const isAdmin = user.role === 'ADMIN'
    if (!isBrand && !isInfluencer && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Only available after agreement
    if (!AGREEMENT_STATUSES.includes(collaboration.status as typeof AGREEMENT_STATUSES[number])) {
      return NextResponse.json({ error: 'Agreement not available for this status' }, { status: 400 })
    }

    if (!collaboration.agreedPrice) {
      return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
    }

    const settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } })
    const depositFee = settings ? Number(settings.depositFeePercent) : 2
    const withdrawalFee = settings ? Number(settings.withdrawalFeePercent) : 3

    const agreedPrice = collaboration.agreedPrice
    const advanceAmount = Math.round(agreedPrice / 2)
    const finalAmount = agreedPrice - advanceAmount

    const pricingBasis = 'Fixed price (individually negotiated)'

    const pdf = generateAgreementPDF({
      collaborationId: collaboration.id,
      createdDate: collaboration.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      agreedDate: collaboration.frozenAt
        ? collaboration.frozenAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : collaboration.updatedAt.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
      brandCompanyName: collaboration.campaign.brand.companyName,
      brandContactName: collaboration.campaign.brand.contactName,
      brandContactEmail:
        collaboration.campaign.brand.contactEmail || collaboration.campaign.brand.profile.email,
      influencerHandle: collaboration.influencer.handle,
      influencerEmail: collaboration.influencer.profile.email,
      campaignTitle: collaboration.campaign.title,
      campaignDescription: collaboration.campaign.description,
      deliverables:
        collaboration.deliverables.length > 0
          ? collaboration.deliverables
          : collaboration.campaign.deliverables,
      agreedPrice,
      pricingBasis,
      depositFeePercent: depositFee,
      withdrawalFeePercent: withdrawalFee,
      advanceAmount,
      finalAmount,
    })

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="influx-agreement-${collaboration.id.slice(0, 8)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('GET /api/collaborations/[id]/agreement error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
