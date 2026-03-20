import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
    let payload
    try {
      const result = await jwtVerify(token, JWT_SECRET)
      payload = result.payload
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    if (!payload.userId || payload.purpose !== 'email-verification') {
      return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
    }

    await prisma.profile.update({
      where: { id: payload.userId as string },
      data: { emailVerified: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify email error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
