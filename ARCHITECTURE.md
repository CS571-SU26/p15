# File overview

A file-by-file map of `src/`, and how the pieces connect. For deployment,
GitHub Pages setup, and repo conventions, see [CLAUDE.md](CLAUDE.md).

## Data flow, top to bottom

```
DNR ArcGIS API (geojson)                DNR ArcGIS API (acreage, grouped-sum)
  \                                      /
   \                                    /
    → src/lib/parks.ts  fetch both in parallel, merge → Park[]
      → src/context/ParksContext.tsx  fetch-once, holds Park[] + visited set (localStorage)
        → src/hooks/useParkFilters.ts  type/text filter + sort, used per-page
          → src/pages/Home.tsx           all parks, filtered/sorted
            src/pages/MyParks.tsx        only visited parks, filtered/sorted
            → src/components/ParkMap.tsx     map view of the filtered list
              src/components/ParkBrowser.tsx card-grid view of the filtered list
                → src/components/ParkCard.tsx  one park; lazily fetches its own
                                                 Wikipedia summary on mount
                                                 (src/lib/wikipedia.ts)
```

`Home` and `MyParks` both fetch through the same `ParksProvider` (mounted
once in `main.tsx`), so there's a single network request and a single
source of truth for which parks are marked visited — marking a park visited
on `Home` is immediately reflected on `MyParks`, no prop drilling of raw
fetch/storage logic required.

Two more inputs feed in from the pages, independent of the DNR fetch:
- **Wikipedia enrichment** is lazy and per-card (`useParkSummary`, called
  inside each `ParkCard`), not part of the initial `Park[]` load — fetching
  descriptions/photos for all ~80 parks up front would be wasteful for ones
  that are filtered out or never scrolled to.
- **The user's location** (`useGeolocation`, called once per page) flows
  into `useParkFilters` (for "Nearest" sorting), `ParkMap` (to show a "you
  are here" marker and fly there), and `ParkCard` (to show "X.X mi away").

## Entry point

- **`src/main.tsx`** — mounts the app. Wraps everything in `<BrowserRouter
  basename="/p15">`, `<PreferencesProvider>` (theme + reduced-motion, see
  below), then `<ParksProvider>`. Also does one-time Leaflet setup: imports
  `leaflet/dist/leaflet.css`, and patches `L.Icon.Default` so its marker
  image URLs resolve correctly under Vite's bundling (see the comment in
  the file for why — `Icon.Default._getIconUrl` prepends an auto-detected
  path in front of `options.iconUrl` unless that method is deleted first).
- **`src/App.tsx`** — the route table (`react-router-dom`, declarative
  mode). `/` → `Home`, `/my-parks` → `MyParks`, `/about` → `About`,
  `/settings` → `Settings`, `*` → `NotFound`, all nested under `<Layout>`
  so they share the nav/footer.
- **`src/index.css`** — `@import "tailwindcss";` plus one addition:
  `@custom-variant dark (&:where(.dark, .dark *));`, which switches
  Tailwind's `dark:` variant from OS-preference-only to class-based, so the
  Settings page can toggle it manually. This is the one justified exception
  to "no other global CSS" — it's enabling a Tailwind feature, not adding
  project styling.

## Data layer

- **`src/types/park.ts`** — the `Park` shape used everywhere downstream:
  `id`, `name`, `type` (`'SP' | 'SF' | 'SRA' | 'RRA'`), `infoUrl`,
  `position` (`[lat, lng]` centroid), `acres` (`number | null`). Also
  exports `PARK_TYPE_LABELS`, the map from those 4 codes to human-readable
  names ("State Park", "State Forest", "State Recreation Area", "River &
  Resource Area") — used by both the filter pills and the park cards.

- **`src/lib/parks.ts`** — `fetchParks()`. Queries the WI DNR ArcGIS
  `PR_WSPS_Property_Info_WTM_Ext` layer for all ~80 park properties as
  GeoJSON (in parallel with `fetchAcreageByName()`, below, via
  `Promise.all`), then converts each polygon feature into a `Park`: pulls
  `PROP_NAME`/`PROP_TYPE`/`INFO_URL` straight from the feature properties,
  computes `position` from the polygon geometry via `@turf/center-of-mass`
  (the API has no point/centroid field — geometry is the park's boundary
  polygon, not a marker location), and looks up `acres` by exact name
  match. The query URL requests reduced precision (`geometryPrecision=5`,
  `maxAllowableOffset=0.0003`) since only a centroid is needed, not full
  boundary detail — cuts the payload from ~5.6 MB to ~500 KB.

- **`src/lib/dnrAcreage.ts`** — `fetchAcreageByName()`. A *different* DNR
  ArcGIS layer (`LF_DML/LF_AGOL_STAGING_WTM_Ext`, covering all DNR-managed
  land, not just the 80 WSPS properties) that has acreage but no
  descriptions. Properties can span multiple parcels, so this runs one
  grouped-sum query (`groupByFieldsForStatistics=PROP_NAME`) rather than
  reading acreage off a single row. Result is memoized (fetched once per
  session, not once per park).

- **`src/lib/wikipedia.ts`** — `fetchParkSummary(parkName)`. Looks up a
  park by name against Wikipedia's REST summary API; if the DNR name
  doesn't resolve directly, checks `parkOverrides.ts` for a known-good
  title, then falls back to a MediaWiki opensearch query. All requests go
  through a shared ~300ms throttle (Wikipedia starts returning 429s under a
  burst — confirmed while building the override list — and this app can
  mount up to 80 `ParkCard`s at once). Results are cached per park name so
  navigating between pages, or a card mounting twice, doesn't re-fetch.

- **`src/lib/parkOverrides.ts`** — `WIKIPEDIA_TITLE_OVERRIDES`, a static
  map from DNR `PROP_NAME` to the real Wikipedia article title, for the
  parks whose DNR name doesn't resolve automatically (disambiguation
  suffixes, official-vs-common naming, or several DNR sub-units sharing one
  parent article). A few parks have no entry here at all — no override was
  findable, so they simply render without Wikipedia enrichment.

