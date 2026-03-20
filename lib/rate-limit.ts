const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(key: string, maxRequests: number = 5, windowMs: number = 60000): { success: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  // Clean up expired entries periodically
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
