import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { source } = await request.json()
    if (!source || typeof source !== 'string') {
      return NextResponse.json({ error: 'Source is required' }, { status: 400 })
    }

    await prisma.profile.update({
      where: { id: user.userId },
      data: { referralSource: source },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Referral source save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
