import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { emailVerified } = body

    if (emailVerified === undefined) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      )
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: { emailVerified: Boolean(emailVerified) },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Failed to update user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    // Prevent deleting the last admin user
    const targetProfile = await prisma.profile.findUnique({
      where: { id },
      select: { role: true },
    })

    if (!targetProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetProfile.role === 'ADMIN') {
      const adminCount = await prisma.profile.count({
        where: { role: 'ADMIN' },
      })
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin user' },
          { status: 400 },
        )
      }
    }

    // Check financial obligations before deletion
    if (targetProfile.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({ where: { userId: id }, select: { id: true, balance: true, frozenBalance: true } })
      if (brand && (brand.balance > 0 || brand.frozenBalance > 0)) {
        return NextResponse.json({ error: `Cannot delete: project has $${((brand.balance + brand.frozenBalance) / 100).toFixed(2)} in balance/frozen funds` }, { status: 400 })
      }
      if (brand) {
        const activeCollabs = await prisma.collaboration.count({
          where: { campaign: { brandId: brand.id }, status: { in: ['AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED', 'DISPUTED'] } },
        })
        if (activeCollabs > 0) {
          return NextResponse.json({ error: `Cannot delete: project has ${activeCollabs} active collaboration(s)` }, { status: 400 })
        }
      }
    }
    if (targetProfile.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({ where: { userId: id }, select: { id: true, balance: true } })
      if (influencer && influencer.balance > 0) {
        return NextResponse.json({ error: `Cannot delete: creator has $${(influencer.balance / 100).toFixed(2)} in balance` }, { status: 400 })
      }
      if (influencer) {
        const activeCollabs = await prisma.collaboration.count({
          where: { influencerId: influencer.id, status: { in: ['AGREED', 'IN_PROGRESS', 'CONTENT_REVIEW', 'REVISION', 'PUBLISHING', 'DELIVERED', 'DISPUTED'] } },
        })
        if (activeCollabs > 0) {
          return NextResponse.json({ error: `Cannot delete: creator has ${activeCollabs} active collaboration(s)` }, { status: 400 })
        }
      }
    }

    await prisma.profile.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 },
    )
  }
}
