# ANSORUN Run to Ramadan 2027 — Astro + DatoCMS + Tailwind

🇮🇩 [Bahasa Indonesia](README.md) · 🇬🇧 English

A static running-event website. The **page structure** follows digiland.co.id (transparent header over the hero, countdown, Instagram CTA, gallery, newsletter, dark footer; a 7-section Home, a `/racepack` page; `/galeri` still exists but is not in the nav). The **skin**: a flat ~2018 WordPress-theme look with solid colours, a teal + green + lime palette from the ANSORUN designs, the client fonts (Neospeed, Golf Italic, Osaca) plus Open Sans for paragraphs, and no gradients or glassmorphism. Full plan: `.docs/plan_implement_content.md`.

## Running locally

```bash
cp .env.example .env     # set DATOCMS_API_TOKEN (CDA, read-only)
npm install
npm run dev
```

Without a token the site still runs, using the sample content in `src/lib/fallback.ts`.

## Setting up DatoCMS

```bash
DATOCMS_CMA_TOKEN=... npm run dato:schema
```

Creates 10 models (Site Settings, Sponsor, Footer Link, About Page, FAQ, Run Page, Race Pack Item, Race Pack Step, Event Info Tab, Gallery Photo). It is idempotent: models that already exist are skipped. **Try it in a sandbox environment first.** This script has not yet been run against a real Dato project.

To make edited content go live: create a Dato webhook → Netlify / Vercel / Cloudflare build hook.

### Titles with emphasis
Title fields support `**bold**` and line breaks, e.g. `AYO` ⏎ `**BERLARI** Lebih Jauh`. In the hero the bold part is weight 800 and the rest is light; in section headings the bold part takes the accent colour. HTML is escaped.

### Logo
A single file. Over the hero the logo is turned white automatically (CSS filter) and shows its original colours after scrolling. Use a dark/solid logo so the filtered result is clean.

## Client feedback: where do I change things?

| Need | Where |
|---|---|
| Colours, container width, header height | `src/styles/theme.css`, TOKENS section (including `--t-on-dark` / `--t-surface` for white) |
| Fonts (link + font names) | `src/config.ts` → `fonts` |
| Primary/accent colour without a code deploy | DatoCMS → Site Settings |
| Component shapes (buttons, cards, hero, stripes) | `src/styles/theme.css`, SKIN section |
| Menu and static UI text | `src/config.ts` |
| Text, images, dates, FAQ, sponsors | DatoCMS |
| Section order and layout | `src/pages/*.astro` |

When you change `--t-accent`, check `--t-on-accent` too: a bright accent needs dark text on top, a dark accent needs white.

## SEO

Automatic: per-page title and description (the **SEO: description** field in Dato), canonical URL, Open Graph + Twitter card, `SportsEvent` JSON-LD on the home page, `sitemap-index.xml`, `robots.txt`, and fixed image dimensions (no layout shift). **Set `SITE_URL` to the real domain before launch**; otherwise the canonical URLs, sitemap and robots.txt point to localhost.

## Quality gate

```bash
npm run check   # fails on any raw colour outside the tokens, then runs the build
```

## Sample content to replace before launch

- **Photos:** sample photos from Unsplash (in `src/lib/fallback.ts`) appear whenever an image field in Dato is empty. Replace them with real photos.
- **Sponsors:** no official sponsors yet; the hero sponsor row stays hidden until `sponsors` in `src/lib/fallback.ts` (or DatoCMS) is filled. `public/dummy/` can be deleted.

## Structure

```
src/styles/theme.css   centralised theme (tokens + skin)
src/config.ts          menu, locale, fonts, UI text
src/lib/               DatoCMS client, queries + fallback merge, text helpers (rich/md), types
src/components/        Countdown, Gallery, Newsletter, Tabs, RacepackViewer, PageBanner, Icon, Photo
src/layouts/Base.astro sticky/transparent header + footer
src/pages/             index (7 sections), racepack, galeri (not in nav); /tentang and /lari redirect
scripts/               datocms-schema.mjs, check.mjs
```

## Not implemented yet

- ID/EN language toggle (all site text is Indonesian).
- Captcha on the newsletter form (currently a honeypot only). Without `newsletter_action` the form runs in demo mode. Set it to an endpoint that accepts a JSON POST (Formspree, Getform, Basin, etc.); Mailchimp needs a small intermediary endpoint because it does not allow `fetch` from the browser.
- Gallery carousel (currently a grid + lightbox).
