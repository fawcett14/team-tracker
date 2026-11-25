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
  const hasScore = game.homeScore !== null && game.awayScore !== null
  const teams = [
    { name: homeName, ours: game.isHome, score: game.homeScore },
    { name: awayName, ours: !game.isHome, score: game.awayScore },
  ]

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="rounded-lg border p-8 text-center">
        <div className="grid grid-cols-2 gap-4">
          {teams.map((t) => (
            <div key={t.name}>
              <div className={t.ours ? 'font-bold' : undefined}>{t.name}</div>
              <div className="font-mono text-lg">
                {hasScore ? t.score : '–'}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-zinc-500 mt-4">
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
