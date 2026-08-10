import { useEffect, useState } from 'react'
import { fetchParkSummary, type ParkSummary } from '../lib/wikipedia'

export function useParkSummary(parkName: string) {
  const [summary, setSummary] = useState<ParkSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchParkSummary(parkName).then((result) => {
      if (cancelled) return
      setSummary(result)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [parkName])

  return { summary, loading }
}
