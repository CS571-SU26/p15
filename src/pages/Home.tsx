import ParkMap from '../components/ParkMap'
import ParkBrowser from '../components/ParkBrowser'
import ParkFilters from '../components/ParkFilters'
import { useParks } from '../context/ParksContext'
import { useParkFilters } from '../hooks/useParkFilters'

export default function Home() {
  const { parks } = useParks()
  const { selectedTypes, setSelectedTypes, searchText, setSearchText, filteredParks } =
    useParkFilters(parks)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Wisconsin State Park Tracker</h1>
      </div>

      <ParkMap parks={filteredParks} />

      <ParkFilters
        selectedTypes={selectedTypes}
        onSelectedTypesChange={setSelectedTypes}
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />

      <ParkBrowser parks={filteredParks} />
    </div>
  )
}
