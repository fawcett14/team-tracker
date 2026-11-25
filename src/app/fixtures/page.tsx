import Link from 'next/link'
import { prisma } from '@/lib/db'
import GameList from '@/components/GameList'

export const dynamic = 'force-dynamic'

export default async function FixturesPage() {
  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const games = await prisma.game.findMany({
    where: { OR: [{ homeScore: null }, { awayScore: null }] },
    orderBy: { date: 'asc' },
  })

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">All fixtures</h1>
      <GameList games={games} teamName={team?.name ?? 'Us'} />
      <p className="mt-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to homepage
        </Link>
      </p>
    </main>
  )
}