- **`src/lib/geo.ts`** — `haversineDistanceMiles(a, b)`, plain
  straight-line distance between two `[lat, lng]` points. Backs both the
  "Nearest" sort and the "X.X mi away" line on cards.

- **`src/lib/parkIcons.ts`** — `getParkIcon(type, visited)`, a cached
  `L.Icon` per type/visited combination. Backs onto 8 SVGs in
  `src/assets/park-icons/` (`pin-{sp,sf,sra,rra}-{unvisited,visited}.svg`):
  a pin shape colored light grey (unvisited) or green (visited), with a
  white badge circle containing a glyph sourced from Mapbox's open-source
  Maki/Temaki map-icon sets (tents for State Park, a conifer for State
  Forest, a picnic table for Recreation Area, a water drop for River &
  Resource Area) — composited by hand into static SVG files, not a runtime
  dependency on those icon packages.

## State

- **`src/context/ParksContext.tsx`** — `ParksProvider` (component only —
  the context object and `useParks()` hook live in `src/hooks/useParks.ts`
  instead, since an ESLint Fast Refresh rule disallows a component file
  exporting anything else). Owns the only `fetchParks()` call (on mount)
  and exposes `{ parks, loading, error }`. Also owns the "visited" set — a
  `Set<number>` of park ids, seeded from `localStorage`
  (`wsps:visitedParks`) and persisted back to it on every change — plus
  `isVisited(id)`, `toggleVisited(id)`, and `clearVisited()` (bulk-reset,
  used by the Settings page). Any component can call `useParks()` to read
  parks/visited state; there's no other place in the app that touches
  `localStorage` or issues the parks fetch.

