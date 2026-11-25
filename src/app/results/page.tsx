import Link from 'next/link'
import { prisma } from '@/lib/db'
import GameList from '@/components/GameList'

export const dynamic = 'force-dynamic'

export default async function ResultsPage() {
  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const games = await prisma.game.findMany({
    where: { homeScore: { not: null }, awayScore: { not: null } },
    orderBy: { date: 'desc' },
  })

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">All results</h1>
      <GameList games={games} teamName={team?.name ?? 'Us'} />
      <p className="mt-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to homepage
        </Link>
      </p>
    </main>
  )
}
