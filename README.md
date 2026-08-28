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

`vercel.json` handles two things at once: the apex domain and the legacy URL set
left by the previous site.

The apex rule (`labscannabis.com` → `labscannabis.boutique`) preserves the path,
so a legacy path arriving on the apex takes **two hops**:
`labscannabis.com/catalog` → `labscannabis.boutique/catalog` (301) →
`/en/locations/` (301). This is deliberate, not an oversight. Duplicating every
legacy rule with an absolute `labscannabis.boutique` destination would double the
rule list and leave two copies to keep in sync, while Google follows redirect
chains up to five hops and passes signals through them. Inside a single host
there are no chains at all — that is the case that matters, and it is checked.

`vercel.json` is plain JSON and cannot carry a comment, which is why the decision
is recorded here.
