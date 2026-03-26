# Labs Cannabis — Website

Landing page for Labs Cannabis, a licensed medical cannabis dispensary in South Pattaya, Thailand.

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
3. No environment variables needed — deploy as-is
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

After purchasing, update the `baseUrl` in these files (search for `labscannabis.com`):
- `src/app/[locale]/layout.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/JsonLd.tsx`

## TODOs

Search for `TODO` in the codebase to find all placeholders:

```bash
grep -r "TODO" src/ --include="*.tsx" --include="*.ts"
```

Key items to fill in:
- LINE / WhatsApp / Telegram links (`src/components/Contact.tsx`)
- Exact working hours (`src/components/Location.tsx`, `src/components/JsonLd.tsx`)
- Logo image (`src/components/Hero.tsx`)
- OG image (`src/app/[locale]/layout.tsx`)
- Phone number (`src/components/JsonLd.tsx`)
- Domain URL (multiple files)

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx    # Root layout with metadata & hreflang
│   │   └── page.tsx      # Home page
│   ├── globals.css       # Tailwind + theme
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Navbar.tsx        # Fixed nav with language switcher
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section with feature cards
│   ├── HowItWorks.tsx    # 4-step process
│   ├── Location.tsx      # Google Maps embed + info
│   ├── Contact.tsx       # Messenger buttons
│   ├── Footer.tsx        # Disclaimer + copyright
│   └── JsonLd.tsx        # Structured data
├── i18n/
│   ├── request.ts
│   ├── routing.ts
│   └── navigation.ts
└── middleware.ts         # Locale routing
messages/
├── en.json
├── ru.json
└── th.json
```
