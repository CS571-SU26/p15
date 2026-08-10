import { useMemo, useState } from 'react'
import { haversineDistanceMiles } from '../lib/geo'
import { PARK_TYPE_LABELS, type Park, type ParkType } from '../types/park'

const ALL_TYPES = new Set(Object.keys(PARK_TYPE_LABELS) as ParkType[])

export type SortBy = 'name' | 'acres' | 'visited' | 'distance'

interface UseParkFiltersOptions {
  isVisited: (id: number) => boolean
  userPosition: [number, number] | null
}

export function useParkFilters(parks: Park[], { isVisited, userPosition }: UseParkFiltersOptions) {
  const [selectedTypes, setSelectedTypes] = useState<Set<ParkType>>(ALL_TYPES)
  const [searchText, setSearchText] = useState('')
  const [sortBy, setSortBy] = useState<SortBy>('name')

  const filteredParks = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    const filtered = parks.filter(
      (park) => selectedTypes.has(park.type) && park.name.toLowerCase().includes(query),
    )

    const sorted = [...filtered]
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'acres':
        sorted.sort((a, b) => (b.acres ?? -Infinity) - (a.acres ?? -Infinity))
        break
      case 'visited':
        sorted.sort((a, b) => {
          const diff = Number(isVisited(b.id)) - Number(isVisited(a.id))
          return diff !== 0 ? diff : a.name.localeCompare(b.name)
        })
        break
      case 'distance':
        if (userPosition) {
          sorted.sort(
            (a, b) =>
              haversineDistanceMiles(userPosition, a.position) -
              haversineDistanceMiles(userPosition, b.position),
          )
        }
        break
    }
    return sorted
  }, [parks, selectedTypes, searchText, sortBy, isVisited, userPosition])

  return {
    selectedTypes,
    setSelectedTypes,
    searchText,
    setSearchText,
    sortBy,
    setSortBy,
    filteredParks,
  }
}
