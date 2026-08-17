import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const profiles = await prisma.profile.findMany({
      where: { referralSource: { not: null } },
      select: { referralSource: true, role: true, createdAt: true },
    })

    // Count by source
    const sourceCounts: Record<string, { total: number; brands: number; creators: number }> = {}
    for (const p of profiles) {
      const src = p.referralSource || 'unknown'
      if (!sourceCounts[src]) sourceCounts[src] = { total: 0, brands: 0, creators: 0 }
      sourceCounts[src].total++
      if (p.role === 'BRAND') sourceCounts[src].brands++
      else sourceCounts[src].creators++
    }

    // Sort by total descending
    const sorted = Object.entries(sourceCounts)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([source, counts]) => ({ source, ...counts }))

    return NextResponse.json({ referrals: sorted, total: profiles.length })
  } catch (error) {
    console.error('Referrals error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
