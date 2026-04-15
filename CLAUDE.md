# Rob's Gardens — project notes for Claude agents

Short project-local notes. Global rules in `~/.claude/CLAUDE.md` still apply; this file only captures things that are specific to this repo or that deliberately differ from the global defaults.

## What this project is

React + Vite + shadcn/ui single-page site for Rob Gardening & Maintenance, a Northern Beaches (Sydney) garden services business. Deployed on Vercel from the `main` branch. The project includes a small serverless API for schedule queries (`/api/areas-by-day`) and a private admin page for schedule management.

The SEO + GEO + visibility rollout plan lives at `docs/plans/2026-04-13-001-feat-seo-geo-rollout-beta-plan.md` — that plan is the source of truth for in-flight work.

## Versioning

Complies with the global versioning discipline rule. Current version source: `package.json` `version` field. In-app display via the footer (`v{semver} ({sha7})`, monospace, low contrast) powered by `src/lib/version.ts` and the Vite `define` block in `vite.config.ts` + `vitest.config.ts`.

CHANGELOG entries follow the global "What's new" / "Under the hood" split. The CHANGELOG is `CHANGELOG.md` at the repo root.

## Branch protection — conscious deviation from the global rule

The global shipping-discipline rule says the default branch should have the full protection set: PR required, status checks required, up-to-date before merge, no force push, no deletion. On this repo, `main` only has the last two rules enabled.

**Why the deviation:**
- Single committer (Giles, plus AI agents working under Giles's direction).
- No CI workflow exists yet, so there is no status check to require.
- Tests, typecheck, lint, and build are all run locally before every push, and `verification-before-completion` discipline catches regressions before they reach main.
- The site is not yet in front of real customers. The PR-flow friction outweighs the benefit right now.

**What's enabled** (GitHub ruleset `Protect main: no force-push, no deletion`, ID 15102957):
- `non_fast_forward` — blocks `git push --force` to `main`.
- `deletion` — blocks deletion of `main`.

**What's deliberately not enabled:**
- PR-required flow.
- Required status checks.
- Require branch up to date before merge.

**Revisit and upgrade to the full rule when any of these become true:**
- Rob's site goes live with real customer traffic (a broken push then has real cost).
- A second contributor joins the repo.
- A CI workflow (`.github/workflows/ci.yml`) is added — at the same time, turn on required status checks for that workflow's check name.
- Claude Code agents start pushing from multiple machines or non-interactive contexts where local verification is less reliable.

Upgrading is a one-command operation via `gh api` — low cost, defer until one of the triggers fires.

## Testing

- Test runner: Vitest. Config in `vitest.config.ts`.
- Run with `npm test` (single run) or `npm run test:watch`.
- Test files live next to the code they cover (`*.test.ts` / `*.test.tsx`) plus `src/test/` for older integration-style tests.
- The `tdd-first` rule applies to all new logic-bearing code. Static assets (robots.txt, sitemap.xml, llms.txt, pure HTML meta) do not need tests.

## Deployment

Vercel, auto-deploy from `main`. Production domain: `www.robgardens.com.au` (DNS still pending as of the 1.0.0 release — see SEO plan Phase 1 Unit 1). Preview deployments are SSO-protected; production is not (see SEO plan Phase 1 Unit 2).

## Docs site

Project documentation page lives at `docs/` and is served via GitHub Pages at `https://gilesparnell.github.io/robs-gardens/`. Follows the "Deep Ocean Tech" design system per the global project documentation standard. The user guide at `docs/user-guide.html` is the customer-facing reference for Rob himself.
