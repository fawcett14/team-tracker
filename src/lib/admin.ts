import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifySessionToken, SESSION_COOKIE } from './session'

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect('/admin/login')
}
