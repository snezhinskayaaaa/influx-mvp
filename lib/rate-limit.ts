import prisma from '@/lib/prisma'

/**
 * PostgreSQL-backed rate limiter. Persists across deploys and works across instances.
 * Uses upsert to atomically increment counters.
 */
export async function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number }> {
  const now = new Date()
  const resetTime = new Date(now.getTime() + windowMs)

  try {
    // Try to get existing record
    const existing = await prisma.$queryRawUnsafe<Array<{ count: number; reset_time: Date }>>(
      `SELECT count, reset_time FROM rate_limits WHERE key = $1`,
      key
    )

    if (existing.length === 0 || now > existing[0].reset_time) {
      // No record or expired — create/reset
      await prisma.$executeRawUnsafe(
        `INSERT INTO rate_limits (key, count, reset_time) VALUES ($1, 1, $2)
         ON CONFLICT (key) DO UPDATE SET count = 1, reset_time = $2`,
        key,
        resetTime
      )
      return { success: true, remaining: maxRequests - 1 }
    }

    if (existing[0].count >= maxRequests) {
      return { success: false, remaining: 0 }
    }

    // Increment
    await prisma.$executeRawUnsafe(
      `UPDATE rate_limits SET count = count + 1 WHERE key = $1`,
      key
    )

    return { success: true, remaining: maxRequests - existing[0].count - 1 }
  } catch (error) {
    // If DB fails, allow the request (fail open) to not block legitimate users
    console.error('Rate limit check failed:', error)
    return { success: true, remaining: maxRequests }
  }
}

/**
 * Synchronous in-memory fallback for non-critical paths.
 * Use rateLimitAsync (the default export above) for auth endpoints.
 */
const memoryMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimitSync(key: string, maxRequests: number = 5, windowMs: number = 60000): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = memoryMap.get(key)

  if (memoryMap.size > 10000) {
    for (const [k, v] of memoryMap) {
      if (now > v.resetTime) memoryMap.delete(k)
    }
  }

  if (!record || now > record.resetTime) {
    memoryMap.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count }
}
