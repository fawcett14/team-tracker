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

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
      <div className="rounded-lg border p-8 text-center">
        {hasScore ? (
          <h1 className="text-2xl font-bold">
            {homeName} {game.homeScore} - {game.awayScore} {awayName}
          </h1>
        ) : (
          <>
            <h1 className="text-2xl font-bold">{homeName}</h1>
            <p className="text-zinc-500 my-4">vs</p>
            <h2 className="text-2xl font-bold mt-2">{awayName}</h2>
          </>
        )}
        <p className="text-xs text-zinc-500 mt-4">{formatDate(game.date)}</p>
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
