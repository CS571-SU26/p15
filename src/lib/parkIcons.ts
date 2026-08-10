import L from 'leaflet'
import pinRraUnvisited from '../assets/park-icons/pin-rra-unvisited.svg'
import pinRraVisited from '../assets/park-icons/pin-rra-visited.svg'
import pinSfUnvisited from '../assets/park-icons/pin-sf-unvisited.svg'
import pinSfVisited from '../assets/park-icons/pin-sf-visited.svg'
import pinSpUnvisited from '../assets/park-icons/pin-sp-unvisited.svg'
import pinSpVisited from '../assets/park-icons/pin-sp-visited.svg'
import pinSraUnvisited from '../assets/park-icons/pin-sra-unvisited.svg'
import pinSraVisited from '../assets/park-icons/pin-sra-visited.svg'
import type { ParkType } from '../types/park'

const ICON_URLS: Record<ParkType, { unvisited: string; visited: string }> = {
  SP: { unvisited: pinSpUnvisited, visited: pinSpVisited },
  SF: { unvisited: pinSfUnvisited, visited: pinSfVisited },
  SRA: { unvisited: pinSraUnvisited, visited: pinSraVisited },
  RRA: { unvisited: pinRraUnvisited, visited: pinRraVisited },
}

const iconCache = new Map<string, L.Icon>()

export function getParkIcon(type: ParkType, visited: boolean): L.Icon {
  const key = `${type}-${visited}`
  const cached = iconCache.get(key)
  if (cached) return cached

  const icon = L.icon({
    iconUrl: ICON_URLS[type][visited ? 'visited' : 'unvisited'],
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  })
  iconCache.set(key, icon)
  return icon
}
