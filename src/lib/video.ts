const YOUTUBE_PATTERNS = [
  /(?:youtube\.com\/watch\?[^#]*v=)([\w-]{6,})/,
  /(?:youtu\.be\/)([\w-]{6,})/,
  /(?:youtube\.com\/shorts\/)([\w-]{6,})/,
  /(?:youtube\.com\/embed\/)([\w-]{6,})/,
  /(?:youtube\.com\/live\/)([\w-]{6,})/,
]

const VIMEO_PATTERN = /(?:vimeo\.com\/(?:video\/)?)(\d+)/

export function normalizeVideoUrl(input: string): string | null {
  const url = input.trim()
  if (!url) return null

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube.com/embed/${match[1]}`
  }

  const vimeo = url.match(VIMEO_PATTERN)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`

  return null
}
