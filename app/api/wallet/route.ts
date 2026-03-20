import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    if (user.role === 'BRAND') {
      const brand = await prisma.brand.findUnique({
        where: { userId: user.userId },
        select: { balance: true, frozenBalance: true },
      })
      if (!brand) {
        return NextResponse.json({ error: 'Brand profile not found' }, { status: 404 })
      }

      return NextResponse.json({
        wallet: {
          balance: brand.balance,
          frozenBalance: brand.frozenBalance,
          totalBalance: brand.balance + brand.frozenBalance,
        },
        transactions,
      })
    }

    if (user.role === 'INFLUENCER') {
      const influencer = await prisma.influencer.findUnique({
        where: { userId: user.userId },
        select: { balance: true },
      })
      if (!influencer) {
        return NextResponse.json({ error: 'Influencer profile not found' }, { status: 404 })
      }

      return NextResponse.json({
        wallet: { balance: influencer.balance },
        transactions,
      })
    }

    return NextResponse.json({ error: 'Wallet not available for this role' }, { status: 403 })
  } catch (error) {
    console.error('GET /api/wallet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
