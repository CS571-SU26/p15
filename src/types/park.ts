export type ParkType = 'SP' | 'SF' | 'SRA' | 'RRA'

export interface Park {
  id: number
  name: string
  type: ParkType
  infoUrl: string
  /** [latitude, longitude] centroid of the property boundary */
  position: [number, number]
  acres: number | null
}

export const PARK_TYPE_LABELS: Record<ParkType, string> = {
  SP: 'State Park',
  SF: 'State Forest',
  SRA: 'State Recreation Area',
  RRA: 'River & Resource Area',
}
