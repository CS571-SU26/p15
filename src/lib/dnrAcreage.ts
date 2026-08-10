const ACREAGE_QUERY_URL =
  'https://dnrmaps.wi.gov/arcgis/rest/services/LF_DML/LF_AGOL_STAGING_WTM_Ext/MapServer/0/query' +
  '?where=1%3D1' +
  '&groupByFieldsForStatistics=PROP_NAME' +
  '&outStatistics=' +
  encodeURIComponent(
    JSON.stringify([
      { statisticType: 'sum', onStatisticField: 'PROP_ACRES', outStatisticFieldName: 'TOTAL_ACRES' },
    ]),
  ) +
  '&f=json'

interface AcreageFeature {
  attributes: {
    PROP_NAME: string
    TOTAL_ACRES: number
  }
}

let acreageByName: Promise<Map<string, number>> | null = null

export function fetchAcreageByName(): Promise<Map<string, number>> {
  if (!acreageByName) {
    acreageByName = fetch(ACREAGE_QUERY_URL)
      .then((response) => response.json())
      .then(({ features }: { features: AcreageFeature[] }) => {
        const map = new Map<string, number>()
        for (const feature of features) {
          map.set(feature.attributes.PROP_NAME, feature.attributes.TOTAL_ACRES)
        }
        return map
      })
  }
  return acreageByName
}
