# React Hub — Project Instructions

## What this is

A **client-side-only** single-page application hosted on GitHub Pages at
`https://joshkemp4.github.io/CS571Project/` (repo: `joshkemp4/CS571Project`).
No server-side code, no Next.js, no SSR — everything runs in the browser.

Note: this may later move to a course-org repo (e.g. `CS571-SU26/p0`). If
that happens, update the base path everywhere it's referenced below (search
for `CS571Project`).

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
- **Must deploy cleanly to GitHub Pages** at `/CS571Project/`. See "GitHub
  Pages base path" below before changing routing or asset paths.

## Project structure

```
Project/
├── CLAUDE.md              # this file
├── index.html             # entry HTML; has the GH Pages SPA redirect script
├── vite.config.ts         # sets base: '/CS571Project/' and Tailwind + React plugins
├── public/
│   ├── favicon.svg
│   └── 404.html           # GH Pages SPA fallback redirect (see below)
└── src/
    ├── main.tsx            # mounts <BrowserRouter basename="/CS571Project">
    ├── App.tsx             # <Routes> tree
    ├── index.css           # `@import "tailwindcss";` — no other global CSS
    ├── components/
    │   └── Layout.tsx      # shared nav/footer, renders <Outlet />
    └── pages/
        ├── Home.tsx
        ├── About.tsx
        └── NotFound.tsx    # catch-all `*` route
```

Dummy `Home`/`About`/`NotFound` pages exist to prove the stack is wired up
correctly. Replace their contents with real pages as the project grows; keep
new pages under `src/pages/` and register them in `App.tsx`.

## GitHub Pages base path

The repo is `joshkemp4/CS571Project`, so the site is served from a subpath
(`/CS571Project/`), not domain root. Two places must stay in sync with that
repo name:

1. `vite.config.ts` — `base: '/CS571Project/'`
2. `src/main.tsx` — `<BrowserRouter basename="/CS571Project">`

If the repo is ever renamed (or moved to a different account/org), update
both, and update the comment in `public/404.html`.

### Why there's a `public/404.html`

GitHub Pages is a static file host with no server-side rewrites. A
client-side route like `/CS571Project/about` only exists in the React
Router config — there's no real `about` file on the server. On first load
GitHub Pages serves `404.html` for a shot at `/CS571Project/about`, but a
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
npm run dev       # local dev server (served at http://localhost:5173/CS571Project/)
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # preview the production build locally
npm run lint      # ESLint
```

## Deploying

Build output goes to `dist/`. Deployment is manual (build locally, publish
`dist/` to GitHub Pages) — no CI/CD workflow is set up. When deploying,
confirm `dist/index.html` references assets under `/CS571Project/...`, not
`/...`.

## Conventions

- Styling is Tailwind utility classes in JSX. Avoid adding new global CSS
  files or CSS-in-JS — keep `src/index.css` to the single `@import
  "tailwindcss";` line unless there's a concrete need for custom CSS that
  utilities can't express.
- Use `NavLink`/`Link` from `react-router-dom` for internal navigation, never
  plain `<a href>` — plain anchors force a full page reload and can break on
  the `/CS571Project/` base path.
- New routes: add a page component under `src/pages/`, then add a `<Route>`
  for it inside the `<Route path="/" element={<Layout />}>` block in
  `src/App.tsx` so it inherits the shared nav/footer.
