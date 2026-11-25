import { env } from 'cloudflare:workers'

// Accessed lazily: bindings are only populated inside a request context,
// so `env` must not be snapshotted at module-eval time.
export function getWorkerEnv() {
  return env as unknown as { DB?: D1Database }
}
