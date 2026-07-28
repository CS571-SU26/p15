import centerOfMass from '@turf/center-of-mass'
import type { Feature, Geometry } from 'geojson'
import type { Park, ParkType } from '../types/park'

const PARKS_QUERY_URL =
  'https://dnrmaps.wi.gov/arcgis2/rest/services/PR_Recreation/PR_WSPS_Property_Info_WTM_Ext/MapServer/0/query' +
  '?where=1%3D1' +
  '&outFields=OBJECTID,PROP_NAME,PROP_TYPE,INFO_URL' +
  '&geometryPrecision=5' +
  '&maxAllowableOffset=0.0003' +
  '&f=geojson'

interface ParkProperties {
  OBJECTID: number
  PROP_NAME: string
  PROP_TYPE: ParkType
  INFO_URL: string
}

export async function fetchParks(): Promise<Park[]> {
  const response = await fetch(PARKS_QUERY_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch parks: ${response.status} ${response.statusText}`)
  }

  const { features } = (await response.json()) as {
    features: Feature<Geometry, ParkProperties>[]
  }

  return features.map((feature) => {
    // needed to be able to get a single coordinate for the park, since the geometry from the API is a polygon
    const [lng, lat] = centerOfMass(feature).geometry.coordinates
    return {
      id: feature.properties.OBJECTID,
      name: feature.properties.PROP_NAME,
      type: feature.properties.PROP_TYPE,
      infoUrl: feature.properties.INFO_URL,
      position: [lat, lng],
    }
  })
}
