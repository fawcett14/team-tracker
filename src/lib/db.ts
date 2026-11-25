import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import { getWorkerEnv } from '@/lib/cf-env'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function isWorkersRuntime() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.userAgent === 'Cloudflare-Workers'
  )
}

function createPrismaClient() {
  const d1 = getWorkerEnv()?.DB
  if (isWorkersRuntime() && !d1) {
    // Fail loudly instead of silently falling back to the Node query engine,
    // which does not exist on Workers. Nothing is cached, so a later request
    // with bindings visible can still succeed.
    throw new Error('D1 binding (env.DB) is not available in this context')
  }
  if (d1) {
    return new PrismaClient({ adapter: new PrismaD1(d1) })
  }
  return new PrismaClient()
}

function getPrismaClient() {
  globalForPrisma.prisma ??= createPrismaClient()
  return globalForPrisma.prisma
}

// Resolved lazily on first use: on Workers, `cloudflare:workers` env bindings
// are only populated inside a request context, not at module-eval time.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient()
    const value = Reflect.get(client, prop)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
