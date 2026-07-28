import { PARK_TYPE_LABELS, type ParkType } from '../types/park'

const ALL_TYPES = Object.keys(PARK_TYPE_LABELS) as ParkType[]

interface ParkFiltersProps {
  selectedTypes: Set<ParkType>
  onSelectedTypesChange: (types: Set<ParkType>) => void
  searchText: string
  onSearchTextChange: (text: string) => void
}

export default function ParkFilters({
  selectedTypes,
  onSelectedTypesChange,
  searchText,
  onSearchTextChange,
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

  return (
    <section className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
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
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm sm:w-64"
      />
    </section>
  )
}
