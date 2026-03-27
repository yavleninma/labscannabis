# Labs Cannabis — Website

Landing page for Labs Cannabis, a licensed medical cannabis dispensary in Pattaya, Thailand.

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **next-intl** for i18n (EN, RU, TH)
- Mobile-first, dark theme
- SEO-optimized (JSON-LD, sitemap, hreflang, Open Graph)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Set `NEXT_PUBLIC_SITE_URL` in Vercel environment variables
4. (Optional) add Sanity variables if CMS should be enabled:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
4. Vercel auto-detects Next.js and deploys

## Domain Recommendations

The domain has not been purchased yet. Recommendations:

| Priority | Domain | Notes |
|----------|--------|-------|
| 1st | `labscannabis.com` | Best match, brand name |
| 2nd | `labscannabis.co` | Short alternative |
| 3rd | `labs-cannabis.com` | With hyphen |
| 4th | `labsdispensary.com` | Alternative branding |

**Recommended registrars:** Cloudflare Registrar (cheapest renewals, free DNS) or Namecheap.

Site URL is centralized via `NEXT_PUBLIC_SITE_URL` (`src/lib/site-url.ts`).

## TODOs

Search for `TODO` in the codebase to find all placeholders:

```bash
rg "TODO" src
```

Key items to fill in:
- LINE / WhatsApp / Telegram links (`src/lib/mock-data.ts` or Sanity shop settings)
- Exact working hours (`src/lib/mock-data.ts`, `src/components/JsonLd.tsx`)
- Logo image (`src/components/Hero.tsx`)
- OG image (`src/app/[locale]/layout.tsx`)
- Phone number (`src/components/JsonLd.tsx`)

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx    # Root layout with metadata & hreflang
│   │   └── page.tsx      # Home page
│   │   └── strains/[slug]/page.tsx
│   ├── globals.css       # Tailwind + theme
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Header.tsx        # Fixed header with locale switcher
│   ├── Hero.tsx          # Hero section
│   ├── NoPrescription.tsx
│   ├── StrainCatalog.tsx
│   ├── StaffPick.tsx
│   ├── Reviews.tsx
│   ├── LocationSection.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx        # Disclaimer + copyright
│   └── JsonLd.tsx        # Structured data
├── lib/
│   ├── queries.ts
│   ├── mock-data.ts
│   └── site-url.ts
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── navigation.ts
└── proxy.ts              # Locale routing
messages/
├── en.json
├── ru.json
└── th.json
```
