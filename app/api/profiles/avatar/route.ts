import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { avatar } = body

    if (!avatar || typeof avatar !== 'string') {
      return NextResponse.json({ error: 'Avatar data is required' }, { status: 400 })
    }

    // Validate it's a data URL (base64 image)
    if (!avatar.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
    }

    // Check size — base64 is ~33% larger than binary, so 2MB file = ~2.7MB base64
    if (avatar.length > 3000000) {
      return NextResponse.json({ error: 'Image too large. Maximum 2MB.' }, { status: 400 })
    }

    await prisma.profile.update({
      where: { id: user.userId },
      data: { avatarUrl: avatar },
    })

    return NextResponse.json({ success: true, avatarUrl: avatar })
  } catch (error) {
    console.error('POST /api/profiles/avatar error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
