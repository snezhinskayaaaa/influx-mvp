import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

const PROFILE_SELECT = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  avatarUrl: true,
  createdAt: true,
} as const

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.userId },
      select: PROFILE_SELECT,
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error('GET /api/profiles/me error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fullName } = body

    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 },
      )
    }

    const profile = await prisma.profile.update({
      where: { id: user.userId },
      data: { fullName: fullName.trim() },
      select: PROFILE_SELECT,
    })

    return NextResponse.json({ profile }, { status: 200 })
  } catch (error) {
    console.error('PATCH /api/profiles/me error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
