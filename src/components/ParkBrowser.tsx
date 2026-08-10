import { useParks } from '../hooks/useParks'
import ParkCard from './ParkCard'
import type { Park } from '../types/park'

interface ParkBrowserProps {
  parks: Park[]
  onToggleDetails?: (parkId: number | null) => void
  userPosition?: [number, number] | null
}

export default function ParkBrowser({ parks, onToggleDetails, userPosition }: ParkBrowserProps) {
  const { loading, error } = useParks()

  return (
    <section className="max-h-[45vh] overflow-y-auto rounded-md">
      {loading ? (
        <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
          Loading parks…
        </div>
      ) : error ? (
        <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-red-300 bg-white text-red-500 dark:border-red-800 dark:bg-gray-800 dark:text-red-400">
          Couldn't load park data: {error}
        </div>
      ) : parks.length === 0 ? (
        <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
          No parks match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {parks.map((park) => (
            <ParkCard
              key={park.id}
              park={park}
              onToggleDetails={onToggleDetails}
              userPosition={userPosition}
            />
          ))}
        </div>
      )}
    </section>
  )
}
