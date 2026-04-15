# Changelog

All notable changes to Rob Gardening & Maintenance. Bumped on every PR that ships to production.

## Conventions
- patch (0.0.x) — bug fixes, copy tweaks, dependency bumps
- minor (0.x.0) — new features, new pages, new tracked events
- major (x.0.0) — breaking changes

Each entry is split into:
- **What's new** — customer-facing outcomes
- **Under the hood** — technical detail (rendered dimmer in-app when a changelog page exists)

---

## [1.2.0] — 2026-04-15

### What's new
- Googlebot, ChatGPT, Claude, Perplexity and other search/answer engines now receive real, fully-rendered HTML on the first request instead of an empty application shell. The headline, service list, schema and all body content are present the moment a crawler asks for the page.
- Anyone viewing the page source — including potential customers doing "view source" to sanity-check the site — sees proper content instead of a blank white page template.

### Under the hood
- Added `@prerenderer/rollup-plugin` and `@prerenderer/renderer-puppeteer` as devDependencies.
- `vite.config.ts` registers the prerender plugin in `production` mode only. Routes prerendered: `/` and `/schedule`. `/admin` and its sub-routes are deliberately excluded (auth-gated, zero SEO value).
- Puppeteer is configured with `renderAfterTime: 2500` (ms) to give framer-motion animations time to settle before the snapshot is taken, and launched with `--no-sandbox --disable-setuid-sandbox` so it works in CI/Vercel environments without a sandbox.
- `dist/index.html` grows from ~5.6 kB (application shell) to ~127 kB (fully rendered) after this change. `dist/schedule/index.html` is created as a separate file by the plugin.
- Build time on `vite build` grows from ~2 s to ~14 s because of the Chromium startup overhead. Dev mode (`npm run dev`) is unaffected.
- **Known risk:** Vercel's build environment needs to be able to download and launch Puppeteer's bundled Chromium. If the build fails there, the fallback is a custom post-build Node script using `ReactDOMServer.renderToStaticMarkup` (deferred to implementation time).
- Puppeteer's Chromium sometimes adds benign framework-detection classes (`plt-tablet plt-desktop md`) to the `<html>` element in the rendered output. These are cosmetic and do not affect SEO or rendering.

---

## [1.1.0] — 2026-04-15

### What's new
- The homepage now leads with a proper headline: **"Garden Maintenance & Lawn Care"** in the biggest text on the page, followed by the full list of service areas (Greater Sydney, Northern Beaches, Eastern Suburbs, Greater Western Sydney, Central Coast). Search engines use this headline directly when deciding how to show Rob in results.
- "The Art of Green Care" is now a styled tagline underneath the main headline, instead of competing with it as the primary heading.

### Under the hood
- `src/components/Hero.tsx` — the hero `<h2>` becomes the real `<h1>`, containing the primary keyword ("Garden Maintenance & Lawn Care") as the biggest visual element and the service-area list as a secondary line within the same heading. Removed the now-duplicate service-area pill from above the heading. "The Art of Green Care" becomes a separate styled tagline below.
- `src/components/Header.tsx` — the brand `<h1>` demotes to a `<div>`. The parent anchor carries an `aria-label="Rob Gardening and Maintenance"` so screen readers still announce the brand. Logo `alt` is now empty (decorative) because the link is now labelled.
- Added `src/components/Hero.test.tsx` (5 tests) asserting exactly one `<h1>`, that it contains "Garden Maintenance & Lawn Care", "Northern Beaches", "Central Coast", and that the "The Art of Green Care" tagline still renders.
- Added `src/components/Header.test.tsx` (3 tests) asserting zero `<h1>`s in the header, that the brand is still accessible via `aria-label`, and that the visible brand text is still rendered for sighted users.
- Test suite grows from 65 to 73 tests, all green.

---

## [1.0.0] — 2026-04-15

First tagged release. The site now has a proper search and AI-answer-engine footprint, a cleaner page title, richer business schema, and a visible version marker in the footer so you can tell at a glance which build is live.

### What's new
- Page title now reads "Rob Gardening & Maintenance | Northern Beaches Garden Services Sydney" so searches for Northern Beaches gardeners find Rob directly.
- Rich business information (services, hours, service areas, contact) is now published in a structured format so Google, ChatGPT, Claude and Perplexity can quote it accurately when someone asks about garden services in Sydney.
- The website is now explicitly open to all major AI answer engines (ChatGPT, Claude, Perplexity, Google AI Overviews) with a dedicated business summary at `/llms.txt`.
- The hidden link on the letter "e" of "Maintenance" in the header is gone — the header reads cleanly.
- Instagram and Facebook links in the footer and schema are now clean canonical URLs with the tracking junk stripped.
- The footer now shows the app version and build identifier in small monospace text so it's always clear which build is running.

### Under the hood
- `index.html` — new title tag, expanded LocalBusiness JSON-LD with `@id`, `image`, `logo`, `geo`, `areaServed` array of `Place`, structured `openingHoursSpecification`, and `hasOfferCatalog` covering the seven core services (Lawn Care, Hedge Trimming, Pre-Sale Makeovers, Seasonal Care, Green Waste, Hard Surface Cleaning, Ride-On Mower Hire).
- `src/components/Header.tsx` — removed the `<Link to="/manage-schedule">` wrapping the final "e" of "Maintenance", plus the now-unused `react-router-dom` import.
- `src/components/Footer.tsx` — Instagram URL cleaned to `https://www.instagram.com/rob_gardens/`; Facebook URL stripped of `?mibextid=...`. Added the version label element with `data-testid="app-version"` and `font-mono text-xs text-primary-foreground/40` styling.
- `public/robots.txt` — explicitly allows Googlebot, Google-Extended, Bingbot, GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, CCBot, Twitterbot, facebookexternalhit; disallows `/manage-schedule` and `/admin` under the catch-all; references the sitemap.
- `public/sitemap.xml` — new, lists `/` (priority 1.0) and `/schedule` (priority 0.5) with 2026-04-15 lastmod.
- `public/llms.txt` — new, follows the llmstxt.org spec with a short business intro, service list, service area, contact block and a "Key Facts" section.
- Repo-wide: canonical domain corrected from `robgarden.com.au` (singular) to `robgardens.com.au` (plural) across `index.html`, `Footer.tsx`, `Contact.tsx`, `docs/user-guide.html`, and the active SEO rollout plan.
- `package.json` version `0.0.0` → `1.0.0`. `vite.config.ts` now injects `__APP_SEMVER__`, `__APP_VERSION__` (git SHA, with `VERCEL_GIT_COMMIT_SHA` preferred), `__BUILD_TIME__` via `define`. `src/lib/version.ts` exports `APP_SEMVER`, `APP_SHA`, `APP_SHA_SHORT`, `APP_BUILD_TIME`, `APP_VERSION_LABEL`. `src/vite-env.d.ts` declares the new globals. `vitest.config.ts` mirrors the same `define` so component tests read real values.
- Test coverage: `src/components/Footer.test.tsx` asserts the version line matches `/^v\d+\.\d+\.\d+ \([0-9a-f]{7}\)$/` and carries the `font-mono` class. Written test-first — initial run red, implementation then green.
- Still to ship: DNS cutover of `robgardens.com.au` to the Vercel project (Unit 1), disable Vercel Deployment Protection on production (Unit 2). Both are infrastructure tasks deferred to the public launch.
