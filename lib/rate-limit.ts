import { Redis } from '@upstash/redis'

// Redis client — initialized lazily, only if env vars are set
let redis: Redis | null = null

function getRedis(): Redis | null {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) {
    redis = new Redis({ url, token })
    return redis
  }
  return null
}

// In-memory fallback (used when Redis is not configured)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): Promise<{ success: boolean; remaining: number }> {
  const r = getRedis()

  // Redis path — persists across deploys
  if (r) {
    try {
      const redisKey = `rl:${key}`
      const windowSec = Math.ceil(windowMs / 1000)
      const count = await r.incr(redisKey)
      if (count === 1) {
        await r.expire(redisKey, windowSec)
      }
      if (count > maxRequests) {
        return { success: false, remaining: 0 }
      }
      return { success: true, remaining: maxRequests - count }
    } catch (err) {
      console.error('Redis rate limit error, falling back to in-memory:', err)
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetTime) rateLimitMap.delete(k)
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count }
}
