import type { D1Database } from '@cloudflare/workers-types'

// Node.js runtime (next dev / next build). No Cloudflare bindings exist here;
// the Worker env is only present when this module is swapped for
// cf-env.workers.ts by the Vite/vinext alias.
export function getWorkerEnv(): { DB?: D1Database } | undefined {
  return undefined
}
