import { useState } from "react";
import ParkMap from "../components/ParkMap";
import ParkBrowser from "../components/ParkBrowser";
import ParkFilters from "../components/ParkFilters";
import { useParks } from "../hooks/useParks";
import { useGeolocation } from "../hooks/useGeolocation";
import { useParkFilters } from "../hooks/useParkFilters";

export default function MyParks() {
  const { parks, isVisited } = useParks()
  const visitedParks = parks.filter((park) => isVisited(park.id))
  const { position: userPosition, error: locationError, loading: locationLoading, request: requestLocation } =
    useGeolocation()
  const {
    selectedTypes,
    setSelectedTypes,
    searchText,
    setSearchText,
    sortBy,
    setSortBy,
    filteredParks,
  } = useParkFilters(visitedParks, { isVisited, userPosition })
  const [highlightedParkId, setHighlightedParkId] = useState<number | null>(null)

  const totalCount = parks.length
  const visitedCount = visitedParks.length
  const percentVisited = totalCount > 0 ? Math.round((visitedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Parks</h1>
        <p className="text-gray-600 dark:text-gray-400">Parks you've marked as visited</p>

        <div className="flex w-full max-w-sm flex-col gap-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {visitedCount} of {totalCount} parks visited ({percentVisited}%)
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${percentVisited}%` }}
            />
          </div>
        </div>
      </div>

      <ParkMap
        parks={filteredParks}
        highlightedParkId={highlightedParkId}
        userPosition={userPosition}
      />

      <ParkFilters
        selectedTypes={selectedTypes}
        onSelectedTypesChange={setSelectedTypes}
        searchText={searchText}
        onSearchTextChange={setSearchText}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        hasUserPosition={userPosition !== null}
        onRequestLocation={requestLocation}
        locationLoading={locationLoading}
        locationError={locationError}
      />

      <ParkBrowser
        parks={filteredParks}
        onToggleDetails={setHighlightedParkId}
        userPosition={userPosition}
      />
    </div>
  )
}
