# React Hub — Project Instructions

## What this is

A **client-side-only** single-page application hosted on GitHub Pages at
`https://cs571-su26.github.io/p15/` (repo: `CS571-SU26/p15`). No server-side
code, no Next.js, no SSR — everything runs in the browser.

This repo has moved before (from a `p0` placeholder, then a personal
`joshkemp4/CS571Project` repo, to this `CS571-SU26/p15` repo). If it moves
again, update the base path everywhere it's referenced below (search for
`p15`), and update the git remote (`git remote set-url origin <new-url>`).

## Stack

- **React 19** + **TypeScript** — UI and app logic
- **Vite** — dev server and build tool
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — styling, utility classes only
- **React Router v7, declarative mode** (`<BrowserRouter>`, `<Routes>`, `<Route>`)
  — NOT the data router / loader-based mode (`createBrowserRouter`). Do not
  introduce loaders, actions, or `RouterProvider`; they imply a
  server-capable data layer this project doesn't have.

## Hard constraints

- **No server-side code.** No API routes, no Next.js, no SSR/SSG frameworks,
  no server components. If a feature seems to need a backend, it should call
  a public/third-party API directly from the browser or be simulated with
  local/mock data.
- **All app files live under this `Project/` folder.** This folder is
  standalone — treat it as the repo root when reasoning about paths.
- **Must deploy cleanly to GitHub Pages** at `/p15/`. See "GitHub
  Pages base path" below before changing routing or asset paths.

## Project structure

```
Project/
├── CLAUDE.md              # this file
├── ARCHITECTURE.md        # file-by-file map of src/ and how it connects — read this first for app logic
├── index.html             # entry HTML; has the GH Pages SPA redirect script
├── vite.config.ts         # sets base: '/p15/', outDir: 'docs', Tailwind + React plugins
├── docs/                  # BUILD OUTPUT — committed to main; this is what GitHub Pages serves
├── public/
│   ├── favicon.svg
│   ├── .nojekyll          # tells GitHub Pages to skip Jekyll processing
│   └── 404.html           # GH Pages SPA fallback redirect (see below)
└── src/
    ├── main.tsx            # mounts <BrowserRouter basename="/p15">
    ├── App.tsx             # <Routes> tree
    ├── index.css           # Tailwind import + dark-mode custom-variant (see Conventions)
    ├── assets/             # DNR logo, per-type/visited-state marker icon SVGs
    ├── components/         # Layout, ParkMap, ParkBrowser, ParkCard, ParkFilters
    ├── context/            # ParksContext (DNR data + visited set), PreferencesContext (theme/motion)
    ├── hooks/              # useParkFilters, useParkSummary, useGeolocation
    ├── lib/                # DNR/Wikipedia fetch + transform logic, marker icon generation
    ├── types/              # Park type
    └── pages/
        ├── Home.tsx
        ├── MyParks.tsx
        ├── Settings.tsx
        ├── About.tsx        # still the original Vite-scaffold placeholder — not yet written
        └── NotFound.tsx    # catch-all `*` route
```

This is now a real app (a Wisconsin State Park tracker — map, cards,
filters, visited-tracking; see [ARCHITECTURE.md](ARCHITECTURE.md) for how
the pieces connect), not the original scaffold. `About` is the one
remaining placeholder page. Keep new pages under `src/pages/` and register
them in `App.tsx`.

## GitHub Pages base path

The repo is `CS571-SU26/p15`, so the site is served from a subpath
(`/p15/`), not domain root. Three places must stay in sync with that
repo name:

1. `vite.config.ts` — `base: '/p15/'`
2. `src/main.tsx` — `<BrowserRouter basename="/p15">`
3. `public/404.html` — the `pathSegmentsToKeep` comment (value itself stays
   `1` as long as the base is a single path segment)

If the repo is ever renamed (or moved to a different account/org), update
all three, plus `CLAUDE.md`/`README.md`, plus the git remote.

### Why there's a `public/404.html`

GitHub Pages is a static file host with no server-side rewrites. A
client-side route like `/p15/about` only exists in the React
Router config — there's no real `about` file on the server. On first load
GitHub Pages serves `404.html` for a shot at `/p15/about`, but a
*refresh or a direct link* to that URL still hits GitHub Pages' file server
first, which returns `404.html`. `public/404.html` encodes the intended path
into a query string
and redirects to `index.html`; a small inline script in `index.html` decodes
it back into a real path before React Router mounts. (Standard technique:
https://github.com/rafgraph/spa-github-pages.) Don't remove either script
unless deep-link/refresh support is intentionally being dropped.

## Commands

```bash
npm install       # install deps
npm run dev       # local dev server (served at http://localhost:5173/p15/)
npm run build     # type-check (tsc -b) + production build to docs/
npm run preview   # preview the production build locally
npm run lint      # ESLint
```

## Deploying

Deployment is manual and user-triggered — no CI/CD workflow, no separate
`gh-pages` branch. Vite's `build.outDir` is set to `docs` (see
`vite.config.ts`), and GitHub Pages is configured to serve from the `main`
branch's `/docs` folder — this is one of only two options GitHub Pages
supports for "deploy from a branch" (the other being branch root), so the
output directory name is not arbitrary.

`docs/` **is committed to `main`**, unlike a typical Vite project where
build output is gitignored. To deploy:

```bash
npm run build          # regenerates docs/
git add docs
git commit -m "Build: <describe what changed>"
git push
```

Regenerate and commit `docs/` any time source files change and you want the
live site updated — it will not update itself. When deploying, confirm
`docs/index.html` references assets under `/p15/...`, not `/...`.

## Conventions

- Styling is Tailwind utility classes in JSX. Avoid adding new global CSS
  files or CSS-in-JS — `src/index.css` has grown past a single line, but
  only for two justified exceptions: the `@custom-variant dark` line
  (switches Tailwind's `dark:` variant to class-based so it can be toggled
  manually from Settings, instead of OS-preference-only) and Leaflet's own
  stylesheet (imported directly in `main.tsx`, since it's a library
  requirement, not project styling). Don't add anything beyond that without
  a similarly concrete reason.
- Use `NavLink`/`Link` from `react-router-dom` for internal navigation, never
  plain `<a href>` — plain anchors force a full page reload and can break on
  the `/p15/` base path.
- New routes: add a page component under `src/pages/`, then add a `<Route>`
  for it inside the `<Route path="/" element={<Layout />}>` block in
  `src/App.tsx` so it inherits the shared nav/footer.
- All `localStorage` keys are namespaced `wsps:<name>` (visited parks,
  theme, reduced-motion). Keep new persisted state under the same prefix.
- Dark mode: pair every `text-gray-*`/`bg-*`/`border-*` utility with a
  `dark:` variant when touching UI — the whole app is expected to look
  correct in both themes, not just light.
