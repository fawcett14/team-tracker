'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/admin'
import { createSessionToken, SESSION_COOKIE } from '@/lib/session'
import { verifyPassword } from '@/lib/password'
import { normalizeVideoUrl } from '@/lib/video'

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export async function login(formData: FormData) {
  const username = String(formData.get('username') ?? '')
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  const valid =
    username === process.env.ADMIN_USERNAME &&
    verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)

  if (!valid) redirect('/admin/login?error=invalid')

  const token = await createSessionToken()
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
  redirect(next.startsWith('/admin') ? next : '/admin')
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

function parseScore(value: FormDataEntryValue | null): number | null | 'invalid' {
  const raw = String(value ?? '').trim()
  if (raw === '') return null
  const n = Number(raw)
  if (!Number.isInteger(n) || n < 0) return 'invalid'
  return n
}

type ParsedGame =
  | {
      data: {
        date: Date
        opponent: string
        isHome: boolean
        homeScore: number | null
        awayScore: number | null
        videoUrl: string | null
      }
    }
  | { error: string }

function parseGameForm(formData: FormData): ParsedGame {
  const dateRaw = String(formData.get('date') ?? '')
  const opponent = String(formData.get('opponent') ?? '').trim()
  const isHome = formData.get('isHome') === 'on'
  const homeScore = parseScore(formData.get('homeScore'))
  const awayScore = parseScore(formData.get('awayScore'))
  const videoRaw = String(formData.get('videoUrl') ?? '').trim()

  if (!dateRaw || !opponent) return { error: 'Date and opponent are required' }
  if (homeScore === 'invalid' || awayScore === 'invalid') {
    return { error: 'Scores must be whole numbers of 0 or more' }
  }
  if ((homeScore === null) !== (awayScore === null)) {
    return { error: 'Enter both scores or leave both empty' }
  }
  const videoUrl = videoRaw === '' ? null : normalizeVideoUrl(videoRaw)
  if (videoRaw !== '' && videoUrl === null) {
    return { error: 'Video URL must be a YouTube or Vimeo link' }
  }

  const date = new Date(`${dateRaw}T12:00:00.000Z`)
  if (Number.isNaN(date.getTime())) return { error: 'Invalid date' }

  return {
    data: {
      date,
      opponent,
      isHome,
      homeScore,
      awayScore,
      videoUrl,
    },
  }
}

export async function createGame(formData: FormData) {
  await requireAdmin()
  const result = parseGameForm(formData)
  if ('error' in result) redirect(`/admin/games/new?error=${encodeURIComponent(result.error)}`)
  await prisma.game.create({ data: result.data })
  redirect('/admin')
}

export async function updateGame(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const result = parseGameForm(formData)
  if ('error' in result) {
    redirect(`/admin/games/${id}?error=${encodeURIComponent(result.error)}`)
  }
  await prisma.game.update({ where: { id }, data: result.data })
  redirect('/admin')
}

export async function deleteGame(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.game.delete({ where: { id } })
  redirect('/admin')
}

export async function updateTeamSettings(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  const logoRaw = String(formData.get('logoUrl') ?? '').trim()
  if (!name) redirect('/admin?error=' + encodeURIComponent('Team name is required'))
  if (logoRaw !== '' && !/^(https?:\/\/|\/)/.test(logoRaw)) {
    redirect('/admin?error=' + encodeURIComponent('Logo URL must be a web address or site path'))
  }
  await prisma.team.upsert({
    where: { id: 1 },
    update: { name, logoUrl: logoRaw === '' ? null : logoRaw },
    create: { id: 1, name, logoUrl: logoRaw === '' ? null : logoRaw },
  })
  redirect('/admin?saved=1')
}

export async function addGoalScorer(formData: FormData) {
  await requireAdmin()
  const gameId = Number(formData.get('gameId'))
  const playerName = String(formData.get('playerName') ?? '').trim()
  const side = String(formData.get('side') ?? '')
  if (!playerName || (side !== 'us' && side !== 'opponent')) {
    redirect(`/admin/games/${gameId}?error=${encodeURIComponent('Scorer name and team are required')}`)
  }
  await prisma.goalScorer.create({ data: { gameId, playerName, side } })
  redirect(`/admin/games/${gameId}`)
}

export async function deleteGoalScorer(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('scorerId'))
  const gameId = Number(formData.get('gameId'))
  await prisma.goalScorer.delete({ where: { id } })
  redirect(`/admin/games/${gameId}`)
}
