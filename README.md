# Rob Gardening & Maintenance

Marketing website and admin panel for Rob Gardening & Maintenance, a Northern Beaches (Sydney) garden services business. React + Vite + shadcn-ui SPA deployed on Vercel with a small serverless API for schedule queries.

## Local development

Requires Node.js (use nvm: https://github.com/nvm-sh/nvm).

```sh
npm install
npm run dev          # dev server on :3000
npm test             # run the test suite once
npm run lint         # eslint
npm run build        # production build to dist/
```

The dev server proxies `/api/*` to `http://localhost:3001`. To run the full stack locally:

```sh
# Terminal 1: dev server
npm run dev

# Terminal 2: Vercel functions
npx vercel dev --listen 3001
```

## Tech stack

- Vite + React 18 + TypeScript
- shadcn-ui + Tailwind CSS
- React Router v6
- Vitest + Testing Library for tests
- Vercel serverless functions for the schedule API
- Vercel Blob for persisted schedule data

## Documentation

- Project conventions and deviations from global rules: [`CLAUDE.md`](./CLAUDE.md)
- User guide (customer-facing): [`docs/user-guide.html`](./docs/user-guide.html)
- Active rollout plan: [`docs/plans/2026-04-13-001-feat-seo-geo-rollout-beta-plan.md`](./docs/plans/2026-04-13-001-feat-seo-geo-rollout-beta-plan.md)
- Changelog: [`CHANGELOG.md`](./CHANGELOG.md)

## Deployment

Production auto-deploys from `main` on Vercel. Preview deployments are gated behind Vercel Deployment Protection; production is not.
