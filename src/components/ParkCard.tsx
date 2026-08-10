import { useState } from 'react'
import { useParks } from '../hooks/useParks'
import { useParkSummary } from '../hooks/useParkSummary'
import { haversineDistanceMiles } from '../lib/geo'
import { PARK_TYPE_LABELS, type Park, type ParkType } from '../types/park'

const PARK_TYPE_EMOJI: Record<ParkType, string> = {
  SP: '🏕',
  SF: '🌲',
  SRA: '🏞',
  RRA: '🌊',
}

interface ParkCardProps {
  park: Park
  onToggleDetails?: (parkId: number | null) => void
  userPosition?: [number, number] | null
}

export default function ParkCard({ park, onToggleDetails, userPosition }: ParkCardProps) {
  const { isVisited, toggleVisited } = useParks()
  const visited = isVisited(park.id)
  const { summary, loading } = useParkSummary(park.name)
  const [expanded, setExpanded] = useState(false)

  const facts: string[] = []
  if (park.acres != null) facts.push(`${Math.round(park.acres).toLocaleString()} acres`)
  if (userPosition) facts.push(`${haversineDistanceMiles(userPosition, park.position).toFixed(1)} mi away`)

  function handleToggleDetails() {
    const next = !expanded
    setExpanded(next)
    onToggleDetails?.(next ? park.id : null)
  }

  return (
    <article className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{park.name}</h3>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {PARK_TYPE_LABELS[park.type]}
        </span>
      </div>

      {facts.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{facts.join(' · ')}</p>
      )}

      {!loading && summary && (
        <div className="flex gap-3">
          {summary.thumbnailUrl && (
            <img
              src={summary.thumbnailUrl}
              alt={park.name}
              className="h-20 w-20 shrink-0 rounded-md object-cover"
            />
          )}
          <div className="flex flex-col gap-1">
            {expanded && summary.description && (
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{summary.description}</p>
            )}
            <p className={`text-sm text-gray-600 dark:text-gray-300 ${expanded ? '' : 'line-clamp-3'}`}>
              {summary.extract}
            </p>
          </div>
        </div>
      )}

      {!loading && !summary && (
        <div className="flex gap-3">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-gray-100 text-2xl dark:bg-gray-700">
            {PARK_TYPE_EMOJI[park.type]}
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-sm italic text-gray-400 dark:text-gray-500">No description available.</p>
          </div>
        </div>
      )}

      {expanded && (
        <div className="flex items-center gap-3 border-t border-gray-100 pt-2 dark:border-gray-700">
          {summary && (
            <a
              href={summary.pageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-gray-400 hover:underline dark:text-gray-500"
            >
              via Wikipedia
            </a>
          )}
          <a
            href={park.infoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            DNR page ↗
          </a>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={handleToggleDetails}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          {expanded ? 'Show less' : 'Show more details'}
        </button>
        <button
          type="button"
          onClick={() => toggleVisited(park.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            visited
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {visited ? 'Remove from My Parks' : 'Mark visited'}
        </button>
      </div>
    </article>
  )
}
