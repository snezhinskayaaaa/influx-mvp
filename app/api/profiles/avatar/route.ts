import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import sharp from 'sharp'

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

    // Validate it's a safe image format (no SVG — can contain scripts)
    const allowedPrefixes = ['data:image/png;', 'data:image/jpeg;', 'data:image/jpg;', 'data:image/webp;']
    if (!allowedPrefixes.some(p => avatar.startsWith(p))) {
      return NextResponse.json({ error: 'Only PNG, JPEG, and WebP images are allowed' }, { status: 400 })
    }

    // Check size — base64 is ~33% larger than binary, so 2MB file = ~2.7MB base64
    if (avatar.length > 3000000) {
      return NextResponse.json({ error: 'Image too large. Maximum 2MB.' }, { status: 400 })
    }

    // Extract base64 data and compress with sharp
    const base64Data = avatar.split(',')[1]
    if (!base64Data) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })
    }

    const inputBuffer = Buffer.from(base64Data, 'base64')
    const compressedBuffer = await sharp(inputBuffer)
      .resize(200, 200, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer()

    const compressedAvatar = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`

    await prisma.profile.update({
      where: { id: user.userId },
      data: { avatarUrl: compressedAvatar },
    })

    return NextResponse.json({ success: true, avatarUrl: compressedAvatar })
  } catch (error) {
    console.error('POST /api/profiles/avatar error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
