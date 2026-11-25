'use client'

import { useRef, useState } from 'react'

type TeamSettingsFormProps = {
  action: (formData: FormData) => Promise<void>
  initialName: string
  initialLogoUrl: string
  initialHomeVenue: string
}

const inputClass = 'rounded border px-3 py-2 dark:bg-zinc-900'

export default function TeamSettingsForm({
  action,
  initialName,
  initialLogoUrl,
  initialHomeVenue,
}: TeamSettingsFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const scopeRef = useRef<HTMLInputElement>(null)
  const [showDialog, setShowDialog] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (scopeRef.current?.value) return
    const data = new FormData(e.currentTarget)
    const venue = String(data.get('homeVenue') ?? '').trim()
    if (venue !== '' && venue !== initialHomeVenue.trim()) {
      e.preventDefault()
      setShowDialog(true)
    }
  }

  function chooseScope(scope: 'all' | 'future') {
    if (scopeRef.current) scopeRef.current.value = scope
    setShowDialog(false)
    formRef.current?.requestSubmit()
  }

  return (
    <>
      <form
        ref={formRef}
        action={action}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="venueScope" ref={scopeRef} defaultValue="" />
        <label className="flex flex-col gap-1 text-sm">
          Team name
          <input
            name="name"
            type="text"
            required
            defaultValue={initialName}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Logo URL
          <input
            name="logoUrl"
            type="text"
            defaultValue={initialLogoUrl}
            placeholder="https://… or /logo.png"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Home venue
          <input
            name="homeVenue"
            type="text"
            defaultValue={initialHomeVenue}
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

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">Apply venue to existing fixtures?</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Applying to all previous fixtures will replace the venue on every home
              game, including played games and any custom per-match venues.
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => chooseScope('all')}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Apply to all previous fixtures
              </button>
              <button
                type="button"
                onClick={() => chooseScope('future')}
                className="rounded border px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Only apply to new fixtures
              </button>
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                className="rounded px-4 py-2 text-sm text-zinc-600 hover:underline dark:text-zinc-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
