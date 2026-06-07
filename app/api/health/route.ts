import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Verify database connectivity with a simple query
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Health check failed - database unreachable:', error)
    return NextResponse.json(
      { status: 'error', message: 'Database connection failed', timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}
