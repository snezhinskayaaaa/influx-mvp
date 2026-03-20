import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const brand = await prisma.brand.findUnique({
      where: { userId: user.userId },
    })

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand profile not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ brand }, { status: 200 })
  } catch (error) {
    console.error('GET /api/brands/me error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand profile' },
      { status: 500 },
    )
  }
}

const UPDATABLE_FIELDS = [
  'companyName',
  'industry',
  'website',
  'description',
  'contactName',
  'contactEmail',
  'monthlyBudgetRange',
] as const

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'BRAND') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const updateData: Record<string, unknown> = {}

    for (const field of UPDATABLE_FIELDS) {
      if (field in body) {
        updateData[field] = body[field] != null ? String(body[field]) : null
      }
    }

    const brand = await prisma.brand.update({
      where: { userId: user.userId },
      data: updateData,
    })

    return NextResponse.json({ brand }, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/brands/me error:', error)
    return NextResponse.json(
      { error: 'Failed to update brand profile' },
      { status: 500 },
    )
  }
}
