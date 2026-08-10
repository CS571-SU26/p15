import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { fetchParks } from '../lib/parks'
import { ParksContext, type ParksContextValue } from '../hooks/useParks'
import type { Park } from '../types/park'

const VISITED_STORAGE_KEY = 'wsps:visitedParks'

function loadVisited(): Set<number> {
  try {
    const raw = localStorage.getItem(VISITED_STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set()
  } catch {
    return new Set()
  }
}

export function ParksProvider({ children }: { children: ReactNode }) {
  const [parks, setParks] = useState<Park[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visited, setVisited] = useState<Set<number>>(loadVisited)

  useEffect(() => {
    let cancelled = false

    fetchParks()
      .then((fetched) => {
        if (!cancelled) setParks(fetched)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load parks')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(VISITED_STORAGE_KEY, JSON.stringify([...visited]))
  }, [visited])

  const value = useMemo<ParksContextValue>(
    () => ({
      parks,
      loading,
      error,
      isVisited: (id) => visited.has(id),
      toggleVisited: (id) =>
        setVisited((prev) => {
          const next = new Set(prev)
          if (next.has(id)) {
            next.delete(id)
          } else {
            next.add(id)
          }
          return next
        }),
      clearVisited: () => setVisited(new Set()),
    }),
    [parks, loading, error, visited],
  )

  return <ParksContext.Provider value={value}>{children}</ParksContext.Provider>
}
