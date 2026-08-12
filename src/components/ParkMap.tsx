import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import ParkCard from './ParkCard'
import { useParks } from '../hooks/useParks'
import { usePreferences } from '../hooks/usePreferences'
import { getParkIcon } from '../lib/parkIcons'
import type { Park } from '../types/park'

const WISCONSIN_CENTER: [number, number] = [44.6, -89.9]

const TILE_LAYERS = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

interface ParkMapProps {
  parks: Park[]
  highlightedParkId?: number | null
  userPosition?: [number, number] | null
}

function FlyToPosition({
  position,
  reducedMotion,
}: {
  position: [number, number] | null
  reducedMotion: boolean
}) {
  const map = useMap()

  useEffect(() => {
    if (!position) return
    const zoom = Math.max(map.getZoom(), 9)
    if (reducedMotion) {
      map.setView(position, zoom)
    } else {
      map.flyTo(position, zoom)
    }
  }, [position, reducedMotion, map])

  return null
}

export default function ParkMap({ parks, highlightedParkId, userPosition }: ParkMapProps) {
  const { isVisited } = useParks()
  const { theme, reducedMotion } = usePreferences()
  const [selectedParkId, setSelectedParkId] = useState<number | null>(null)
  const selectedPark = parks.find((park) => park.id === selectedParkId) ?? null
  const highlightedPark = parks.find((park) => park.id === highlightedParkId) ?? null
  const tileLayer = TILE_LAYERS[theme]

  return (
    <section className="relative h-160 w-full">
      <div className="h-full w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-700">
        <MapContainer
          center={WISCONSIN_CENTER}
          zoom={7}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer key={theme} attribution={tileLayer.attribution} url={tileLayer.url} />
          {parks.map((park) => (
            <Marker
              key={park.id}
              position={park.position}
              icon={getParkIcon(park.type, isVisited(park.id))}
              eventHandlers={{ click: () => setSelectedParkId(park.id) }}
            />
          ))}

          {highlightedPark && (
            <CircleMarker
              center={highlightedPark.position}
              radius={16}
              pathOptions={{ color: '#facc15', weight: 3, fillColor: '#facc15', fillOpacity: 0.25 }}
            />
          )}

          {userPosition && (
            <CircleMarker
              center={userPosition}
              radius={8}
              pathOptions={{ color: '#2563eb', weight: 2, fillColor: '#3b82f6', fillOpacity: 0.6 }}
            />
          )}

          <FlyToPosition position={highlightedPark?.position ?? null} reducedMotion={reducedMotion} />
          <FlyToPosition position={userPosition ?? null} reducedMotion={reducedMotion} />
        </MapContainer>
      </div>

      {selectedPark && (
        <div className="absolute inset-x-4 bottom-4 z-[1001] max-h-[80%] overflow-y-auto sm:inset-x-auto sm:w-96">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSelectedParkId(null)}
              aria-label="Close park details"
              className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              ✕
            </button>
            <ParkCard park={selectedPark} />
          </div>
        </div>
      )}
    </section>
  )
}
