import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { jwtVerify } from 'jose'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'default' },
    })

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          id: 'default',
          depositFeePercent: 2.0,
          withdrawalFeePercent: 3.0,
        },
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to fetch platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
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
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { depositFeePercent, withdrawalFeePercent, codeToken, code } = body

    // Verify the verification code
    if (!codeToken || !code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    try {
      const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
      const { payload } = await jwtVerify(codeToken, JWT_SECRET)
      if (payload.purpose !== 'admin-settings-change' || payload.code !== code) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Verification code expired or invalid' }, { status: 400 })
    }

    if (depositFeePercent !== undefined) {
      if (typeof depositFeePercent !== 'number' || depositFeePercent < 0 || depositFeePercent > 100) {
        return NextResponse.json(
          { error: 'depositFeePercent must be a number between 0 and 100' },
          { status: 400 },
        )
      }
    }

    if (withdrawalFeePercent !== undefined) {
      if (typeof withdrawalFeePercent !== 'number' || withdrawalFeePercent < 0 || withdrawalFeePercent > 100) {
        return NextResponse.json(
          { error: 'withdrawalFeePercent must be a number between 0 and 100' },
          { status: 400 },
        )
      }
    }

    const updateData: Record<string, number> = {}
    if (depositFeePercent !== undefined) {
      updateData.depositFeePercent = depositFeePercent
    }
    if (withdrawalFeePercent !== undefined) {
      updateData.withdrawalFeePercent = withdrawalFeePercent
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      )
    }

    const settings = await prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: updateData,
      create: {
        id: 'default',
        depositFeePercent: depositFeePercent ?? 2.0,
        withdrawalFeePercent: withdrawalFeePercent ?? 3.0,
      },
    })

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to update platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: 500 },
    )
  }
}
