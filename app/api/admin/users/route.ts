import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = request.nextUrl
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    const search = searchParams.get('search')
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ]
    }

    const role = searchParams.get('role')
    if (role && ['INFLUENCER', 'BRAND', 'ADMIN'].includes(role)) {
      where.role = role
    }

    const verified = searchParams.get('verified')
    if (verified === 'true') {
      where.emailVerified = true
    } else if (verified === 'false') {
      where.emailVerified = false
    }

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          brand: {
            select: {
              companyName: true,
              balance: true,
              frozenBalance: true,
            },
          },
          influencer: {
            select: {
              handle: true,
              status: true,
              balance: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.profile.count({ where }),
    ])

    return NextResponse.json({
      users: profiles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    )
  }
}