- **`src/context/PreferencesContext.tsx`** — `PreferencesProvider` (same
  split: the context + `usePreferences()` hook live in
  `src/hooks/usePreferences.ts`). Two small, independent,
  `localStorage`-persisted settings: `theme` (`'light' | 'dark'`,
  `wsps:theme`, toggles a `dark` class on `<html>`, defaults to the OS's
  `prefers-color-scheme`) and `reducedMotion` (`wsps:reducedMotion`,
  defaults to the OS's `prefers-reduced-motion`). Both are set from the
  Settings page.

- **`src/hooks/useParkFilters.ts`** — `useParkFilters(parks, { isVisited,
  userPosition })`. Local (per-page, not global) list-view-controls state:
  which property types are checked, a free-text search string, and
  `sortBy` (`'name' | 'acres' | 'visited' | 'distance'`). Returns the
  filtered *and* sorted list plus the setters. Used identically by `Home`
  (over all parks) and `MyParks` (over the visited-only subset).

- **`src/hooks/useGeolocation.ts`** — `useGeolocation()` → `{ position,
  error, loading, request }`, a thin wrapper around
  `navigator.geolocation.getCurrentPosition`. Called once per page
  (`Home`/`MyParks`) rather than lifted to a context — re-requesting on the
  other page is cheap since the browser remembers the permission grant.
  Passes a `timeout` and maps error codes to friendly messages, since some
  browsers (notably Safari on macOS with Location Services off at the OS
  level) never call either callback promptly on denial otherwise, which
  would leave a "Locating…" button stuck forever.

- **`src/hooks/useParkSummary.ts`** — thin hook wrapping
  `wikipedia.ts`'s `fetchParkSummary`: `useParkSummary(parkName)` → `{
  summary, loading }`, fetches on mount via `useEffect`.

## Components

- **`src/components/Layout.tsx`** — shared chrome: header with the DNR
  logo and nav links (Home / My Parks / About / Settings), `<Outlet />` for
  the routed page, footer. Not park-data-aware.

- **`src/components/ParkCard.tsx`** — one park's card. Always shows: name,
  type badge, an "acres · X.X mi away" facts line (either half omitted if
  that data isn't available), and a footer with "Show more details" /
  "Mark visited". Collapsed, it shows a clamped 3-line Wikipedia extract +
  thumbnail if `useParkSummary` resolved one, or a muted type-emoji
  placeholder + "No description available." if not. Expanded ("Show more
  details"), it un-clamps the extract, reveals the short Wikipedia
  description tagline, and reveals a link row with "via Wikipedia" (if
  applicable) and the DNR page link — the DNR link only lives in this
  expanded section, not the collapsed card, and is available regardless of
  whether the Wikipedia fetch has resolved yet. Toggling details also calls
  an optional `onToggleDetails(parkId | null)` prop, which pages use to
  highlight the corresponding marker on the map (see `ParkMap` below).
  Used both in the card grid (`ParkBrowser`) and inside `ParkMap`'s
  click-to-open overlay panel, so both views behave identically.

- **`src/components/ParkFilters.tsx`** — the type-pill + search-box row,
  plus a second row: a "📍 Near me" button (calls a passed-in
  `onRequestLocation`, shows `locationLoading`/`locationError` inline) and
  a sort `<select>` (`name`/`acres`/`visited`/`distance` — "Nearest" only
  listed once `hasUserPosition` is true). Purely controlled: takes all
  state and setters as props, holds none itself.

- **`src/components/ParkMap.tsx`** — the Leaflet map (`react-leaflet`), at
  a fixed height (`h-125`, 500px) and full width, sitting above the
  filters/cards. Renders a `TileLayer` that switches between CARTO
  Positron (light) and CARTO Dark Matter (dark) based on
  `usePreferences().theme`, and one `Marker` per park with its icon from
  `getParkIcon`. Clicking a marker sets `selectedParkId` (local state) and
  opens `ParkCard` as an absolutely-positioned overlay panel docked to the
  map (not a native Leaflet `Popup` — Leaflet's own `.leaflet-container`
  clips popups to the map's bounds via `overflow: hidden`, which broke once
  cards grew tall from the "Show more details" feature; the overlay is a
  plain sibling `<div>` outside Leaflet's DOM with a `z-index` above
  Leaflet's internal panes, so it's never clipped). Also accepts two
  props from the page: `highlightedParkId` (set when a card's "Show more
  details" is toggled — draws a yellow `CircleMarker` ring and flies the
  map there) and `userPosition` (draws a distinct blue "you are here"
  `CircleMarker` and flies there). Both use a shared internal
  `FlyToPosition` helper (`useMap()` + `useEffect`) that respects
  `reducedMotion` by calling `setView` instead of `flyTo` when set.

- **`src/components/ParkBrowser.tsx`** — the responsive card grid, in its
  own `max-h-[45vh] overflow-y-auto` section so a long list of cards
  scrolls independently instead of scrolling the map out of view. Reads
  `loading`/`error` from `useParks()` directly (for the loading/error/empty
  states); renders whatever `parks` list it's passed, and passes
  `onToggleDetails`/`userPosition` straight through to each `ParkCard`.

## Pages

- **`src/pages/Home.tsx`** — `/`. Pulls all `parks` from `useParks()`,
  calls `useGeolocation()`, runs both through `useParkFilters`, and stacks
  `ParkMap` → `ParkFilters` → `ParkBrowser` top to bottom over the
  filtered/sorted list, wiring the highlight/location props described
  above.
- **`src/pages/MyParks.tsx`** — `/my-parks`. Same shape and wiring as
  `Home`, but first narrows `parks` to only those where `isVisited(id)` is
  true before handing them to `useParkFilters`. Also shows a
  visited-progress stat in its header — "`{visited} of {total} parks
  visited ({%})`" plus a bar — computed from the *unfiltered* `parks`, so
  it always reflects true overall progress regardless of the current
  search/filter.
- **`src/pages/Settings.tsx`** — `/settings`. Three independent controls:
  dark mode and reduce-motion toggles (`usePreferences()`), and a "Clear
  all visited parks" button (`useParks().clearVisited()`, guarded by a
  native `confirm()` since it's destructive).
- **`src/pages/About.tsx`** — `/about`. Still the original Vite-scaffold
  placeholder text — not yet written.
- **`src/pages/NotFound.tsx`** — catch-all `*` route, simple 404 + link
  home.

## Assets

- **`src/assets/wi-dnr.png`** — DNR logo, used in `Layout.tsx`'s header.
- **`src/assets/park-icons/*.svg`** — the 8 marker icons described above.
- **`src/assets/vite.svg`** — unused Vite starter leftover.
