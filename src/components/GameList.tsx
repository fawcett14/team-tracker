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
}

export default function GameList({
  games,
  teamName,
  showScores,
}: {
  games: GameListItem[]
  teamName: string
  showScores: boolean
}) {
  if (games.length === 0) {
    return <p className="text-zinc-500">No games to show.</p>
  }

  return (
    <ul className="divide-y rounded-lg border">
      {games.map((g) => {
        const matchup = g.isHome
          ? `${teamName} vs ${g.opponent}`
          : `${g.opponent} vs ${teamName}`
        const ours = g.isHome ? g.homeScore : g.awayScore
        const theirs = g.isHome ? g.awayScore : g.homeScore
        const hasScore = g.homeScore !== null && g.awayScore !== null
        return (
          <li key={g.id}>
            <Link
              href={`/matches/${g.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <span>{matchup}</span>
              {showScores && hasScore && (
                <span className="font-mono">
                  {ours} - {theirs}
                </span>
              )}
              <span className="text-sm text-zinc-500">{formatDate(g.date)}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
