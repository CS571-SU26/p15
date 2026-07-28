import { useParks } from '../context/ParksContext'
import { PARK_TYPE_LABELS, type Park } from '../types/park'

interface ParkCardProps {
  park: Park
}

export default function ParkCard({ park }: ParkCardProps) {
  const { isVisited, toggleVisited } = useParks()
  const visited = isVisited(park.id)

  return (
    <article className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900">{park.name}</h3>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
          {PARK_TYPE_LABELS[park.type]}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        <a
          href={park.infoUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          DNR page ↗
        </a>
        <button
          type="button"
          onClick={() => toggleVisited(park.id)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            visited
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {visited ? 'Remove from My Parks' : 'Mark visited'}
        </button>
      </div>
    </article>
  )
}
