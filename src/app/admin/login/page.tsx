import { login } from '../actions'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const { error, next } = await searchParams

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      {typeof error === 'string' && error === 'invalid' && (
        <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          Invalid username or password.
        </p>
      )}
      <form action={login} className="flex flex-col gap-4">
        {typeof next === 'string' && next.startsWith('/admin') && (
          <input type="hidden" name="next" value={next} />
        )}
        <label className="flex flex-col gap-1 text-sm">
          Username
          <input
            name="username"
            type="text"
            required
            autoComplete="username"
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded border px-3 py-2 dark:bg-zinc-900"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Log in
        </button>
      </form>
    </main>
  );
}
