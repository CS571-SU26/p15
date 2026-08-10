# Wisconsin State Park Tracker

A client-side-only React app for browsing, filtering, and tracking visits
to Wisconsin's ~80 state parks, forests, recreation areas, and river &
resource areas — on an interactive map and as a searchable, sortable card
list. Deployed to GitHub Pages at https://cs571-su26.github.io/p15/.

Park locations and property details come from the Wisconsin DNR's public
GIS API; descriptions and photos, where available, come from Wikipedia.
Everything (your visited-parks list, theme, and other preferences) is
stored locally in the browser — there's no backend.

Built with React, TypeScript, Vite, Tailwind CSS, React Router
(declarative mode), and Leaflet, as a final project for UW–Madison's
CS571. See [CLAUDE.md](CLAUDE.md) for conventions/deployment and
[ARCHITECTURE.md](ARCHITECTURE.md) for how the code is organized.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check (tsc -b) + production build to docs/
npm run lint      # ESLint
```

To deploy, run `npm run build`, then commit and push `docs/` — GitHub Pages
serves the live site from `main`'s `/docs` folder. See
[CLAUDE.md](CLAUDE.md) for details.
