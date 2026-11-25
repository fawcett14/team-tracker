import Link from 'next/link'
import { prisma } from '@/lib/db'
import { updateTeamSettings } from '../actions'

export const dynamic = 'force-dynamic'

const inputClass = 'rounded border px-3 py-2 dark:bg-zinc-900'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function AdminPage({ searchParams }: PageProps<'/admin'>) {
  const { error, saved } = await searchParams
  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const teamName = team?.name ?? 'Us'
  const games = await prisma.game.findMany({
    orderBy: { date: 'desc' },
    include: { goalScorers: true },
  })

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">Games</h1>

      {typeof saved === 'string' && saved === '1' && (
        <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
          Team settings saved.
        </p>
      )}
      {typeof error === 'string' && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="mb-10 max-w-md rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-3">Team settings</h2>
        <form action={updateTeamSettings} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Team name
            <input
              name="name"
              type="text"
              required
              defaultValue={team?.name ?? ''}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Logo URL
            <input
              name="logoUrl"
              type="text"
              defaultValue={team?.logoUrl ?? ''}
              placeholder="https://… or /logo.png"
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Home venue
            <input
              name="homeVenue"
              type="text"
              defaultValue={team?.homeVenue ?? ''}
              placeholder="Default venue for home games"
              className={inputClass}
            />
          </label>
          <div>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save team settings
            </button>
          </div>
        </form>
      </section>

      {games.length === 0 ? (
        <p className="text-zinc-500">No games yet. Add your first game.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {games.map((g) => {
            const matchup = g.isHome ? `${teamName} vs ${g.opponent}` : `${g.opponent} vs ${teamName}`
            const score =
              g.homeScore !== null && g.awayScore !== null
                ? `${g.isHome ? g.homeScore : g.awayScore} - ${g.isHome ? g.awayScore : g.homeScore}`
                : 'vs'
            return (
              <li key={g.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-medium">
                    {matchup} <span className="font-mono text-zinc-600 dark:text-zinc-400">{score}</span>
                  </div>
                  <div className="text-sm text-zinc-500">
                    {formatDate(g.date)}
                    {g.videoUrl && ' · video'}
                    {g.goalScorers.length > 0 && ` · ${g.goalScorers.length} scorer(s)`}
                  </div>
                </div>
                <Link href={`/admin/games/${g.id}`} className="text-sm text-blue-600 hover:underline">
                  Edit
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
