import { useState } from 'react'
import ParkMap from '../components/ParkMap'
import ParkBrowser from '../components/ParkBrowser'
import ParkFilters from '../components/ParkFilters'
import { useParks } from '../hooks/useParks'
import { useGeolocation } from '../hooks/useGeolocation'
import { useParkFilters } from '../hooks/useParkFilters'

export default function Home() {
  const { parks, isVisited } = useParks()
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
  } = useParkFilters(parks, { isVisited, userPosition })
  const [highlightedParkId, setHighlightedParkId] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Wisconsin State Park Tracker</h1>
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
        resultCount={filteredParks.length}
        totalCount={parks.length}
      />

      <ParkBrowser
        parks={filteredParks}
        onToggleDetails={setHighlightedParkId}
        userPosition={userPosition}
      />
    </div>
  )
}
