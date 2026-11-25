import Link from 'next/link'
import { prisma } from '@/lib/db'
import GameList from '@/components/GameList'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const teamName = team?.name ?? 'Us'
  const games = await prisma.game.findMany({ orderBy: { date: 'desc' } })

  const played = games.filter((g) => g.homeScore !== null && g.awayScore !== null)
  let won = 0
  let drawn = 0
  let lost = 0
  for (const g of played) {
    const ours = g.isHome ? g.homeScore! : g.awayScore!
    const theirs = g.isHome ? g.awayScore! : g.homeScore!
    if (ours > theirs) won++
    else if (ours === theirs) drawn++
    else lost++
  }

  const recent = played.slice(0, 3)
  const upcoming = games
    .filter((g) => g.homeScore === null || g.awayScore === null)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3)

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <header className="flex items-center gap-4 mb-8">
        {team?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={team.logoUrl} alt={team.name} className="h-16 w-16 object-contain" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-200 text-xl font-bold dark:bg-zinc-800">
            {team?.name?.charAt(0) ?? 'T'}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{teamName}</h1>
          <p className="text-sm text-zinc-500">Season record</p>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-10 text-center">
        <div className="rounded-lg border p-4">
          <div className="text-3xl font-bold text-green-600">{won}</div>
          <div className="text-sm text-zinc-500">Won</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-3xl font-bold">{drawn}</div>
          <div className="text-sm text-zinc-500">Drawn</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-3xl font-bold text-red-600">{lost}</div>
          <div className="text-sm text-zinc-500">Lost</div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Recent results</h2>
          <Link href="/results" className="text-sm text-blue-600 hover:underline">
            View more
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-zinc-500">No games played yet.</p>
        ) : (
          <GameList games={recent} teamName={teamName} />
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Upcoming fixtures</h2>
          <Link href="/fixtures" className="text-sm text-blue-600 hover:underline">
            View more
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-zinc-500">No upcoming games.</p>
        ) : (
          <GameList games={upcoming} teamName={teamName} />
        )}
      </section>
    </main>
  )
}
