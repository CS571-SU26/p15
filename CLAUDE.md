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
    ├── index.css           # `@import "tailwindcss";` — no other global CSS
    ├── components/
    │   └── Layout.tsx      # shared nav/footer, renders <Outlet />
    └── pages/
        ├── Home.tsx
        ├── About.tsx
        └── NotFound.tsx    # catch-all `*` route
```

Placeholder `Home`/`About`/`NotFound` pages exist to prove the stack is wired up
correctly. Replace their contents with real pages as the project grows; keep
new pages under `src/pages/` and register them in `App.tsx`.

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
  files or CSS-in-JS — keep `src/index.css` to the single `@import
  "tailwindcss";` line unless there's a concrete need for custom CSS that
  utilities can't express.
- Use `NavLink`/`Link` from `react-router-dom` for internal navigation, never
  plain `<a href>` — plain anchors force a full page reload and can break on
  the `/p15/` base path.
- New routes: add a page component under `src/pages/`, then add a `<Route>`
  for it inside the `<Route path="/" element={<Layout />}>` block in
  `src/App.tsx` so it inherits the shared nav/footer.
