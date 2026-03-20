import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL
  if (!url) {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === 'then' || prop === 'catch' || typeof prop === 'symbol') {
          return undefined
        }
        return () => Promise.resolve(null)
      },
    })
  }
  return new PrismaClient({
    datasources: { db: { url } },
  })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
