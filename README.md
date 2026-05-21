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
npm run media        # transcode stock-photo → public/media (local ffmpeg)
npm run gen:seo      # generate content-cache via OpenAI (needs OPENAI_API_KEY)
npm run build        # static export to dist/
```

## Env

```bash
PUBLIC_SITE_URL=https://labscannabis.boutique
OPENAI_API_KEY=      # for npm run gen:seo
```

## Legacy

Previous Next.js site is in [`legacy/`](legacy/).

## Deploy

Vercel auto-detects Astro. Set `PUBLIC_SITE_URL` in project env. Media in `public/media/` is pre-rendered and committed — Vercel build runs `astro build` only.
