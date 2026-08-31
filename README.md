# Labs Cannabis v2 — Reels + Programmatic SEO

Static Astro site for **labscannabis.boutique**. Instagram Reels-style landing, weight-tier pricing, 7 locales, ~250 SEO pages.

## Stack

- Astro 5 (static) + React island (Reels)
- Tailwind CSS v4
- `@astrojs/sitemap` with hreflang

## Locales

`en` · `ru` · `th` · `ar` · `zh` · `ko` · `ja`

## Commands

```bash
npm install
npm run dev          # http://localhost:4321
npm run media        # transcode stock-photo → media-source/ (local ffmpeg, not published)
npm run gen:seo-fallback  # unique per-page copy for all locales (no API key)
npm run gen:seo      # optional: richer copy via OpenAI (needs OPENAI_API_KEY)
npm run build        # runs gen:seo-fallback, then static export to dist/
```

## Env

```bash
PUBLIC_SITE_URL=https://labscannabis.boutique
OPENAI_API_KEY=      # for npm run gen:seo
```

## Legacy

Previous Next.js site is in [`legacy/`](legacy/).

## Deploy

Vercel auto-detects Astro. Set `PUBLIC_SITE_URL` in project env. Product photos live in `media-source/` outside `public/`, so they are never published — Vercel build runs `astro build` only.

## Redirects

`vercel.json` handles the legacy URL set left by the previous site, all of it on
`labscannabis.boutique`. There are no redirect chains inside the host, and that
is checked by `scripts/check-seo.mjs`.

**There is no apex rule any more, and there should not be one.** Two rules used
to match `host = labscannabis.com` and forward it here, and this file used to
explain the two-hop path they produced. They never ran. `labscannabis.com` is
not ours and never was: it resolves to a Wix site behind Cloudflare and answers
404 to everything, measured on 2026-08-31. A rule matching a host that will
never reach this project is not a safety net — it is a claim in the codebase
that the domain is ours, which is how it survived several audits unquestioned.

If the domain is ever bought, the rules come back in the same commit that points
its DNS here, and not before.

`vercel.json` is plain JSON and cannot carry a comment, which is why the decision
is recorded here.
