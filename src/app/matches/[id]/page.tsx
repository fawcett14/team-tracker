import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function MatchPage({ params }: PageProps<'/matches/[id]'>) {
  const { id } = await params
  const game = await prisma.game.findUnique({ where: { id: Number(id) } })
  if (!game) notFound()

  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const teamName = team?.name ?? 'Us'

  const homeName = game.isHome ? teamName : game.opponent
  const awayName = game.isHome ? game.opponent : teamName
  const homeLogo = game.isHome ? (team?.logoUrl ?? null) : null
  const awayLogo = game.isHome ? null : (team?.logoUrl ?? null)
  const hasScore = game.homeScore !== null && game.awayScore !== null
  const teams = [
    { name: homeName, ours: game.isHome, score: game.homeScore, logoUrl: homeLogo },
    { name: awayName, ours: !game.isHome, score: game.awayScore, logoUrl: awayLogo },
  ]

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="rounded-lg border p-10">
        <div className="space-y-6">
          {teams.map((t) => (
            <div key={t.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.logoUrl ?? '/crest-placeholder.svg'}
                  alt={t.logoUrl ? t.name : ''}
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <div className={`truncate text-2xl ${t.ours ? 'font-bold' : 'font-semibold'}`}>
                  {t.name}
                </div>
              </div>
              <div className="font-mono text-3xl shrink-0">
                {hasScore ? t.score : '–'}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-lg text-zinc-500">
          {formatDate(game.date)}
          {game.venue ? ` · ${game.venue}` : ''}
        </p>
      </div>

      {game.videoUrl && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Match video</h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <iframe
              src={game.videoUrl}
              title={`${homeName} vs ${awayName}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      <p className="mt-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          &larr; Back to homepage
        </Link>
      </p>
    </main>
  );
}
