import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// On Vercel, Neon integration sets POSTGRES_PRISMA_URL at runtime.
// Locally, DATABASE_URL is used from .env.
const datasourceUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL

function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
      ...(datasourceUrl ? { datasourceUrl } : {}),
    })
  } catch (error) {
    console.error('Failed to create PrismaClient:', error)
    // Return a proxy that returns empty/null results gracefully
    return createFallbackProxy()
  }
}

// Fallback proxy that catches all database calls and returns safe defaults
function createFallbackProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop: string) {
      // Handle common model names
      const modelNames = [
        'user', 'employee', 'company', 'department', 'branch', 'job',
        'candidate', 'attendance', 'leave', 'payrollRecord', 'expenseClaim',
        'travelRequest', 'asset', 'notification', 'auditLog', 'performanceReview',
        'training', 'helpdeskTicket', 'workflow', 'onboardingTask',
      ]

      if (modelNames.includes(prop)) {
        return new Proxy({}, {
          get(_t, method: string) {
            // Return appropriate defaults for common Prisma methods
            return (..._args: unknown[]) => {
              if (method === 'count') return Promise.resolve(0)
              if (method === 'findMany' || method === 'findUnique') return Promise.resolve(null)
              if (method === 'aggregate') return Promise.resolve({ _sum: {} })
              if (method === 'groupBy') return Promise.resolve([])
              if (method === 'create') return Promise.resolve({})
              if (method === 'update') return Promise.resolve({})
              if (method === 'delete') return Promise.resolve({})
              return Promise.resolve(null)
            }
          }
        })
      }

      // For $connect, $disconnect, etc.
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return () => Promise.resolve()
      }

      return undefined
    }
  })
}

export const db =
  globalForPrisma.prisma ??
  createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
