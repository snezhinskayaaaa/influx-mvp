import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { notifyInfluencerApplicationAccepted, notifyInfluencerAgreedAndAdvance } from '@/lib/notifications'

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
          include: { brand: { select: { id: true, companyName: true, industry: true, userId: true } } },
        },
        influencer: { select: { id: true, handle: true, instagramFollowers: true, pricePerPost: true, userId: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    const isBrandOwner = collaboration.campaign.brand.userId === user.userId
    const isInfluencer = collaboration.influencer.userId === user.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isBrandOwner && !isInfluencer && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json({ collaboration })
  } catch (error) {
    console.error('GET /api/collaborations/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
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
        campaign: { include: { brand: { select: { id: true, userId: true } } } },
        influencer: { select: { id: true, userId: true, handle: true } },
      },
    })

    if (!collaboration) {
      return NextResponse.json({ error: 'Collaboration not found' }, { status: 404 })
    }

    const isBrandOwner = collaboration.campaign.brand.userId === user.userId
    const isInfluencer = collaboration.influencer.userId === user.userId
    const isAdmin = user.role === 'ADMIN'

    if (!isBrandOwner && !isInfluencer && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    // Brand can set agreedPrice and brandAgreed, and accept application (NEGOTIATING)
    if (isBrandOwner || isAdmin) {
      if (body.agreedPrice !== undefined) {
        if (typeof body.agreedPrice !== 'number' || body.agreedPrice <= 0 || body.agreedPrice > 1000000) {
          return NextResponse.json({ error: 'Agreed price must be a positive number up to 1,000,000' }, { status: 400 })
        }
        updateData.agreedPrice = Math.round(body.agreedPrice * 100)
      }
      if (body.brandAgreed !== undefined) {
        updateData.brandAgreed = body.brandAgreed
      }
      if (body.status === 'NEGOTIATING' && collaboration.status === 'APPLIED') {
        updateData.status = 'NEGOTIATING'
      }
    }

    // Influencer can set influencerAgreed
    if (isInfluencer || isAdmin) {
      if (body.influencerAgreed !== undefined) {
        updateData.influencerAgreed = body.influencerAgreed
      }
    }

    // Either party can cancel — fully atomic with unfreeze / advance handling
    if (body.status === 'CANCELLED') {
      try {
        const wasAgreed = collaboration.status === 'AGREED' && collaboration.agreedPrice
        const wasInProgress = collaboration.status === 'IN_PROGRESS' && collaboration.agreedPrice

        await prisma.$transaction(async (tx) => {
          // Atomic status check + cancel
          const cancelResult = await tx.collaboration.updateMany({
            where: {
              id,
              status: { in: ['APPLIED', 'NEGOTIATING', 'AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING'] },
            },
            data: { status: 'CANCELLED' },
          })

          if (cancelResult.count === 0) {
            throw new Error('CANNOT_CANCEL')
          }

          if (wasAgreed) {
            // No advance paid yet — full unfreeze to brand
            const campaign = await tx.campaign.findUniqueOrThrow({
              where: { id: collaboration.campaignId },
              include: { brand: true },
            })
            await tx.brand.update({
              where: { id: campaign.brand.id },
              data: {
                frozenBalance: { decrement: collaboration.agreedPrice! },
                balance: { increment: collaboration.agreedPrice! },
              },
            })
            await tx.transaction.create({
              data: {
                userId: campaign.brand.userId,
                type: 'CAMPAIGN_UNFREEZE',
                amount: collaboration.agreedPrice!,
                description: 'Funds unfrozen due to collaboration cancellation',
                referenceId: collaboration.id,
              },
            })
          } else if (wasInProgress) {
            const campaign = await tx.campaign.findUniqueOrThrow({
              where: { id: collaboration.campaignId },
              include: { brand: true },
            })
            const advance = Math.round(collaboration.agreedPrice! / 2)
            const frozenRemainder = collaboration.agreedPrice! - advance

            if (isInfluencer) {
              // Influencer cancels: try to refund advance from influencer balance
              const influencer = await tx.influencer.findUniqueOrThrow({
                where: { id: collaboration.influencerId },
                select: { id: true, balance: true },
              })

              const refundable = Math.min(influencer.balance, advance)

              if (refundable > 0) {
                await tx.influencer.update({
                  where: { id: influencer.id },
                  data: { balance: { decrement: refundable } },
                })
              }

              // Return refundable advance + frozen remainder to brand
              const totalBrandReturn = refundable + frozenRemainder
              await tx.brand.update({
                where: { id: campaign.brand.id },
                data: {
                  frozenBalance: { decrement: frozenRemainder },
                  balance: { increment: totalBrandReturn },
                },
              })

              if (refundable > 0) {
                await tx.transaction.create({
                  data: {
                    userId: collaboration.influencer.userId,
                    type: 'ADVANCE_REFUND',
                    amount: refundable,
                    description: refundable < advance
                      ? `Partial advance refund (${refundable} of ${advance} cents)`
                      : 'Full advance refund due to influencer cancellation',
                    referenceId: collaboration.id,
                  },
                })
              }

              await tx.transaction.create({
                data: {
                  userId: campaign.brand.userId,
                  type: 'CAMPAIGN_UNFREEZE',
                  amount: totalBrandReturn,
                  description: 'Funds returned due to influencer cancellation',
                  referenceId: collaboration.id,
                },
              })
            } else {
              // Brand cancels: advance stays with influencer, only frozen remainder returns
              await tx.brand.update({
                where: { id: campaign.brand.id },
                data: {
                  frozenBalance: { decrement: frozenRemainder },
                  balance: { increment: frozenRemainder },
                },
              })

              await tx.transaction.create({
                data: {
                  userId: campaign.brand.userId,
                  type: 'CAMPAIGN_UNFREEZE',
                  amount: frozenRemainder,
                  description: 'Frozen remainder returned due to brand cancellation (advance kept by influencer)',
                  referenceId: collaboration.id,
                },
              })
            }
          }
        })
      } catch (cancelError) {
        if (cancelError instanceof Error && cancelError.message === 'CANNOT_CANCEL') {
          return NextResponse.json({ error: 'Collaboration cannot be cancelled (already completed or cancelled)' }, { status: 400 })
        }
        throw cancelError
      }

      // Remove status from updateData since we already handled it
      delete updateData.status
    }

    // Either party or admin can update deliverables
    if (body.deliverables !== undefined) {
      if (typeof body.deliverables === 'string') {
        updateData.deliverables = body.deliverables.split('\n').map((d: string) => d.trim()).filter((d: string) => d.length > 0)
      } else if (Array.isArray(body.deliverables)) {
        updateData.deliverables = body.deliverables
      }
    }

    // Brand can move to IN_PROGRESS after agreement — pays 50% advance atomically
    if (body.status === 'IN_PROGRESS' && collaboration.status === 'AGREED' && (isBrandOwner || isAdmin)) {
      if (!collaboration.agreedPrice) {
        return NextResponse.json({ error: 'No agreed price set' }, { status: 400 })
      }

      try {
        const advance = Math.round(collaboration.agreedPrice / 2)

        const result = await prisma.$transaction(async (tx) => {
          // Deduct advance from frozen balance, credit influencer
          const brand = await tx.brand.findUniqueOrThrow({
            where: { id: collaboration.campaign.brand.id },
            select: { id: true, userId: true, frozenBalance: true },
          })

          if (brand.frozenBalance < advance) {
            throw new Error('INSUFFICIENT_FROZEN_BALANCE')
          }

          await tx.brand.update({
            where: { id: brand.id },
            data: { frozenBalance: { decrement: advance } },
          })

          await tx.influencer.update({
            where: { id: collaboration.influencerId },
            data: { balance: { increment: advance } },
          })

          await tx.transaction.create({
            data: {
              userId: brand.userId,
              type: 'CAMPAIGN_ADVANCE',
              amount: advance,
              description: '50% advance payment for collaboration',
              referenceId: collaboration.id,
            },
          })

          await tx.transaction.create({
            data: {
              userId: collaboration.influencer.userId,
              type: 'CAMPAIGN_ADVANCE',
              amount: advance,
              description: '50% advance received for collaboration',
              referenceId: collaboration.id,
            },
          })

          const updated = await tx.collaboration.update({
            where: { id },
            data: {
              ...updateData,
              status: 'IN_PROGRESS',
              advancePaidAt: new Date(),
            },
          })

          return updated
        })

        // Fire-and-forget notification: advance paid, collaboration in progress
        notifyInfluencerAgreedAndAdvance(collaboration.influencer.userId, collaboration.campaign.title, advance)

        return NextResponse.json({ collaboration: result })
      } catch (txError) {
        if (txError instanceof Error && txError.message === 'INSUFFICIENT_FROZEN_BALANCE') {
          return NextResponse.json({ error: 'Insufficient frozen balance for advance payment' }, { status: 400 })
        }
        throw txError
      }
    }

    const updated = await prisma.collaboration.update({
      where: { id },
      data: updateData,
    })

    // Fire-and-forget notification when brand accepts application
    if (updateData.status === 'NEGOTIATING') {
      notifyInfluencerApplicationAccepted(collaboration.influencer.userId, collaboration.campaign.title)
    }

    return NextResponse.json({ collaboration: updated })
  } catch (error) {
    console.error('PATCH /api/collaborations/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
