import Link from 'next/link'

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

type GameListItem = {
  id: number
  date: Date
  opponent: string
  isHome: boolean
  homeScore: number | null
  awayScore: number | null
  venue: string | null
}

export default function GameList({
  games,
  teamName,
}: {
  games: GameListItem[]
  teamName: string
}) {
  if (games.length === 0) {
    return <p className="text-zinc-500">No games to show.</p>
  }

  return (
    <ul className="divide-y rounded-lg border">
      {games.map((g) => {
        const hasScore = g.homeScore !== null && g.awayScore !== null
        const homeName = g.isHome ? teamName : g.opponent
        const awayName = g.isHome ? g.opponent : teamName
        const teams = [
          { name: awayName, ours: !g.isHome, score: g.awayScore },
          { name: homeName, ours: g.isHome, score: g.homeScore },
        ]
        return (
          <li key={g.id}>
            <Link
              href={`/matches/${g.id}`}
              className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                {teams.map((t) => (
                  <div key={t.name}>
                    <div className={t.ours ? 'font-bold' : undefined}>{t.name}</div>
                    <div className="font-mono text-lg">
                      {hasScore ? t.score : '–'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-1 text-sm text-zinc-500">
                {formatDate(g.date)}
                {g.venue ? ` · ${g.venue}` : ''}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
