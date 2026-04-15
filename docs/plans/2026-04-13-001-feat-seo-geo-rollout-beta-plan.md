---
title: "feat: SEO + GEO + visibility rollout for Rob's Gardens"
type: feat
status: active
date: 2026-04-13
origin: conversation audit (no brainstorm doc)
---

# feat: SEO + GEO + visibility rollout for Rob's Gardens

## Overview

Rob's Gardens currently has zero public search footprint. A conversation-driven audit on 2026-04-13 uncovered two showstopper blockers (the canonical domain does not resolve publicly; Vercel Deployment Protection returns an SSO wall to all crawlers) and fourteen follow-on issues covering on-page SEO, AI-crawler readiness (GEO), and off-site visibility. This plan sequences the 18 implementation units into three phases that land the site as crawlable, structurally correct, and discoverable — first for Google, then for AI answer engines, then for the local suburbs Rob actually services.

## Problem Frame

Rob is a real Northern Beaches gardener with three crews running a Monday-to-Friday schedule across ~14 Sydney suburbs. He has a React SPA site built on Vite with Vercel hosting, but:

- The canonical URL (`www.robgardens.com.au`) returns NXDOMAIN — DNS is not wired.
- The Vercel production URL is behind SSO protection — Googlebot, ChatGPT, Claude, Perplexity all hit an auth wall.
- The site is an SPA with no prerendering — crawlers that do get through see an empty `<div id="root">`.
- The `<h1>` is the business name in 18px text in the header, wrapping a hidden `<Link>` on the letter "e" of "Maintenance" that opens the unauthenticated `/manage-schedule` admin page.
- Schema.org LocalBusiness is present but lacks geo coordinates, image, service catalogue, or suburb-scoped `areaServed`.
- No sitemap.xml, no llms.txt, no AI-crawler rules.
- No suburb-level content for the actual service areas.
- No Google Business Profile presence.
- Version is `0.0.0` with no CHANGELOG, violating the global versioning rule in `~/.claude/CLAUDE.md`.

Giles (the operator of this project) has confirmed each issue and answered every remediation question in-thread. This plan captures those answers as a dependency-ordered execution artefact.

## Requirements Trace

- **R1.** The public canonical domain resolves to Vercel and serves the Rob's Gardens site without authentication walls.
- **R2.** Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, and Google-Extended all receive crawlable HTML with real content and schema on first hit.
- **R3.** The homepage advertises the primary service and location in the title tag, H1, meta description, and LocalBusiness schema — all keyword-aligned without stuffing.
- **R4.** The admin page is served at `/admin` (renamed from `/manage-schedule` in Phase 2 Unit 11) and protected by Google authentication with an email allowlist. No hidden backdoor entry points remain.
- **R5.** The site has 14 dedicated suburb landing pages (Mosman, Botany, Alexandria, Rose Bay, Vaucluse, Dover Heights, Paddington, Clontarf, Seaforth, Curl Curl, Cammeray, Balgowlah, Terrey Hills, St Ives) with unique copy, per-suburb schema, and routed URLs.
- **R6.** A Google Business Profile draft is ready for Rob to submit, covering services, hours, categories, description, and photo ask.
- **R7.** A GHL review-request automation spec is ready to implement once Rob's GHL credentials are available.
- **R8.** A Top 10 AU citation directories checklist with identical NAP (name/address/phone) is ready for submission.
- **R9.** `package.json` version, `CHANGELOG.md`, and in-app version display comply with the global versioning rule, including the new "What's new" / "Under the hood" CHANGELOG split.
- **R10.** All changes are delivered against branch protection with passing tests. Non-trivial code lands test-first.

## Scope Boundaries

**In scope:**
- All on-page SEO (title, meta, H1, schema, sitemap, robots, llms.txt)
- All AI-crawler configuration (allowlists, llms.txt)
- Admin authentication hardening (Google OAuth, allowlist)
- Prerendering the SPA for crawlers
- Suburb page content and routing
- Versioning compliance
- Drafts and checklists for off-site work (GBP, citations, reviews, photos)

