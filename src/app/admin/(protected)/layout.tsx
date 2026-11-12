import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { logout } from '../actions'

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  await requireAdmin()

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/admin" className="font-bold">
            Admin
          </Link>
          <Link href="/admin/games/new" className="text-sm text-blue-600 hover:underline">
            New game
          </Link>
          <Link href="/" className="text-sm text-zinc-500 hover:underline">
            View site
          </Link>
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-zinc-500 hover:underline">
            Log out
          </button>
        </form>
      </header>
      {children}
    </div>
  )
}
