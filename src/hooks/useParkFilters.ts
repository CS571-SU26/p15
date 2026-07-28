import { useMemo, useState } from 'react'
import { PARK_TYPE_LABELS, type Park, type ParkType } from '../types/park'

const ALL_TYPES = new Set(Object.keys(PARK_TYPE_LABELS) as ParkType[])

export function useParkFilters(parks: Park[]) {
  const [selectedTypes, setSelectedTypes] = useState<Set<ParkType>>(ALL_TYPES)
  const [searchText, setSearchText] = useState('')

  const filteredParks = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return parks.filter(
      (park) => selectedTypes.has(park.type) && park.name.toLowerCase().includes(query),
    )
  }, [parks, selectedTypes, searchText])

  return { selectedTypes, setSelectedTypes, searchText, setSearchText, filteredParks }
}
