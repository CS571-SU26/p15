import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import ParkCard from './ParkCard'
import { useParks } from '../context/ParksContext'
import { getParkIcon } from '../lib/parkIcons'
import type { Park } from '../types/park'

const WISCONSIN_CENTER: [number, number] = [44.6, -89.9]

interface ParkMapProps {
  parks: Park[]
}

export default function ParkMap({ parks }: ParkMapProps) {
  const { isVisited } = useParks()

  return (
    <section className="h-125 w-full overflow-hidden rounded-md border border-gray-300">
      <MapContainer
        center={WISCONSIN_CENTER}
        zoom={7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {parks.map((park) => (
          <Marker
            key={park.id}
            position={park.position}
            icon={getParkIcon(park.type, isVisited(park.id))}
          >
            <Popup>
              <ParkCard park={park} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  )
}
