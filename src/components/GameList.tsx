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
  teamLogoUrl,
}: {
  games: GameListItem[]
  teamName: string
  teamLogoUrl?: string | null
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
        const homeLogo = g.isHome ? (teamLogoUrl ?? null) : null
        const awayLogo = g.isHome ? null : (teamLogoUrl ?? null)
        const teams = [
          { name: homeName, ours: g.isHome, score: g.homeScore, logoUrl: homeLogo },
          { name: awayName, ours: !g.isHome, score: g.awayScore, logoUrl: awayLogo },
        ]
        const [home, away] = teams
        return (
          <li key={g.id}>
            <Link
              href={`/matches/${g.id}`}
              className="block px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={home.logoUrl ?? '/crest-placeholder.svg'}
                      alt={home.logoUrl ? home.name : ''}
                      className="h-8 w-8 shrink-0 object-contain"
                    />
                    <span className={home.ours ? 'font-bold' : undefined}>{home.name}</span>
                  </div>
                  <div className="font-mono">{hasScore ? home.score : '–'}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2">
                    <span className={away.ours ? 'font-bold' : undefined}>{away.name}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={away.logoUrl ?? '/crest-placeholder.svg'}
                      alt={away.logoUrl ? away.name : ''}
                      className="h-8 w-8 shrink-0 object-contain"
                    />
                  </div>
                  <div className="font-mono">{hasScore ? away.score : '–'}</div>
                </div>
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
