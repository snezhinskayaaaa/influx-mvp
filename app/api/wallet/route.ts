import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    const transactionWhere = { userId: user.userId }
    const [transactions, totalTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: transactionWhere,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: transactionWhere }),
    ])

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
        pagination: { page, limit, total: totalTransactions, totalPages: Math.ceil(totalTransactions / limit) },
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
        pagination: { page, limit, total: totalTransactions, totalPages: Math.ceil(totalTransactions / limit) },
      })
    }

    return NextResponse.json({ error: 'Wallet not available for this role' }, { status: 403 })
  } catch (error) {
    console.error('GET /api/wallet error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
