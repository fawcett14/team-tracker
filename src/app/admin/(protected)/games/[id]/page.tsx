import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import GameForm from '@/components/GameForm'
import { updateGame, deleteGame, addGoalScorer, deleteGoalScorer } from '../../../actions'

export const dynamic = 'force-dynamic'

const inputClass = 'rounded border px-3 py-2 dark:bg-zinc-900'

export default async function EditGamePage({
  params,
  searchParams,
}: PageProps<'/admin/games/[id]'>) {
  const { id } = await params
  const { error } = await searchParams
  const gameId = Number(id)

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { goalScorers: { orderBy: { id: 'asc' } } },
  })
  if (!game) notFound()

  const team = await prisma.team.findUnique({ where: { id: 1 } })
  const teamName = team?.name ?? 'Us'

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">Edit game</h1>
      <GameForm
        action={updateGame}
        game={game}
        defaultVenue={team?.homeVenue ?? ''}
        error={typeof error === 'string' ? error : undefined}
      />

      <section className="mt-10 max-w-md">
        <h2 className="text-xl font-semibold mb-3">Goal scorers</h2>
        <p className="mb-4 text-xs text-zinc-500">
          Admin only — never shown on the public site.
        </p>

        {game.goalScorers.length === 0 ? (
          <p className="text-sm text-zinc-500 mb-4">No scorers recorded.</p>
        ) : (
          <ul className="mb-4 divide-y rounded-lg border">
            {game.goalScorers.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span>
                  {s.playerName}{' '}
                  <span className="text-zinc-500">
                    ({s.side === 'us' ? teamName : game.opponent})
                  </span>
                </span>
                <form action={deleteGoalScorer}>
                  <input type="hidden" name="scorerId" value={s.id} />
                  <input type="hidden" name="gameId" value={game.id} />
                  <button type="submit" className="text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <form action={addGoalScorer} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="gameId" value={game.id} />
          <label className="flex flex-col gap-1 text-sm">
            Player name
            <input name="playerName" type="text" required className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Team
            <select name="side" className={inputClass} defaultValue="us">
              <option value="us">{teamName}</option>
              <option value="opponent">{game.opponent}</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add scorer
          </button>
        </form>
      </section>

      <section className="mt-10 max-w-md border-t pt-6">
        <h2 className="text-lg font-semibold mb-3 text-red-600">Danger zone</h2>
        <form action={deleteGame}>
          <input type="hidden" name="id" value={game.id} />
          <button
            type="submit"
            className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
          >
            Delete this game
          </button>
        </form>
      </section>
    </main>
  )
}
