# Organic and Local SEO status — 2026-08-16

This file is the operational baseline for the August 2026 quality-consolidation release. It separates verified observations from targets and avoids treating IndexNow submission, a `site:` query, or a successful HTTP response as proof of indexing.

## Verified baseline before this release

- Production source: `main@5baed8adbf38aed7b83993b6bdb70991b19f06b6`.
- Sitemap: 210 indexable URLs, composed of 7 locales × 30 routes.
- Technical crawl: 210/210 returned HTTP 200, self-canonical, one H1, valid JSON-LD, and eight hreflang links including `x-default`.
- Quality audit: 112 of 870 EN/RU page pairs had three-word-shingle similarity of at least 0.70; area and delivery templates were the main clusters.
- GSC snapshot from 2026-08-14: 93 indexed, 279 not indexed, and 227 visible clicks. The screenshot did not establish a reliable reporting-period label, so 227 must not be reported as a 28-day value.
- The old sitemap last processed in GSC contained 357 URLs. The 210-URL sitemap was resubmitted on 2026-08-14.
- Yandex Webmaster was verified on 2026-08-14. Its sitemap and recrawl requests were still processing in the saved snapshot.
- Google Maps public listing on 2026-08-16: `LABS DISPENSARY`, category `Cannabis store`, phone `066 080 6784`, address `South Pattaya, 32 Pattaya 13 Alley, Pattaya City, Chon Buri 20150`, pin `12.9233467,100.8771557`, rating 4.8 with 104 reviews, and 132+ photos. Rating, review count, and hours are volatile and therefore are not duplicated on the website.
- One Google Maps listing was found. No Labs organisation card was found in targeted public Yandex Maps searches.
- Vercel Web Analytics is enabled. The website emits `contact_whatsapp_click` and `map_open_click`; WhatsApp links retain page/source tags in the message text.

## Release policy

- Keep 41 defensible index owners: all seven locales for home, contact, locations, the official-source legal guide, and the current Maps-name bridge; EN/RU only for near-me, Walking Street directions, and one Pattaya delivery-rules explainer.
- Keep the other generated pages reachable but mark them `noindex,follow`, remove them from the sitemap, omit hreflang, and omit JSON-LD. This is reversible while query-level GSC evidence is collected.
- Do not publish fixed stock, prices, COA, review totals, ratings, hours, delivery times, or legal eligibility claims without a current verifiable source and owner confirmation.
- Do not accept online orders or payments. The Thai government sources linked in the legal guide say online sales and advertising are prohibited under the current controlled-herb rules.
- Treat Google Maps as the live source for the public pin and directions. Use WhatsApp only for address and visit coordination.

## Weekly scorecard

Record the same Monday-to-Sunday window each week:

| Metric | Source | Breakdown |
| --- | --- | --- |
| Search impressions, clicks, CTR, average position | Google Search Console | query, page, country, device; brand vs non-brand; EN vs RU |
| Indexed and excluded URLs | GSC Page Indexing + submitted sitemap | reason and affected owner URL |
| Yandex impressions, clicks, positions | Yandex Webmaster | query and landing page |
| Maps profile views, discovery terms, calls, website clicks, directions | Google Business Profile | branded vs discovery where available |
| Maps and WhatsApp CTA clicks | Vercel Web Analytics | event, page, placement, source |
| Qualified WhatsApp conversations | Manual lead sheet | first-message source tag, language, directions/visit intent, qualified yes/no |
| Yandex Maps actions | Yandex Business after one verified card exists | views, routes, calls, website clicks |

Do not equate a CTA click with a lead. A qualified lead is a real first message that can be tied to a visit/directions intent and source tag.

## 2 / 4 / 8 week control plan

### Week 2

- Confirm production still exposes exactly 41 sitemap URLs and every excluded generated route returns `noindex,follow`.
- Inspect GSC/Yandex sitemap processing, canonical selections, crawl errors, and whether removed templates leave the index.
- Verify `map_open_click` and `contact_whatsapp_click` events plus source tags on actual WhatsApp first messages.
- Confirm the Google Business Profile website URL has `utm_source=gbp&utm_medium=organic-local&utm_campaign=gbp-website-button` and that root redirect preserves the parameters.
- Owner confirms real storefront name/signage, walk-in hours, service scope, and pin before any hours or service claims are added anywhere.

### Week 4

- Compare non-brand EN/RU impressions and clicks for the retained owners against the pre-release period.
- Review query overlap between home, contact, near-me, Walking Street, and legal guide. Merge or retitle only where the same queries still split across owners.
- Evaluate qualified WhatsApp conversations and Maps actions by landing page, not raw traffic alone.
- Create exactly one verified Yandex Business card if the owner has not already done so; do not create duplicates.
- Correct only relevant citations: Weed.TH, Ganja.com, and Cybo, using confirmed NAP and no promotional product claims.

### Week 8

- Repeat a fixed-location EN/RU query grid for core Pattaya, Walking Street, near-me, and legal intents; record position ranges, not personalised one-off ranks.
- Compare GSC/Yandex non-brand clicks, Maps directions, and qualified leads with the baseline and week 4.
- Restore an excluded URL only if it has distinct query demand, factual unique content, a clear intent owner, and measurable conversion value.
- Consider a single EN wholesale owner only after licenses, counterparties, actual offer, documentation, and query/lead demand are verified.
- Keep or tighten the 41-URL budget based on qualified leads and query ownership; do not re-expand page count as a success metric.

## Official sources used for the legal gate

- Thai Government, 2026-07-17: <https://www.thaigov.go.th/th/news/166528>
- Thailand tourist notice: <https://thailand.go.th/public/issue-focus-detail/cannabis-now-strictly-regulated-in-thailand--important-notice-for-tourists>
