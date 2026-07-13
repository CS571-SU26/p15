# p15

Final Project for UW CS571 — a client-side-only React app deployed to
GitHub Pages at https://cs571-su26.github.io/p15/.

Built with React, TypeScript, Vite, Tailwind CSS, and React Router
(declarative mode). See [CLAUDE.md](CLAUDE.md) for full architecture and
conventions.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to docs/
npm run lint      # ESLint
```

To deploy, run `npm run build`, then commit and push `docs/` — GitHub Pages
serves the live site from `main`'s `/docs` folder. See
[CLAUDE.md](CLAUDE.md) for details.
