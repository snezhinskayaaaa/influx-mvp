import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { isVerified, isBanned } = body

    const updateData: Record<string, unknown> = {}
    if (isVerified !== undefined) updateData.isVerified = Boolean(isVerified)
    if (isBanned !== undefined) updateData.isBanned = Boolean(isBanned)

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ brand })
  } catch (error) {
    console.error('Failed to update brand:', error)
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 })
  }
}
