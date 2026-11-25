import { prisma } from '@/lib/db'
import GameForm from '@/components/GameForm'
import { createGame } from '../../../actions'

export const dynamic = 'force-dynamic'

export default async function NewGamePage({ searchParams }: PageProps<'/admin/games/new'>) {
  const { error } = await searchParams
  const team = await prisma.team.findUnique({ where: { id: 1 } })

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6">New game</h1>
      <GameForm
        action={createGame}
        defaultVenue={team?.homeVenue ?? ''}
        error={typeof error === 'string' ? error : undefined}
      />
    </main>
  )
}
