import ParkMap from "../components/ParkMap";
import ParkBrowser from "../components/ParkBrowser";
import ParkFilters from "../components/ParkFilters";
import { useParks } from "../context/ParksContext";
import { useParkFilters } from "../hooks/useParkFilters";

export default function MyParks() {
  const { parks, isVisited } = useParks()
  const visitedParks = parks.filter((park) => isVisited(park.id))
  const { selectedTypes, setSelectedTypes, searchText, setSearchText, filteredParks } =
    useParkFilters(visitedParks)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">My Parks</h1>
        <p>Parks you've marked as visited</p>
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
