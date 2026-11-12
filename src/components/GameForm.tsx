type GameFormProps = {
  action: (formData: FormData) => Promise<void>
  game?: {
    id: number
    date: Date
    opponent: string
    isHome: boolean
    homeScore: number | null
    awayScore: number | null
    videoUrl: string | null
  }
  error?: string
}

const inputClass = 'rounded border px-3 py-2 dark:bg-zinc-900'

export default function GameForm({ action, game, error }: GameFormProps) {
  const dateValue = game
    ? game.date.toISOString().slice(0, 10)
    : ''

  return (
    <form action={action} className="flex max-w-md flex-col gap-4">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      {game && <input type="hidden" name="id" value={game.id} />}

      <label className="flex flex-col gap-1 text-sm">
        Date
        <input name="date" type="date" required defaultValue={dateValue} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Opponent
        <input
          name="opponent"
          type="text"
          required
          defaultValue={game?.opponent}
          placeholder="Opponent team name"
          className={inputClass}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          name="isHome"
          type="checkbox"
          defaultChecked={game?.isHome ?? true}
          className="h-4 w-4"
        />
        Our team is home
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Home score
          <input
            name="homeScore"
            type="number"
            min={0}
            defaultValue={game?.homeScore ?? ''}
            placeholder="—"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Away score
          <input
            name="awayScore"
            type="number"
            min={0}
            defaultValue={game?.awayScore ?? ''}
            placeholder="—"
            className={inputClass}
          />
        </label>
      </div>
      <p className="-mt-2 text-xs text-zinc-500">Leave both empty for upcoming games.</p>

      <label className="flex flex-col gap-1 text-sm">
        Video URL (YouTube or Vimeo)
        <input
          name="videoUrl"
          type="url"
          defaultValue={game?.videoUrl ?? ''}
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
        />
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          {game ? 'Save changes' : 'Add game'}
        </button>
        <a href="/admin" className="rounded px-4 py-2 text-sm text-zinc-600 hover:underline dark:text-zinc-400">
          Cancel
        </a>
      </div>
    </form>
  )
}
