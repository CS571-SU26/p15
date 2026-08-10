import { WIKIPEDIA_TITLE_OVERRIDES } from './parkOverrides'

export interface ParkSummary {
  extract: string
  description: string | null
  thumbnailUrl: string | null
  pageUrl: string
}

interface WikipediaSummaryResponse {
  type?: string
  extract: string
  description?: string
  thumbnail?: { source: string }
  content_urls?: { desktop?: { page?: string } }
}

// Wikipedia starts returning 429s under a rapid burst (confirmed while
// batch-checking all 80 park names) — this app can mount up to 80 ParkCards
// at once, so every request is spaced out through one shared throttle
// rather than firing in parallel.
const THROTTLE_MS = 300
let nextAvailableAt = 0

function throttledFetch(url: string): Promise<Response> {
  const runAt = Math.max(Date.now(), nextAvailableAt)
  nextAvailableAt = runAt + THROTTLE_MS
  const delay = runAt - Date.now()
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fetch(url).then(resolve, reject)
    }, delay)
  })
}

function titleToUrl(title: string): string {
  return `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`
}

async function fetchSummaryByTitle(title: string): Promise<ParkSummary | null> {
  const response = await throttledFetch(titleToUrl(title))
  if (!response.ok) return null

  const data = (await response.json()) as WikipediaSummaryResponse
  if (data.type === 'disambiguation') return null

  return {
    extract: data.extract,
    description: data.description ?? null,
    thumbnailUrl: data.thumbnail?.source ?? null,
    pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
  }
}

async function resolveTitleViaSearch(name: string): Promise<string | null> {
  const url =
    `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(name)}` +
    '&limit=1&namespace=0&format=json&origin=*'
  const response = await throttledFetch(url)
  if (!response.ok) return null

  const [, titles] = (await response.json()) as [string, string[]]
  return titles[0] ?? null
}

const summaryCache = new Map<string, Promise<ParkSummary | null>>()

export function fetchParkSummary(parkName: string): Promise<ParkSummary | null> {
  const cached = summaryCache.get(parkName)
  if (cached) return cached

  const promise = (async () => {
    const override = WIKIPEDIA_TITLE_OVERRIDES[parkName]
    if (override) return fetchSummaryByTitle(override)

    const direct = await fetchSummaryByTitle(parkName)
    if (direct) return direct

    const resolvedTitle = await resolveTitleViaSearch(parkName)
    return resolvedTitle ? fetchSummaryByTitle(resolvedTitle) : null
  })()

  summaryCache.set(parkName, promise)
  return promise
}
