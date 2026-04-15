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

## [1.4.0] — 2026-04-16

### What's new
- Four new suburb landing pages: **Mosman**, **Rose Bay**, **Clontarf** and **Terrey Hills**. Each one is written specifically for that suburb — local landmarks, what's different about gardens in that area, the kind of work Rob actually does there. Not templated copy with the suburb name swapped in.
- Anyone searching "garden maintenance Mosman", "Rose Bay gardener", "Clontarf hedge trimming" or "Terrey Hills ride-on mowing" now lands on a page that's actually about their suburb, instead of the generic homepage.
- Each suburb page carries its own per-suburb structured data (address, geo coordinates, area served) so Google, ChatGPT, Claude and Perplexity can quote accurate local info when answering "who does gardening in <suburb>".
- Sitemap and llms.txt now list all four suburb pages so crawlers and AI answer engines can discover them in one hop.

### Under the hood
- New content authoring model: each suburb is an `.md` file under `src/content/suburbs/` with YAML frontmatter (name, slug, postcode, centroid lat/lng, region, neighbours, meta title/description, primary service) plus a markdown body. Edit in any text editor, no TypeScript touching.
- New data loader: `src/content/suburbs/index.ts` uses Vite's `import.meta.glob` with `?raw` to pull every `.md` file at build time, parses frontmatter with a **lightweight homegrown parser** (no `gray-matter` — grey-matter uses `eval` internally which crashes in browser bundles), exposes `getAllSuburbs`, `getSuburbBySlug`, `getSuburbSlugs`. Fully unit-tested in `suburbs.test.ts` (14 tests covering loader + content invariants: word count, keyword density, unique slugs, valid lat/lng).
- New page component: `src/pages/SuburbPage.tsx` — reads the slug from `useParams`, looks up the entry, renders the body via `react-markdown` + `remark-gfm`, injects a per-suburb `LocalBusiness` JSON-LD schema block, sets document.title, meta description, og tags and canonical via `useEffect`. Links to neighbouring suburbs that also have pages.
- `src/App.tsx` — added `<Route path="/gardening/:slug" element={<SuburbPage />} />`.
- `vite.config.ts` — `PRERENDER_ROUTES` is now derived from `readdirSync("./src/content/suburbs")`, so adding a new `.md` file auto-adds its prerender route. No config edit needed per new suburb.
- `public/sitemap.xml` and `public/llms.txt` updated to list the four suburb URLs.
- New runtime dependencies: `react-markdown` (^10), `remark-gfm` (^4). `gray-matter` was installed and then removed once the eval-in-bundle issue surfaced.
- Build time on `vite build` grows to ~9 s (from ~7 s) because puppeteer has to prerender 6 routes instead of 2. `dist/gardening/<slug>/index.html` files are each ~39 kB prerendered.
- **Rollout note**: four flagship suburbs chosen deliberately (Mosman + Rose Bay + Clontarf + Terrey Hills) to cover Lower North Shore, Eastern Suburbs, and two distinct Northern Beaches characters (harbourside vs acreage). The framework supports any number of suburbs — adding the remaining 10 from the plan is a content-only exercise: write the `.md` file, commit, done.

---

## [1.3.0] — 2026-04-15

### What's new
- The old `/manage-schedule` admin route is gone. In its place is a proper `/admin` area with a dashboard and navigation to two sub-sections: **Manage Schedule** (the existing rotating-crew schedule editor) and **Manage Users** (view the current admin allowlist). The dashboard is the landing page — users don't need to remember sub-URLs.
- The admin area now requires signing in with a Google account. Only emails on an allowlist can get through, everyone else sees a friendly 403. Random visitors can no longer reach the schedule editor by guessing the URL.
- Signing out is one click in the top-right of the admin dashboard.

### Under the hood
- Added `@react-oauth/google` and `jose` as runtime dependencies.
- New core auth module: `src/lib/auth.ts` — pure functions for Google ID token verification (against Google's JWKS, with an injectable source for tests), allowlist parsing, HMAC session signing/verification, and cookie building. Fully unit-tested in `src/lib/auth.test.ts` (16 tests, runs under `// @vitest-environment node` because jose's Uint8Array instance checks don't cross the jsdom realm boundary).
- New Vercel serverless handlers in `api/auth/`:
  - `verify.ts` — POST `{idToken}` → verifies the Google ID token, checks the email against `ADMIN_EMAILS`, signs a session JWT with `SESSION_SECRET`, sets an HTTP-only `rg_session` cookie.
  - `me.ts` — GET → reads the cookie, verifies the session, returns `{signedIn, email, adminEmails}`.
  - `signout.ts` — POST → clears the session cookie.
- New React surface:
  - `src/components/RequireAdmin.tsx` — gate wrapper. Calls `/api/auth/me` on mount, renders a loading state, then either the sign-in screen or the children. Exports an `AuthContext` for children to read current user and allowlist.
  - `src/components/SignInWithGoogle.tsx` — `@react-oauth/google` provider + button. Handles the token handoff to `/api/auth/verify` and surfaces errors (e.g. "your email is not on the allowlist").
  - `src/lib/authClient.ts` — browser-side `fetchMe()`, `postVerify()`, `postSignOut()` helpers with `credentials: include`.
- New admin pages under `src/pages/admin/`:
  - `AdminDashboard.tsx` — landing dashboard with two cards and a sign-out button.
  - `AdminUsers.tsx` — read-only allowlist view with instructions for editing via the Vercel dashboard. Role-based permissions deferred.
  - `AdminSchedule.tsx` — renamed from the old `src/pages/ManageSchedule.tsx` (git-mv preserves history). Internal nav `navigate('/')` calls now route back to `/admin`. Import paths adjusted for the new directory depth.
- `src/App.tsx` — replaced the single `/manage-schedule` route with three new auth-gated routes (`/admin`, `/admin/users`, `/admin/schedule`) wrapped in `<RequireAdmin>`.
- `public/robots.txt` — removed the dead `Disallow: /manage-schedule` line (route no longer exists). `Disallow: /admin` retained.
- `.env.example` — documented `VITE_GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `SESSION_SECRET`.
- Vercel env vars set via CLI: `VITE_GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, and `SESSION_SECRET` added for **Production** and **Development** targets. **Preview target not set** — a CLI quirk in the current Vercel CLI version couldn't resolve the "all Preview branches" prompt non-interactively. Feature-branch preview deploys will need these three env vars added manually via the Vercel dashboard OR the CLI in an interactive shell before the admin sign-in will work on a preview URL. Production is unaffected.
- `docs/plans/2026-04-13-001-feat-seo-geo-rollout-beta-plan.md` — Unit 11 scope updated in-place to reflect the dashboard expansion (previously just a direct rename of `/manage-schedule` → `/admin`).
- Test suite: 65 → 89 tests (added 16 auth.ts unit tests plus the 8 h1-semantics tests from 1.1.0). All green.

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
