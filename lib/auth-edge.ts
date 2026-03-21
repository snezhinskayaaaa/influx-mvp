import { jwtVerify } from 'jose'

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET environment variable must be set and at least 32 characters long')
}
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const COOKIE_NAME = 'influx-token'

export interface TokenPayload {
  userId: string
  role: 'INFLUENCER' | 'BRAND' | 'ADMIN'
}

export async function verifyTokenEdge(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export { COOKIE_NAME }
