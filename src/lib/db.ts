import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel, Neon integration sets POSTGRES_PRISMA_URL at runtime.
// Locally, DATABASE_URL is used from .env.
const datasourceUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    ...(datasourceUrl ? { datasourceUrl } : {}),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db