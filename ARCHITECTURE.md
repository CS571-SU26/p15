# File overview

A file-by-file map of `src/`, and how the pieces connect. For deployment,
GitHub Pages setup, and repo conventions, see [CLAUDE.md](CLAUDE.md).

## Data flow, top to bottom

```
DNR ArcGIS API (geojson)
  → src/lib/parks.ts             fetch + transform → Park[]
  → src/context/ParksContext.tsx fetch-once, holds Park[] + visited set (localStorage)
  → src/hooks/useParkFilters.ts  type + text-search filtering, used per-page
  → src/pages/Home.tsx           all parks, filtered
    src/pages/MyParks.tsx        only visited parks, filtered
  → src/components/ParkMap.tsx     map view of the filtered list
    src/components/ParkBrowser.tsx card-grid view of the filtered list
```

`Home` and `MyParks` both fetch through the same `ParksProvider` (mounted
once in `main.tsx`), so there's a single network request and a single
source of truth for which parks are marked visited — marking a park visited
on `Home` is immediately reflected on `MyParks`, no prop drilling of raw
fetch/storage logic required.

## Entry point

- **`src/main.tsx`** — mounts the app. Wraps everything in `<BrowserRouter
  basename="/p15">` (GitHub Pages subpath routing) and `<ParksProvider>`
  (see below). Also does one-time Leaflet setup: imports `leaflet/dist/
  leaflet.css`, and patches `L.Icon.Default` so its marker image URLs
  resolve correctly under Vite's bundling (see the comment in the file for
  why — `Icon.Default._getIconUrl` prepends an auto-detected path in front
  of `options.iconUrl` unless that method is deleted first).
- **`src/App.tsx`** — the route table (`react-router-dom`, declarative
  mode). `/` → `Home`, `/my-parks` → `MyParks`, `/about` → `About`, `*` →
  `NotFound`, all nested under `<Layout>` so they share the nav/footer.
- **`src/index.css`** — just `@import "tailwindcss";`. No other global CSS
  lives here by convention (Leaflet's CSS is imported directly in
  `main.tsx` instead, since it's a library requirement, not a project
  style).

## Data layer

- **`src/types/park.ts`** — the `Park` shape used everywhere downstream:
  `id`, `name`, `type` (`'SP' | 'SF' | 'SRA' | 'RRA'`), `infoUrl`,
  `position` (`[lat, lng]` centroid). Also exports `PARK_TYPE_LABELS`, the
  map from those 4 codes to human-readable names ("State Park", "State
  Forest", "State Recreation Area", "River & Resource Area") — used by both
  the filter pills and the park cards.

- **`src/lib/parks.ts`** — `fetchParks()`. Queries the WI DNR ArcGIS
  `PR_WSPS_Property_Info_WTM_Ext` layer for all ~80 park properties as
  GeoJSON, then converts each polygon feature into a `Park`: pulls
  `PROP_NAME`/`PROP_TYPE`/`INFO_URL` straight from the feature properties,
  and computes `position` from the polygon geometry via
  `@turf/center-of-mass` (the API has no point/centroid field — geometry is
  the park's boundary polygon, not a marker location). The query URL
  requests reduced precision (`geometryPrecision=5`,
  `maxAllowableOffset=0.0003`) since only a centroid is needed, not full
  boundary detail — cuts the payload from ~5.6 MB to ~500 KB.

- **`src/lib/parkIcons.ts`** — `getParkIcon(type, visited)`, returns a
  cached `L.Icon` for a given park type + visited state. Backs onto 8
  placeholder PNGs in `src/assets/park-icons/` (`pin-{sp,sf,sra,rra}-
  {unvisited,visited}.png` — currently flat indigo/green swatches, meant to
  be swapped for real artwork under the same filenames). Icons are built
  once and cached in a `Map` rather than recreated per marker per render.

## State

- **`src/context/ParksContext.tsx`** — `ParksProvider` + `useParks()`.
  Owns the only `fetchParks()` call (on mount) and exposes `{ parks,
  loading, error }`. Also owns the "visited" set — a `Set<number>` of park
  ids, seeded from `localStorage` (`wsps:visitedParks`) and persisted back
  to it on every change — plus `isVisited(id)` / `toggleVisited(id)`. Any
  component can call `useParks()` to read parks/visited state or toggle a
  park's visited status; there's no other place in the app that touches
  `localStorage` or issues the parks fetch.

- **`src/hooks/useParkFilters.ts`** — `useParkFilters(parks)`. Local (per-
  page, not global) filter state: which property types are checked, and a
  free-text search string. Returns the filtered list plus the setters. Used
  identically by `Home` (over all parks) and `MyParks` (over the
  visited-only subset), which is why it's a hook rather than being written
  twice.

## Components

- **`src/components/Layout.tsx`** — shared chrome: header with the DNR
  logo and nav links (Home / My Parks / About), `<Outlet />` for the routed
  page, footer. Not park-data-aware.

- **`src/components/ParkCard.tsx`** — one park, rendered as a card: name,
  type badge, link out to `infoUrl`, and the "Mark visited" / "Remove from
  My Parks" toggle button (via `useParks().toggleVisited`). Used both in
  the card grid (`ParkBrowser`) and inside each map marker's popup
  (`ParkMap`), so the two views behave identically and share one
  implementation of the visited-toggle button.

- **`src/components/ParkFilters.tsx`** — the type-pill + search-box row.
  Purely controlled: takes `selectedTypes`/`searchText` and their setters
  as props, holds no state itself. Rendered once per page (`Home`,
  `MyParks`), each with its own `useParkFilters` state.

- **`src/components/ParkMap.tsx`** — the Leaflet map (`react-leaflet`), at
  a fixed height (`h-125`, 500px) and full width — it sits above the
  filters/cards rather than beside them (see Pages below). Renders a
  `TileLayer` (currently CARTO Positron — light, minimal-label basemap;
  swap the `url`/`attribution` here to try another provider) and one
  `Marker` per park in the `parks` prop it's given, icon chosen via
  `getParkIcon`, popup contents delegated to `ParkCard`.

- **`src/components/ParkBrowser.tsx`** — the responsive card grid, in its
  own `max-h-[45vh] overflow-y-auto` section so a long list of cards
  scrolls independently instead of scrolling the map out of view. Reads
  `loading`/`error` from `useParks()` directly (for the loading/error/empty
  states) but renders whatever `parks` list it's passed as a prop — same
  signature as `ParkMap`, so a page can feed both views the same filtered
  array and they stay in sync.

## Pages

- **`src/pages/Home.tsx`** — `/`. Pulls all `parks` from `useParks()`, runs
  them through `useParkFilters`, and stacks `ParkMap` → `ParkFilters` →
  `ParkBrowser` top to bottom over the filtered list (map fixed-height on
  top so it stays visible while the card list below it scrolls).
- **`src/pages/MyParks.tsx`** — `/my-parks`. Same shape and layout as
  `Home`, but first narrows `parks` to only those where `isVisited(id)` is
  true before handing them to `useParkFilters` — so it's "the same filters
  and layout, applied to a smaller starting set," not a separate data path.
- **`src/pages/About.tsx`** — `/about`. Static placeholder text, not yet
  built out.
- **`src/pages/NotFound.tsx`** — catch-all `*` route, simple 404 + link
  home.

## Assets

- **`src/assets/wi-dnr.png`** — DNR logo, used in `Layout.tsx`'s header.
- **`src/assets/park-icons/*.png`** — the 8 placeholder marker icons
  described above.
- **`src/assets/vite.svg`** — unused Vite starter leftover.
