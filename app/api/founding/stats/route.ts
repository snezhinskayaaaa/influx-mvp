import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [projects, creators] = await Promise.all([
      prisma.brand.count({ where: { foundingMember: true } }),
      prisma.influencer.count({ where: { foundingMember: true } }),
    ])

    return NextResponse.json({ projects, creators })
  } catch {
    return NextResponse.json({ projects: 0, creators: 0 })
  }
}
