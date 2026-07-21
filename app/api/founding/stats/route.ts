import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [projectCount, creatorCount] = await Promise.all([
      prisma.brand.count(),
      prisma.influencer.count(),
    ])

    return NextResponse.json({
      projects: Math.min(projectCount, 10),
      creators: Math.min(creatorCount, 20),
    })
  } catch {
    return NextResponse.json({ projects: 0, creators: 0 })
  }
}