**Out of scope:**
- Migrating the site off Vite/React to a framework with native SSR (Next.js, Remix, Vike). Prerendering only.
- Paid search (Google Ads, Facebook Ads) — organic only.
- Paid directory placements (hipages Plus, Oneflare paid plans) — free listings only.
- Rebuilding the GHL chat widget or AI voice orb.
- Conversion-rate optimisation beyond what the SEO changes naturally carry.
- Executing Google Business Profile submission on Rob's behalf (requires his Google account).
- Executing GHL automation wiring (requires Rob's GHL credentials).
- Taking job-site photos for EXIF geotagging (requires Rob physically on-site).

## Context & Research

### Relevant Code and Patterns

- `index.html` — current title, meta, schema, canonical
- `src/App.tsx` — react-router routes, currently `/`, `/manage-schedule`, `/schedule`, `*`
- `src/pages/Index.tsx` — homepage composition
- `src/components/Hero.tsx` — currently-wrong h2 where h1 belongs
- `src/components/Header.tsx` — holds the misused h1 and the backdoor `<Link>` on the letter "e" of "Maintenance"
- `src/components/Footer.tsx` — holds duplicate brand markup and dirty Instagram/Facebook URLs with tracking fragments
- `src/pages/ManageSchedule.tsx` — the unauthenticated admin page to protect
- `public/robots.txt` — minimal, no sitemap reference, no AI crawlers
- `vite.config.ts` — currently no prerendering, no version injection
- `package.json` — version `0.0.0`, no scripts for prerendering

### Institutional Learnings

- **Global CLAUDE.md versioning rule** (updated 2026-04-13, lines 125–179): CHANGELOG entries now split into `What's new` (customer-facing outcomes in plain language) and `Under the hood` (technical detail, file paths, rationale). In-app changelog pages render the "Under the hood" section dimmer. Reference implementation in WLC repo: `src/lib/parseChangelog.js`, `src/lib/annotateChangelogBlocks.js`, `src/pages/Changelog.jsx`.
- **Global CLAUDE.md shipping discipline rule** (lines ~250): branch protection on default branch, CI required, no `--no-verify` hooks, no auto-migrations, observability scaled to project size.
- **Global CLAUDE.md timezone rule**: any timestamp shown to user must be converted to Australia/Sydney with AEST/AEDT suffix. Today 2026-04-13 is AEST (DST ended 6 April 2026, first Sunday).
- **VSStudio project rule**: all projects live in `/Users/gilesparnell/Documents/VSStudio/`. Rob's Gardens is at `client-sites/robs-gardens/` — correct location.
- **Ship Fast philosophy** (memory): prefer simplest working solution. Don't wire Clerk/Supabase for a single admin route when Google Identity Services does the job in one serverless function.
- **Credit Efficiency rule** (memory): challenge expensive approaches; 16 items is big but each is individually small and the whole audit can be done in ~2–3 working days.
- **TDD Mandatory rule** (memory): test-first applies to all logic-bearing code. Static files (robots.txt, sitemap.xml, llms.txt, HTML meta) do not require tests. Admin auth gate and suburb page routing DO require tests.

### External References

- **llmstxt.org** — Jeremy Howard's proposed markdown-index standard for LLM-friendly site summaries. Single `/llms.txt` at site root, markdown format, H1 = site name, H2 sections for key pages/services, one bullet per link with short description.
- **Schema.org LocalBusiness vocabulary** (schema.org/LocalBusiness) — current recommended fields: `@id`, `name`, `image`, `logo`, `url`, `telephone`, `email`, `address`, `geo`, `areaServed` (array of Place), `priceRange`, `openingHoursSpecification`, `hasOfferCatalog` with nested OfferCatalog → itemListElement → Offer → itemOffered (Service).
- **Google's AI crawler docs** — `Google-Extended` is the separate token for AI training opt-in/out, distinct from `Googlebot`. Both should be allowed for a site that wants AI answer citations.
- **OpenAI GPTBot docs** (platform.openai.com/docs/gptbot) — allow via robots.txt user-agent directive.
- **Anthropic ClaudeBot docs** — similar, `User-agent: ClaudeBot`.
- **Perplexity crawler** — `User-agent: PerplexityBot`.
- **Common Crawl** — `User-agent: CCBot` (training data for many LLMs).
- **Google Identity Services** (developers.google.com/identity/gsi/web/guides/overview) — client-side JS SDK, returns Google-signed JWT. Server verifies JWT with Google's public keys. No OAuth dance, no redirect flow.
- **@prerenderer/rollup-plugin** — stable rollup plugin for post-build static prerendering using puppeteer. Works with Vite because Vite builds on rollup. Alternative: write a custom post-build script using `ReactDOMServer.renderToString` walking known routes.

## Key Technical Decisions

- **Domain DNS strategy: CNAME flattening via registrar, not Vercel nameservers.** Giles retains control at the registrar; we only need Vercel's A/ALIAS target. Rationale: less lock-in, faster rollback if something breaks.
- **Deployment Protection stays ON for preview deployments, OFF for production.** Rationale: preview URLs still need gating so unfinished work doesn't leak; production must be crawlable.
- **Admin auth: Google Identity Services (GSI) + a single Vercel serverless function, not Clerk/Supabase/Auth0.** Rationale: one admin page, two expected users, zero need for account management. Minimise dependencies. Plan B if GSI proves flaky: migrate to Supabase Auth (Giles already runs Supabase elsewhere).
- **Allowlist stored as `ADMIN_EMAILS` env var on Vercel (comma-separated), validated server-side in the `/api/auth/verify` function.** Rationale: no DB, no user management UI, trivially auditable.
- **Session: HTTP-only signed cookie with 7-day expiry, signed with `SESSION_SECRET` env var.** Rationale: industry standard, minimal surface area.
- **Prerendering: `@prerenderer/rollup-plugin` with the puppeteer renderer, running as a post-build step.** Rationale: works with the existing Vite build without migrating to a framework. Plan B: custom post-build Node script walking React Router routes and rendering via `ReactDOMServer.renderToStaticMarkup`.
- **H1 semantics: the visible hero headline in `Hero.tsx` becomes the `<h1>` with keyword-rich text. The header brand block in `Header.tsx` demotes to a `<div>` / `<span>` with `aria-label` preserving the brand name for screen readers.** Rationale: the H1 should be the most prominent on-page heading, and the primary keyword for SEO.
- **Keyword-aligned title tag:** `Rob Gardening & Maintenance | Northern Beaches Garden Services Sydney` (60 chars, brand-led, location + service). Rationale: brand recognition + primary keyword + location, under the 60-char Google display cap.
- **Keyword-aligned H1:** `Garden Maintenance & Lawn Care — Northern Beaches, Sydney`. Rationale: primary service + location, matches search intent for the Northern Beaches area.
- **Suburb page URL pattern: `/gardening-<slug>` (e.g. `/gardening-mosman`, `/gardening-rose-bay`).** Rationale: keyword-in-URL is a mild ranking signal, pattern is consistent and human-readable, hyphenated slugs match Google preferences.
- **Suburb page copy: unique per suburb, not templated, 400–600 words each.** Rationale: duplicate/near-duplicate content across suburb pages is a recognised Google penalty trap. Each page gets unique local context (nearby landmarks, suburb character, typical garden challenges for that area).
- **Schema: one global LocalBusiness `@id` on homepage plus per-suburb LocalBusiness with `@id` derived from the suburb URL and `areaServed` scoped to that suburb only.** Rationale: Google can understand service-area targeting at suburb granularity without creating duplicate business records.
- **Version bump: `0.0.0` → `1.0.0`.** Rationale: real business with real (pending) users in production; earns the stable interface marker. Global rule allows 1.0 for real-user projects.
- **CHANGELOG format: new global split — `What's new` (plain language) + `Under the hood` (technical).** Rationale: matches the 2026-04-13 update to the global CLAUDE.md. Plan will create `CHANGELOG.md` with a 1.0.0 entry summarising the entire rollout.
- **Version display: footer, `vX.Y.Z (sha7)` in small monospace.** Rationale: matches WLC reference implementation per global rule.
- **Social URL cleanup: strip `igsh`, `mibextid` tracking fragments and replace with canonical handles.** Rationale: cleaner `sameAs` signal for Google, no tracking leakage for visitors.
- **Backdoor link removal: strip the `<Link>` around the letter "e" in `Header.tsx:32` in Phase 1 even before admin auth lands in Phase 2.** Rationale: the backdoor is a security issue on its own and shouldn't linger waiting for the bigger fix. The route remains accessible via direct URL in the interim — acceptable because no one knows the URL yet.

## Open Questions

### Resolved During Planning

- **Does Giles have the domain?** Yes — confirmed in conversation. It is not yet pointed at Vercel. Resolution: Phase 1 Unit 1 adds the domain to the Vercel project and outputs the registrar DNS records Giles will paste.
- **Is it OK to disable Vercel Deployment Protection on production?** Yes — confirmed in conversation, with preview deployments staying protected. Resolution: Phase 1 Unit 2 calls the Vercel API to set `ssoProtection` to preview-only.
- **Which admin auth provider?** Google Identity Services with email allowlist. See Key Technical Decisions.
- **Which prerendering tool?** `@prerenderer/rollup-plugin`. See Key Technical Decisions.
- **Which suburbs?** 14 confirmed in conversation: Mosman, Botany, Alexandria, Rose Bay, Vaucluse, Dover Heights, Paddington, Clontarf, Seaforth, Curl Curl, Cammeray, Balgowlah, Terrey Hills, St Ives. Mosman appears multiple times in Rob's weekly schedule — still one page.
- **Version starting value?** 1.0.0. See Key Technical Decisions.
- **CHANGELOG format?** New split format per updated global CLAUDE.md.

### Deferred to Implementation

- **Exact Vercel DNS target values.** The API will return them when the domain is queried post-add. Captured at implementation time, not in the plan.
- **Vercel serverless function runtime (Node 18 vs 20).** Whatever the project's `@vercel/node` version defaults to. Check at implementation time.
- **Google Identity Services client ID / OAuth consent screen setup.** Requires logging into Google Cloud Console and creating an OAuth 2.0 client for the production origin. Not scriptable from here — Giles does this once and stores the client ID in `VITE_GOOGLE_CLIENT_ID`.
- **Exact geo coordinates for each suburb.** Will look up at the time each suburb page is created — likely suburb centroid from an authoritative source such as Australian Bureau of Statistics suburb boundaries or a known mapping service. Not a blocker for planning.
- **Exact suburb-specific copy angles.** Will draft at implementation time using local knowledge (suburb character, common garden types, typical property sizes). Not scriptable in advance.
- **Whether `@prerenderer/rollup-plugin` works cleanly with `lovable-tagger` in the Vite config.** If there is a conflict, switch to a custom post-build Node script. Discovered at implementation time.
- **Whether the existing `public/apple-touch-icon.png` and `rob-gardens-logo.jpg` are high enough resolution for schema `image` and `logo` fields.** If not, request higher-res versions from Rob. Verified at implementation time.
- **GHL API shape for the review-request automation.** Giles will share his GHL workflow builder access when ready; implementation learns the exact trigger/action contract then.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

### Request flow for a first-time crawler after all phases land

```
Googlebot / GPTBot / ClaudeBot
        │
        ▼
  www.robgardens.com.au  (DNS → Vercel edge)
        │
        ▼
  Vercel edge (no SSO wall for production)
        │
        ▼
  Prerendered static HTML for the requested route
  (/, /gardening-mosman, /gardening-rose-bay, ...)
        │
        ├─► <title>, <meta description>, canonical
        ├─► <h1> with primary keyword
        ├─► Full body content (prerendered, not a bare #root div)
        ├─► LocalBusiness JSON-LD scoped to the suburb
        └─► Link to llms.txt, sitemap.xml referenced in robots.txt
```

### Admin auth flow (Phase 2)

```
User navigates to /admin
        │
        ▼
<RequireAdmin> wrapper checks session cookie
        │
        ├─► cookie valid + email in allowlist → render ManageSchedule
        └─► no cookie / invalid → render <SignInWithGoogle>
                │
                ▼
           Google Identity Services SDK (browser)
                │
                ▼
           Google returns signed ID JWT
                │
                ▼
           POST /api/auth/verify {idToken}
                │
                ▼
           Serverless fn: verify JWT against Google public keys
                │                     check email ∈ ADMIN_EMAILS env
                │
                ├─► valid → sign session JWT with SESSION_SECRET,
                │             set HTTP-only cookie (7-day expiry),
                │             return 200
                └─► invalid → 403
                │
                ▼
           Client retries /admin
                │
                ▼
           <RequireAdmin> sees valid cookie → renders ManageSchedule
```

## Implementation Units

### Phase 1 — Infrastructure + static wins (make the site actually crawlable)

- [ ] **Unit 1: Wire `robgardens.com.au` and `www.robgardens.com.au` to the Vercel project**

**Goal:** The canonical domain and its www variant are attached to the `robs-gardens` Vercel project. Giles receives the exact DNS records to paste at his registrar so the domain resolves publicly.

**Requirements:** R1

**Dependencies:** None

**Files:**
- None in repo. Infrastructure action via Vercel CLI + API.

**Approach:**
- Use `vercel domains add robgardens.com.au` and `vercel domains add www.robgardens.com.au`. (Already partially done in a pre-plan execution pass on 2026-04-13 — confirm current state before re-running.)
- Query the Vercel API for the required DNS records (apex A record to Vercel edge IP, `www` CNAME to `cname.vercel-dns.com`).
- Output to Giles: the exact records, the TTL, and step-by-step instructions for pasting at his registrar.
- Verify public resolution with a DNS check against a public resolver (e.g. Google DNS over HTTPS) once Giles confirms the records are saved.

**Patterns to follow:**
- Global CLAUDE.md shipping discipline: no auto-apply of DNS. Output the records, let Giles paste.

**Test scenarios:**
- (No code test — infrastructure verification only.)
- `curl -I https://www.robgardens.com.au/` returns a 200 (or Vercel redirect to www) from the Vercel edge, not NXDOMAIN.
- `dig +short www.robgardens.com.au` returns an answer.

**Verification:**
- `vercel domains ls` shows both domains attached to the project.
- Public DNS resolution works from an external resolver.
- Giles visits `https://www.robgardens.com.au/` in a fresh browser and sees Rob's site (post-Unit-2).

---

- [ ] **Unit 2: Disable Vercel Deployment Protection on production (keep preview protected)**

**Goal:** Production deployments of the `robs-gardens` project return the site to unauthenticated crawlers. Preview deployments remain gated so in-progress work is not exposed.

**Requirements:** R1, R2

**Dependencies:** None (independent of Unit 1; can be done in parallel)

**Files:**
- None in repo. Vercel API call.

**Approach:**
- PATCH `https://api.vercel.com/v9/projects/{projectId}` with `ssoProtection` set to `null` for production-wide disable, or `{"deploymentType": "preview"}` to scope protection to preview only. The latter is preferred.
- Use the Vercel token from `~/Library/Application Support/com.vercel.cli/auth.json`.
- After the PATCH, curl the production URL as `Googlebot` user agent and confirm it returns the site HTML (not the Vercel SSO wall).

**Patterns to follow:**
- Vercel project settings API docs.

**Test scenarios:**
- (No code test — infrastructure verification only.)
- `curl -A "Googlebot/2.1" https://robs-gardens-<latest>.vercel.app/` returns HTML starting with `<!doctype html>` and containing `Rob Gardening` — not "Authentication Required".

**Verification:**
- cURL check passes.
- Vercel dashboard shows Deployment Protection set to "Only Preview Deployments".

---

- [ ] **Unit 3: Title tag + meta description + canonical tightening in `index.html`**

**Goal:** The homepage returns a keyword-aligned title, meta description, and canonical URL that match the primary service + location.

**Requirements:** R3

**Dependencies:** None

**Files:**
- Modify: `index.html`

**Approach:**
- Replace `<title>Rob Gardens</title>` with `<title>Rob Gardening & Maintenance | Northern Beaches Garden Services Sydney</title>`.
- Confirm the existing meta description remains accurate; tighten if needed.
- Leave canonical as `https://www.robgardens.com.au/` since Unit 1 wires the domain.

**Patterns to follow:**
- Google's title-tag guidance: under 60 characters, brand + primary keyword + location.

**Test scenarios:**
- No code test — HTML-only change.
- Post-change: view-source on the live site (or the build output in `dist/index.html`) confirms the new title.

**Verification:**
- `dist/index.html` after `npm run build` contains the new title.
- Google's Rich Results test and Lighthouse SEO audit both pass without warnings on the title tag.

---

- [ ] **Unit 4: Remove hidden backdoor `<Link>` on the letter "e" in `Header.tsx`**

**Goal:** The letter "e" of "Maintenance" in the header is no longer a hidden link to the unauthenticated admin page. The brand text reads cleanly to screen readers and crawlers.

**Requirements:** R4 (partial — full auth gate lands in Phase 2 Unit 11)

**Dependencies:** None

**Files:**
- Modify: `src/components/Header.tsx`

**Approach:**
- Strip the `<Link to="/manage-schedule">` wrapping the final letter. Replace with plain text `<p>& Maintenance</p>`.
- Also remove the now-unused `Link` import from `react-router-dom` if no other links remain in this file.

**Patterns to follow:**
- React Router convention: `Link` components live with other navigation, not hidden inside letter nodes.

**Test scenarios:**
- No unit test — JSX-only change with no branching logic.
- Visual / accessibility check: screen reader no longer announces a link on the letter "e".

**Verification:**
- `grep -r "to=\"/manage-schedule\"" src/` returns zero results (or only a deliberate explicit nav link added in Phase 2).
- Manual inspection of the rendered header in dev mode.

---

- [ ] **Unit 5: Expanded LocalBusiness schema in `index.html`**

**Goal:** The homepage JSON-LD schema is a complete LocalBusiness record with image, logo, geo coordinates, opening hours, service catalogue, and `areaServed` as an array of `Place` objects.

**Requirements:** R2, R3

**Dependencies:** None

**Files:**
- Modify: `index.html` (JSON-LD script block)

**Approach:**
- Add `@id` as a stable URL-based identifier.
- Add `image` and `logo` pointing to `/rob-gardens-logo.jpg` (verify resolution is adequate — at implementation time).
- Add `geo` with lat/lng for the Northern Beaches centroid (approx -33.75, 151.28 as a starting point — refine at implementation time).
- Add `openingHoursSpecification` as an array of `OpeningHoursSpecification` objects instead of the freeform `openingHours` string.
- Add `hasOfferCatalog` with one `OfferCatalog` containing `Offer` items wrapping `Service` objects (Lawn Care, Hedge Trimming, Pruning, Seasonal Garden Care, Green Waste, Hard Surface Cleaning, Garden Makeovers, Ride-On Mower Hire).
- Convert `areaServed` from a single string into an array of `Place` objects (Northern Beaches, Eastern Suburbs, Greater Sydney, Central Coast).
- Keep `sameAs` (cleaned in Unit 9).

**Patterns to follow:**
- Schema.org LocalBusiness vocabulary. Google's structured-data testing recommendations.

**Test scenarios:**
- No unit test — JSON-LD only.
- Paste the block into Google's Rich Results test — it should parse as a valid LocalBusiness with no errors and no warnings.

**Verification:**
- Rich Results test parses without errors.
- Each Service item is individually valid.

---

- [ ] **Unit 6: Create `public/sitemap.xml`**

**Goal:** The site serves a valid XML sitemap listing the canonical URLs.

**Requirements:** R2

**Dependencies:** None (Phase 1), but will be updated in Phase 3 Unit 14 to include suburb URLs.

**Files:**
- Create: `public/sitemap.xml`

**Approach:**
- Static sitemap with entries for `/`, `/schedule`, and `/manage-schedule` excluded (Disallow in robots).
- Include `<lastmod>` as the current date.
- Include `<changefreq>` = `monthly`, `<priority>` = `1.0` for `/`, `0.5` for `/schedule`.

**Patterns to follow:**
- sitemaps.org 0.9 spec.

**Test scenarios:**
- Validate XML with an online sitemap validator or `xmllint --noout public/sitemap.xml`.

**Verification:**
- Build output includes `dist/sitemap.xml` identical to the source.
- Public URL `https://www.robgardens.com.au/sitemap.xml` returns valid XML.

---

- [ ] **Unit 7: Expand `public/robots.txt` with AI crawlers, sitemap reference, and admin disallow**

**Goal:** robots.txt explicitly allows all major search and AI crawlers, references the sitemap, and disallows `/manage-schedule`.

**Requirements:** R2

**Dependencies:** Unit 6 (sitemap must exist to reference it — though order is not strict; the reference is harmless if the file is added slightly after)

**Files:**
- Modify: `public/robots.txt`

**Approach:**
- Keep existing `Allow: /` rules for Googlebot, Bingbot, Twitterbot, facebookexternalhit.
- Add explicit `User-agent` entries for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot` — all with `Allow: /`.
- Add `Disallow: /manage-schedule` under `User-agent: *`.
- Add `Sitemap: https://www.robgardens.com.au/sitemap.xml` at the bottom.

**Patterns to follow:**
- robotstxt.org spec. OpenAI / Anthropic / Perplexity official crawler docs.

**Test scenarios:**
- No unit test — static file.
- Post-deploy: fetch `/robots.txt` and confirm content.

**Verification:**
- `curl https://www.robgardens.com.au/robots.txt` shows all crawlers and the sitemap reference.
- Google Search Console robots tester accepts it without errors.

---

- [ ] **Unit 8: Create `public/llms.txt`**

**Goal:** The site serves an llms.txt markdown index per the llmstxt.org spec, summarising the business, services, and key pages in a format LLMs can quote.

**Requirements:** R2

**Dependencies:** None (Phase 1), but will be updated in Phase 3 Unit 14 to include suburb URLs.

**Files:**
- Create: `public/llms.txt`

**Approach:**
- H1: `Rob Gardening & Maintenance`.
- Short intro paragraph (1–2 sentences) describing the business: Northern Beaches Sydney garden maintenance, three crews, full-service residential.
- H2 `## Services` with bullets linking to `/#services` and listing each offering with a one-sentence description.
- H2 `## Service Area` with the suburb list (to be expanded in Phase 3 after suburb pages exist).
- H2 `## Contact` with phone, email, booking page.
- H2 `## Key Facts` (optional) with quotable short statements: years in operation, crew count, insurance status, eco-friendly practices.

**Patterns to follow:**
- llmstxt.org spec (Jeremy Howard).

**Test scenarios:**
- No unit test — static file.
- Manual readability check.

**Verification:**
- `curl https://www.robgardens.com.au/llms.txt` returns the markdown.
- Content is coherent when read aloud.

---

- [ ] **Unit 9: Strip tracking fragments from social URLs in `index.html` and `Footer.tsx`**

**Goal:** Instagram and Facebook URLs used in schema `sameAs` and the footer social links are canonical, without `igsh` / `mibextid` tracking junk.

**Requirements:** R2

**Dependencies:** None

**Files:**
- Modify: `index.html` (`sameAs` array in JSON-LD)
- Modify: `src/components/Footer.tsx` (href attributes on Instagram and Facebook anchor tags)

**Approach:**
- Instagram: replace `https://www.instagram.com/rob_gardens?igsh=...` with `https://www.instagram.com/rob_gardens/`.
- Facebook: replace the share-link URL with a canonical page URL. Verify the canonical Facebook page URL at implementation time (`https://www.facebook.com/robgardens` or similar — check which slug resolves).

**Patterns to follow:**
- Schema.org `sameAs` expects canonical profile URLs, not share-links.

**Test scenarios:**
- No unit test — HTML/JSX string edit.
- Manual click-through to confirm the canonical URLs still land on the profiles.

**Verification:**
- Both URLs resolve to the expected profiles in a browser.
- Rich Results test shows `sameAs` entries as valid URLs.

---

- [ ] **Unit 10: Version bump + `CHANGELOG.md` + in-app version display**

**Goal:** `package.json` version is `1.0.0`. Repo has a `CHANGELOG.md` using the new global split format. `vite.config.ts` injects the version and git SHA into the build. The footer displays `vX.Y.Z (sha7)` in small monospace text.

**Requirements:** R9

**Dependencies:** Phase 1 Units 3–9 should be in the same commit as the version bump per the versioning rule, so this unit runs last in Phase 1.

**Files:**
- Modify: `package.json` (`version`)
- Create: `CHANGELOG.md`
- Modify: `vite.config.ts` (add `define` block injecting `__APP_SEMVER__`, `__APP_VERSION__`, `__BUILD_TIME__`)
- Create: `src/lib/version.ts`
- Modify: `src/components/Footer.tsx` (add version line in the copyright row)
- Create: `src/components/Footer.test.tsx` (test that the footer renders the version line)

**Approach:**
- Follow WLC reference: `src/lib/version.js` + `vite.config.js` `define` pattern, adapted to TypeScript.
- `CHANGELOG.md` starts with the conventions header and a single `[1.0.0] — 2026-04-13` entry covering the entire Phase 1 work, with `What's new` and `Under the hood` sections per the new format.
- Footer version line sits in the existing copyright row, `font-mono text-xs text-primary-foreground/40`.

**Execution note:** Test-first for the Footer version-display component. The TypeScript type additions for `__APP_SEMVER__` etc. go in `src/vite-env.d.ts` and are config, not tested.

**Patterns to follow:**
- WLC `wholeLifeChallenge` reference implementation (`src/lib/version.js`, `vite.config.js`, `CHANGELOG.md`).

**Test scenarios:**
- **Footer renders version line:** renders the footer → asserts a text node matching `/^v\d+\.\d+\.\d+ \([0-9a-f]{7}\)$/` is present.
- **Footer version line uses monospace class:** asserts the element carries the `font-mono` class.
- **Build injects correct values:** `npm run build` completes without error and `dist/assets/*.js` contains the injected version string (integration, not unit).

**Verification:**
- `package.json` shows `"version": "1.0.0"`.
- `CHANGELOG.md` exists with a 1.0.0 entry using the new format.
- Footer renders the version + sha in production build.
- `src/components/Footer.test.tsx` passes.

---

### Phase 2 — Code-heavy hardening (admin auth, prerendering, semantics)

- [ ] **Unit 11: Build `/admin` dashboard + Google Identity Services auth gate**

**Scope (revised 2026-04-15):** `/admin` is now a **dashboard landing page** with navigation to two sub-sections, not a direct rename of the schedule page:

- `/admin` — dashboard with two cards: "Manage Schedule" and "Manage Users"
- `/admin/schedule` — the existing schedule management UI (renamed from `/manage-schedule`)
- `/admin/users` — a new page showing the current admin allowlist (read-only from `ADMIN_EMAILS` env), with instructions for adding/removing admins via the Vercel dashboard. A proper in-app edit flow with role-based permissions is deferred to a future phase.

All three sub-routes sit behind the same auth gate and require a signed-in Google account whose email is in `ADMIN_EMAILS`.

**Goal:** The admin area lives at `/admin` — a short, bookmarkable URL Rob can remember. The dashboard makes the sub-sections discoverable without making users type URLs. Unauthorised access to any `/admin*` route shows a sign-in screen; authorised access shows the requested page. The legacy `/manage-schedule` path no longer exists (it 404s via the existing NotFound route).

**Requirements:** R4

**Dependencies:** Phase 1 complete (not strictly, but Phase 1 must land first so we're not layering auth on a broken site).

**Files:**
- Create: `src/lib/auth.ts` — session helpers (read/write cookie, client-side session state)
- Create: `src/components/RequireAdmin.tsx` — wrapper component that checks session and renders either children or `<SignInWithGoogle>`
- Create: `src/components/SignInWithGoogle.tsx` — renders the Google Identity Services button, handles the JWT response, POSTs to `/api/auth/verify`
- Create: `api/auth/verify.ts` — Vercel serverless function verifying the Google ID token and setting the session cookie
- Create: `api/auth/verify.test.ts` — unit tests for the verify endpoint
- Create: `api/auth/signout.ts` — clears the session cookie
- Create: `src/components/RequireAdmin.test.tsx` — tests for the gate component
- Create: `src/lib/auth.test.ts` — tests for session helpers
- Modify: `src/App.tsx` — rename the `/manage-schedule` route to `/admin` and wrap it in `<RequireAdmin>`. No redirect for the old path — it falls through to the NotFound catch-all.
- Modify: `public/robots.txt` — change `Disallow: /manage-schedule` to `Disallow: /admin`
- Modify: `package.json` — add `@react-oauth/google` (and `jose` for JWT signing, or `jsonwebtoken`)
- Modify: `.env.example` — document the new env vars
- Vercel project env vars: `VITE_GOOGLE_CLIENT_ID`, `ADMIN_EMAILS`, `SESSION_SECRET` (Giles sets these via `vercel env add`)

**Approach:**
- Client: `@react-oauth/google` provider wraps the app. The `RequireAdmin` component checks a client-readable flag (whether the cookie exists and is not expired — the cookie itself is HTTP-only, so the client reads a companion non-HTTP-only flag like `rg_admin_signed_in=1`).
- Server: `api/auth/verify` verifies the Google ID token against Google's JWKS (via `jose` or a small hand-rolled verifier), confirms the email is in `ADMIN_EMAILS`, signs a session JWT with `SESSION_SECRET`, sets two cookies: `rg_session=<signed-jwt>` (HTTP-only, Secure, SameSite=Strict, 7 days) and `rg_admin_signed_in=1` (readable by client, 7 days).
- `api/auth/signout` clears both cookies.
- On app mount, if the client-readable flag is stale (say, older than 7 days), it triggers a silent re-verify via a `/api/auth/me` endpoint.

**Execution note:** Test-first. Start with a failing integration test for `api/auth/verify` — happy path (valid token, email in allowlist), sad path (valid token but email NOT in allowlist returns 403), sad path (invalid token returns 401). Then implement the endpoint. Then test-first for `RequireAdmin` — unauthenticated renders sign-in, authenticated renders children. Then implement.

**Patterns to follow:**
- Google Identity Services docs. `@react-oauth/google` README.
- JWT verification with `jose` against Google's JWKS endpoint.

**Test scenarios:**
- **verify endpoint, happy path:** valid Google ID token with email `giles@parnellsystems.com.au` (in allowlist) → returns 200, sets `rg_session` cookie, response body `{ok: true}`.
- **verify endpoint, email not in allowlist:** valid token, email `random@gmail.com` → returns 403, no cookie set.
- **verify endpoint, invalid token:** malformed / expired / wrong-issuer JWT → returns 401, no cookie set.
- **verify endpoint, wrong audience:** valid signature but wrong `aud` claim → returns 401.
- **RequireAdmin component, unauthenticated:** no cookie → renders `<SignInWithGoogle>`.
- **RequireAdmin component, authenticated:** cookie flag present → renders children.
- **RequireAdmin component, stale session:** flag present but server says invalid → renders sign-in again.
- **Session cookie is HTTP-only and Secure:** assert cookie flags.
- **Sign-out clears cookies:** `POST /api/auth/signout` → both cookies cleared.

**Verification:**
- All tests green.
- Manual test: visit `/admin` unauthenticated → sign-in screen. Sign in as an allowlisted email → schedule page renders. Sign in as non-allowlisted email → 403 message. Sign out → back to sign-in screen.
- Manual test: visit `/manage-schedule` → NotFound page (the old path no longer routes).

---

- [ ] **Unit 12: Prerendering via `@prerenderer/rollup-plugin`**

**Goal:** `npm run build` produces `dist/index.html`, `dist/schedule/index.html`, and `dist/gardening-<suburb>/index.html` files with real prerendered body content — not a bare `<div id="root">`. Crawlers get SEO-visible HTML on the first request.

**Requirements:** R2

**Dependencies:** Phase 3 Unit 14 (suburb pages must exist in routing before their prerendered HTML can be generated) — but the Vite config change itself can land first and be extended when suburb routes are added.

**Files:**
- Modify: `package.json` — add `@prerenderer/rollup-plugin`, `@prerenderer/renderer-puppeteer` as devDependencies
- Modify: `vite.config.ts` — register the prerender plugin with a routes list covering the known routes
- Possibly create: `scripts/prerender-routes.ts` — a small helper that reads `src/routes.ts` and exports the routes array so the Vite config and the router stay in sync

**Approach:**
- Start by listing the known routes explicitly: `['/', '/schedule']` in Phase 2. Extend to include all suburb routes in Phase 3.
- Configure puppeteer to wait for `networkidle0` or a specific DOM marker to ensure framer-motion and data-fetching complete before snapshotting.
- Strip or freeze any client-only scripts (GHL chat widget, analytics) in the prerendered output.
- Do not prerender `/admin` — it is auth-gated and has no SEO value.

**Execution note:** No unit-test-first; this is build-config work. Verify by building and inspecting `dist/index.html` body length before and after.

**Patterns to follow:**
- `@prerenderer/rollup-plugin` README.

**Test scenarios:**
- **Build succeeds:** `npm run build` exits 0.
- **Prerendered HTML contains real content:** `dist/index.html` body length > 5000 bytes (vs the current ~100 bytes for a bare root div).
- **Prerendered HTML contains the H1 keyword:** `dist/index.html` contains the string `Garden Maintenance` somewhere in the body.
- **Prerendered HTML does not contain `data-reactroot` leftover debug markup:** sanity check.
- **JavaScript still rehydrates:** dev build still works, client interactivity unaffected.

**Verification:**
- Build outputs contain prerendered HTML for all listed routes.
- `curl` with `--user-agent ""` (mimicking a no-JS crawler) against the deployed site returns real HTML, not a shell.
- Lighthouse SEO audit on the deployed site scores > 95.

---

- [ ] **Unit 13: Fix h1 semantics — hero headline becomes the real `<h1>`**

**Goal:** The most prominent on-page heading on the homepage is an `<h1>` with keyword-rich text. The header brand block demotes to a visual-only div with an `aria-label` preserving the brand for assistive technology.

**Requirements:** R3

**Dependencies:** None (independent of Units 11, 12)

**Files:**
- Modify: `src/components/Hero.tsx` — change the current `<h2>` to `<h1>`, update the text to `Garden Maintenance & Lawn Care — Northern Beaches, Sydney`. Keep "The Art of Green Care" as a tagline underneath.
- Modify: `src/components/Header.tsx` — change the current `<h1>` to `<div>` with `aria-label="Rob Gardening and Maintenance"`. The visible text "Rob Gardening" / "& Maintenance" remains unchanged.
- Create / modify: `src/components/Hero.test.tsx` — assert a single `<h1>` on the rendered homepage with the expected keyword-aligned text.

**Approach:**
- A single h1 per page is the semantic rule. The hero is the right place.
- Keep the existing framer-motion animations unchanged.

**Execution note:** Test-first. Write the Hero test expecting the new h1 text, confirm it fails against the current h2, then make the change.

**Patterns to follow:**
- HTML5 outline algorithm. WAI-ARIA landmark usage.

**Test scenarios:**
- **Exactly one `<h1>` on the homepage:** `queryAllByRole("heading", { level: 1 })` returns exactly one element.
- **H1 contains the primary keyword:** text matches `/Garden Maintenance.*Northern Beaches/i`.
- **Header brand is still announced:** `getByLabelText("Rob Gardening and Maintenance")` finds an element.
- **No h1 in Header component:** `Header.test.tsx` asserts zero h1s.

**Verification:**
- All tests green.
- Lighthouse SEO and accessibility audits pass without heading-related warnings.

---

### Phase 3 — Content + off-site (suburb pages, GBP, reviews, citations, photos)

- [ ] **Unit 14: Generate 14 suburb service-area pages with unique copy and per-suburb schema**

**Goal:** The site has 14 routed landing pages under `/gardening-<suburb-slug>`, each with unique 400–600-word copy, per-suburb LocalBusiness schema, internal links to neighbouring suburbs, and sitemap + llms.txt entries.

**Requirements:** R5

**Dependencies:** Phase 2 Unit 12 (prerendering) is ideal but not strictly required — without prerendering, these pages still rank eventually because Googlebot does JS, just slower. With prerendering, they rank faster.

**Files:**
- Create: `src/pages/suburbs/MosmanPage.tsx` (and 13 more, one per suburb)
- Create: `src/pages/suburbs/suburbData.ts` — shared suburb metadata (name, slug, centroid lat/lng, neighbouring suburbs, local landmarks, character notes)
- Create: `src/components/SuburbPageLayout.tsx` — shared layout (header, hero, services summary, testimonial, CTA, footer) with injection points for the suburb-specific body content
- Modify: `src/App.tsx` — add 14 new `<Route>` entries
- Modify: `public/sitemap.xml` — add 14 new `<url>` entries
- Modify: `public/llms.txt` — add the suburb list under Service Area
- Modify: `vite.config.ts` — add the 14 new routes to the prerender plugin's routes array
- Create: `src/pages/suburbs/suburbData.test.ts` — assert every suburb has a non-empty body, a unique slug, and valid coordinates
- Create: `src/pages/suburbs/MosmanPage.test.tsx` — one representative test to catch routing / schema regressions

**Approach:**
- Each suburb page follows the same layout component but receives a unique `bodyContent` prop from `suburbData.ts`. Body content is hand-written per suburb, not templated.
- Each page renders a per-suburb JSON-LD LocalBusiness with `@id` = canonical suburb URL, `areaServed` = that one suburb as a `Place` with `geo`.
- Each page links to 2–3 neighbouring suburbs ("We also service Mosman, Cammeray, and Balgowlah — click to learn more about our service in those suburbs.").
- Internal link from the homepage footer or a "Service Areas" section listing all 14 with links.

**Execution note:** Test-first for the routing + data layer. The per-suburb JSX is mostly content (not logic) and can skip unit tests — the suburbData test asserts the content shape and the representative page test covers routing and schema.

**Patterns to follow:**
- `src/pages/Index.tsx` composition pattern.
- React Router v6 route declarations.
- Shared `SuburbPageLayout` to avoid duplicating layout across 14 files.

**Test scenarios:**
- **All 14 suburbs present in suburbData:** length === 14.
- **All slugs are unique:** `new Set(slugs).size === 14`.
- **All bodies are at least 400 words:** word count per body ≥ 400.
- **All bodies are at most 800 words:** body ≤ 800 (soft cap to catch bloat).
- **Each body mentions the suburb name at least twice:** keyword relevance check.
- **Representative MosmanPage renders without error:** smoke test via `render(<MosmanPage />)`.
- **MosmanPage contains the suburb name in an `<h1>`:** semantic check.
- **MosmanPage contains a valid JSON-LD script:** script tag with `@type: "LocalBusiness"` and correct `@id`.
- **App routes include all 14 suburb paths:** routing integration test.

**Verification:**
- All tests green.
- `npm run build` succeeds and produces `dist/gardening-<suburb>/index.html` for all 14 suburbs.
- Each prerendered file contains the unique suburb copy and the suburb-scoped schema.
- Sitemap and llms.txt both list all 14.

---

- [ ] **Unit 15: Draft Google Business Profile content for Rob to submit**

**Goal:** A self-contained document Rob can paste into his Google Business Profile creation flow: business name, categories, service area, hours, full description, service list, photo ask.

**Requirements:** R6

**Dependencies:** None

**Files:**
- Create: `docs/gbp-submission.md`

**Approach:**
- Business name: Rob Gardening and Maintenance.
- Primary category: Gardener. Secondary: Lawn care service, Landscaper.
- Service area: 14 suburbs from Unit 14.
- Hours: Mo-Sa 07:00–17:00 (matches existing schema).
- Short description (≤ 750 chars): three-crew operation, Northern Beaches focus, pre-sale makeovers a speciality.
- Full services list mirroring the homepage.
- Photo ask: 10+ before/after photos, exterior shots of the team and ride-on mower, logo.
- Note to Rob: must be submitted from his own Google account. Cannot be created on his behalf.

**Test scenarios:**
- None — this is a draft document.

**Verification:**
- Giles reviews the draft and forwards to Rob.
- Once Rob submits and verifies, the Google Business Profile link is added to schema `sameAs` and the site footer.

---

- [ ] **Unit 16: GHL review-request automation spec**

**Goal:** A written spec Giles can hand to a GHL workflow builder session (or execute himself) that triggers a review-request SMS 24 hours after a job-completion tag is applied to a contact.

**Requirements:** R7

**Dependencies:** None (Rob's GHL credentials needed at execution time, not planning time)

**Files:**
- Create: `docs/ghl-review-automation.md`

**Approach:**
- Trigger: contact gets tag `job-complete`.
- Action 1: wait 24 hours.
- Action 2: send SMS with the Google Business Profile review link (once GBP is live from Unit 15).
- Action 3: wait 7 days.
- Action 4: if the contact has no tag `review-received`, send a follow-up email with a soft ask.
- Note: the review link can be pre-generated from GBP → "Get more reviews" → the short-link URL.

**Test scenarios:**
- None — this is a spec document. Validation happens when the automation is built.

**Verification:**
- Giles (or Rob) builds the workflow in GHL. First test contact receives the SMS on schedule.

---

- [ ] **Unit 17: Australian citation directories checklist**

**Goal:** A checklist Giles can work through (or hand to a VA) with prepared NAP content for each Australian directory, ready to paste.

**Requirements:** R8

**Dependencies:** Phase 1 must be complete (the canonical URL must work before NAP submissions — otherwise the citations all point to a dead domain).

**Files:**
- Create: `docs/au-citations-checklist.md`

**Approach:**
- Standard NAP block ready to paste: name, address (will need Rob's service address — may be a PO box or home business address), phone, email, website, business hours, service categories, description.
- One section per directory: True Local, Yellow Pages AU, Yelp AU, Hotfrog, StartLocal, dLook, Womo, Oneflare (free), ServiceSeeking, hipages (free tier).
- Checklist format so Giles / VA can tick off each submission.
- Note: all submissions must use the identical NAP to preserve consistency. Any variation (abbreviations, phone formatting) risks Google treating them as separate businesses.

**Test scenarios:**
- None — this is a reference document. Validation happens when submissions are live.

**Verification:**
- All 10 directories show Rob Gardening and Maintenance with consistent NAP within 30 days of submission.

---

- [ ] **Unit 18: Photo + EXIF ask to Rob**

**Goal:** A written request to Rob asking for before/after photos of real jobs, ideally taken on-site with a smartphone so EXIF GPS data is baked in.

**Requirements:** R6 (supports GBP), R2 (supports homepage + suburb pages), R5 (supports suburb pages)

**Dependencies:** None

**Files:**
- Create: `docs/photo-request-to-rob.md`

**Approach:**
- Explain why geotagged EXIF matters: Google weighs it for local intent, and it saves manual tagging.
- Request: ≥ 20 before/after pairs across a mix of job types (lawn mowing, hedge trimming, makeover, pre-sale). Shot on smartphone with location services ON.
- Also request: 3–5 photos of each crew at work, the ride-on mower, any branded vehicle, Rob himself for the team page.
- Preferred delivery: iCloud / Google Drive shared folder or Dropbox.
- Quality guidance: landscape orientation, good daylight, clean shots, customer consent implicit (tell Rob to only send photos of jobs where the homeowner is OK with it being on the website).

**Test scenarios:**
- None — draft document.

**Verification:**
- Rob delivers the folder. Photos are integrated into the homepage gallery, suburb pages (where geographically relevant), and the GBP listing.

## System-Wide Impact

- **Interaction graph:** The admin auth gate (Unit 11) sits in front of `/admin` only (the route is renamed from `/manage-schedule` as part of the same unit). All other routes are unaffected. The prerendering (Unit 12) touches the build pipeline — it runs after Vite's own build step and operates on the `dist/` output. It does not affect dev mode. The suburb pages (Unit 14) add 14 new routes to the router but do not alter existing route behaviour.
- **Error propagation:** If the Google OAuth flow fails at verify time, the client falls back to rendering the sign-in screen with an error message. If Google's JWKS endpoint is unreachable, the verify function returns 503 — the site remains functional for non-admin users. If prerendering fails during build, the build fails fast — no partial deploy.
- **State lifecycle risks:** Session cookies expire after 7 days. If `SESSION_SECRET` rotates, all active admin sessions are invalidated immediately on the next request — acceptable. If `ADMIN_EMAILS` is edited to remove an admin, their existing session remains valid until expiry — this is a known limitation of session-cookie auth without a central session store and is acceptable for a two-user admin page. Document this in the admin page's own docs.
- **API surface parity:** The only new API routes are `/api/auth/verify`, `/api/auth/signout`, and possibly `/api/auth/me`. No existing routes change shape.
- **Integration coverage:** Tests cover the verify endpoint, the RequireAdmin component, and the suburb routing. A manual end-to-end test after Phase 2 is required to confirm the full sign-in flow works against real Google credentials. An end-to-end test of a crawler hitting a prerendered suburb page (using `curl -A "Googlebot"`) confirms the crawler gets real HTML.

## Risks & Dependencies

- **R1 — DNS propagation delay:** After Giles pastes the records at his registrar, propagation can take minutes to hours. Mitigation: verify with `dig` against multiple public resolvers before declaring Unit 1 done.
- **R2 — Google OAuth consent screen approval:** A brand-new OAuth client may require a verification step if scopes beyond `email` + `profile` are requested. Mitigation: restrict scopes to the minimum (`openid email profile`); this keeps the consent screen in "testing" mode and does not need Google review for a handful of allowlisted users.
- **R3 — `@prerenderer/rollup-plugin` conflict with `lovable-tagger`:** The Vite config already uses `lovable-tagger` in dev mode. If the prerender plugin fights with it, fall back to a custom post-build Node script that renders routes via `ReactDOMServer.renderToStaticMarkup`. Cost: a day of work, not a blocker.
- **R4 — Schema validation surprises:** Google's Rich Results test sometimes flags `openingHoursSpecification` as a warning if the time format is off by a single colon. Mitigation: paste each schema block into the Rich Results test before merging.
- **R5 — Suburb page duplicate-content risk:** If the 14 suburb pages end up with 70%+ similarity, Google may treat them as doorway pages and penalise. Mitigation: the acceptance criterion in Unit 14 enforces unique body content and the keyword-check tests catch the obvious traps. A pair of local reviewers (Giles + one fresh reviewer) should read at least two pages to confirm they feel like real content, not Mad Libs.
- **R6 — Tests for the admin auth gate need Google JWKS access:** Unit tests for `/api/auth/verify` must either mock Google's JWKS endpoint or use a fixture token. Mitigation: use a fixture-based approach with a local keypair for test signing, and a separate integration test against the real Google endpoint gated behind an `INTEGRATION=1` env var.
- **R7 — Letter "e" backdoor — resolved:** Confirmed with Giles (2026-04-14) that Rob has not been using the letter-"e" link to reach the admin page. Unit 4 can strip the backdoor in Phase 1 with no bookmark-migration cost, and Unit 11 will ship `/admin` + Google sign-in as Rob's first real path in.
- **R8 — Vercel serverless function cold starts:** The verify function runs cold on the first admin login of the day. This is an acceptable UX cost for a two-user admin page.
- **R9 — Cache staleness on prerendered files:** After deploy, old HTML may be cached at the edge for minutes. Mitigation: Vercel handles cache invalidation on deploy; no special action needed.

## Documentation / Operational Notes

- **Project CLAUDE.md:** Add a project-local `CLAUDE.md` at `client-sites/robs-gardens/CLAUDE.md` documenting the versioning rule (since this is the first bump) and the admin auth architecture (so future sessions know not to re-invent Clerk/Supabase).
- **In-app changelog page:** Optional follow-up — the WLC reference has an in-app changelog renderer. Adding one to Rob's Gardens is not required for Phase 1–3 but may be desirable in a follow-up.
- **Monitoring:** Add a Monitor for the production Vercel deploy after Phase 1 lands, per the global Monitor rule. Filter: `error|failed|5[0-9]{2}`. Purpose: catch regressions from the Phase 1 changes.
- **Observability scaling per global rule:** Rob's Gardens is a "small project, handful of trusted users I know personally" profile. Sentry is recommended, `/health` optional, product analytics skipped. Phase 2 should include Sentry initialisation if it is not already present. (Defer to a follow-up plan if needed.)
- **Branch protection:** Confirm `main` branch protection is enabled on this repo before merging. If not, add it per the global shipping discipline rule.

## Phased Delivery

### Phase 1 — Make the site publicly crawlable

Units 1–10. Expected landing: one PR covering all the infrastructure + static wins, bumping the version to 1.0.0. Estimated effort: one working day.

Units are largely independent and most are HTML / static file edits. Units 1 and 2 are infrastructure (not code). Units 3–9 can be batched into a single commit. Unit 10 (version bump + CHANGELOG) is the same commit per the global versioning rule.

### Phase 2 — Harden the semantics and the auth

Units 11–13. Expected landing: 2–3 PRs — one for the h1 fix, one for prerendering, one for admin auth. Estimated effort: two working days. Admin auth is the biggest piece; prerendering is moderate; h1 fix is small.

### Phase 3 — Content and off-site

Units 14–18. Expected landing: 14 suburb pages in a single PR (Unit 14), then a series of documentation-only commits for Units 15–18. Estimated effort: two to three working days, dominated by writing 14 unique suburb pages. Off-site units (GBP, GHL, citations, photos) are drafts that Giles or Rob execute outside this repo.

## Sources & References

- **Origin:** conversation audit in the 2026-04-13 session (no pre-existing brainstorm doc)
- **Global rules:** `~/.claude/CLAUDE.md` (versioning, shipping discipline, timezone, monitoring)
- **Repo:** `/Users/gilesparnell/Documents/VSStudio/client-sites/robs-gardens/`
- **Vercel project:** `prj_aYD18SSSV4zkgWAGEFTzygQy9Zvd` (team `team_oTXOZY867Aq6XqYk3FFwZMAu`)
- **WLC reference implementation:** `src/lib/version.js`, `vite.config.js`, `CHANGELOG.md`, `src/lib/parseChangelog.js`, `src/lib/annotateChangelogBlocks.js`, `src/pages/Changelog.jsx`
- **External docs:** llmstxt.org, schema.org/LocalBusiness, developers.google.com/identity/gsi, sitemaps.org, robotstxt.org
