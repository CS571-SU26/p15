// Manual overrides for parks whose DNR PROP_NAME doesn't resolve to a
// Wikipedia article automatically (checked via direct lookup + opensearch
// fallback against all 80 WSPS properties). Every title below was confirmed
// live with a 200 from the summary endpoint before being added here.
//
// Still unresolved (no override — renders without Wikipedia enrichment):
//   Sauk Prairie State Recreation Area
//
// Each entry is: DNR PROP_NAME': 'Wikipedia article title'
export const WIKIPEDIA_TITLE_OVERRIDES: Partial<Record<string, string>> = {
  'Baraboo Hills State Recreation Area': 'Devil\'s Lake State Park (Wisconsin)',
  'Capital Springs Centennial SP And RA': 'Capital Springs State Recreation Area',
  'Copper Culture Mounds State Park': 'Copper Culture State Park',
  'Fischer Creek Recreation Area': 'Fischer Creek State Recreation Area',
  'Governor Earl Peshtigo River State Forest': 'Peshtigo River State Forest',
  'Havenwoods Forest Preserve And Nature Center': 'Havenwoods State Forest',
  'Hoffman Hills Recreation Area': 'Hoffman Hills State Recreation Area',
  'Kettle Moraine State Forest-Lapham Peak Unit': 'Kettle Moraine State Forest',
  'Kettle Moraine State Forest-Loew Lake Unit': 'Kettle Moraine State Forest',
  'Kettle Moraine State Forest-Mukwonago River Unit': 'Kettle Moraine State Forest',
  'Kettle Moraine State Forest-Pike Lake Unit': 'Kettle Moraine State Forest',
  'Lower Wisconsin State Riverway': 'Wisconsin River',
  'Natural Bridge State Park': 'Natural Bridge State Park (Wisconsin)',
  'Northern Highland State Forest': 'Northern Highland-American Legion State Forest',
  'Pike Wild River': 'Pike River (Wisconsin)',
  'Pine-Popple Wild Rivers': 'Pine River (Florence County)',
  'Rock Island State Park': 'Rock Island State Park (Wisconsin)',
  'Sauk Prairie State Recreation Area':'', // no Wikipedia article available
  'Straight Lake Wilderness State Park': 'Straight Lake State Park',
  'Totogatic Wild River':'Namekagon River',
  'Turtle Flambeau Scenic Waters Area': 'Turtle-Flambeau Flowage',
  'Willow Flowage SWA - Dick Steffes Unit': 'Willow Flowage',
  'Willow Flowage Scenic Waters Area': 'Willow Flowage',
}
