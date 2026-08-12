import type { SortBy } from '../hooks/useParkFilters'
import { PARK_TYPE_LABELS, type ParkType } from '../types/park'

const ALL_TYPES = Object.keys(PARK_TYPE_LABELS) as ParkType[]

const SORT_LABELS: Record<SortBy, string> = {
  name: 'Name (A–Z)',
  acres: 'Most acres',
  visited: 'Visited first',
  distance: 'Nearest',
}

interface ParkFiltersProps {
  selectedTypes: Set<ParkType>
  onSelectedTypesChange: (types: Set<ParkType>) => void
  searchText: string
  onSearchTextChange: (text: string) => void
  sortBy: SortBy
  onSortByChange: (sortBy: SortBy) => void
  hasUserPosition: boolean
  onRequestLocation: () => void
  locationLoading: boolean
  locationError: string | null
  resultCount: number
  totalCount: number
}

export default function ParkFilters({
  selectedTypes,
  onSelectedTypesChange,
  searchText,
  onSearchTextChange,
  sortBy,
  onSortByChange,
  hasUserPosition,
  onRequestLocation,
  locationLoading,
  locationError,
  resultCount,
  totalCount,
}: ParkFiltersProps) {
  function toggleType(type: ParkType) {
    const next = new Set(selectedTypes)
    if (next.has(type)) {
      next.delete(type)
    } else {
      next.add(type)
    }
    onSelectedTypesChange(next)
  }

  const sortOptions: SortBy[] = hasUserPosition
    ? ['name', 'acres', 'visited', 'distance']
    : ['name', 'acres', 'visited']

  return (
    <section className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {resultCount} of {totalCount} parks
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.map((type) => {
            const active = selectedTypes.has(type)
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {PARK_TYPE_LABELS[type]}
              </button>
            )
          })}
        </div>

        <input
          type="search"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Search parks by name…"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm sm:w-64 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRequestLocation}
            disabled={locationLoading}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-60 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            📍 {locationLoading ? 'Locating…' : 'Near me'}
          </button>
          {locationError && (
            <span className="text-xs text-red-500 dark:text-red-400">{locationError}</span>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortBy)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {SORT_LABELS[option]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}
