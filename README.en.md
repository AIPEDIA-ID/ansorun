# ANSORUN 2027 — Astro + DatoCMS + Tailwind

🇮🇩 [Bahasa Indonesia](README.md) · 🇬🇧 English

A static running-event website (ANSORUN 2027 Run to Ramadhan). The **page structure** follows the client brief: a 7-section home page (Hero + countdown, About, Event Highlights/video, Race Information, Prizes & Racepack, How to Join, FAQ & Contact), an About page, a Racepack page (collection info + 3 visual steps + race pack contents) and a Gallery. The **skin** is a flat ~2018 WordPress-theme look with solid colours, Montserrat + Open Sans, a dark teal + lime palette, and no glassmorphism. Gradients are used only for dark section and banner backgrounds (`--t-grad-*` tokens, following the client's slide backgrounds).

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

Creates 19 models: singletons (Site Settings, Home Page, About Page, Racepack Page) and ordered collections (Sponsor, Footer Link, Contact, Social Concept Step, Beneficiary, Race Fact, Rundown, Route, Prize, How-to-Join Step, FAQ, Racepack Detail/Step, Race Pack Item, Gallery Photo). It is idempotent: models that already exist are skipped. **Try it in a sandbox environment first.** This script has not yet been run against a real Dato project.

To make edited content go live: create a Dato webhook → Netlify / Vercel / Cloudflare build hook.

### Titles with emphasis
Title fields support `**bold**` and line breaks, e.g. `AYO` ⏎ `**BERLARI** Lebih Jauh`. In the hero the bold part is weight 800 and the rest is light; in section headings the bold part takes the accent colour. HTML is escaped.

### Promo video
Set **Highlights: YouTube link** on the Home Page. While empty, a "Promo video coming soon" placeholder is shown. The video loads only on click (youtube-nocookie) and the poster defaults to the YouTube thumbnail.

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
| New icons | `src/lib/icon-names.mjs` + the path in `src/components/Icon.astro` |

When you change `--t-accent`, check `--t-on-accent` too: a bright accent needs dark text on top, a dark accent needs white.

## Hidden pages

The About and Gallery pages are not in the client brief, so they are hidden: the files stay in `src/pages/`, but they are left out of the menu, footer and sitemap and carry `noindex`. To enable them again, remove their path from `HIDDEN_PATHS` in `src/lib/pages.mjs`.

## SEO

Automatic: per-page title and description (the **SEO: description** field in Dato), canonical URL, Open Graph + Twitter card, `SportsEvent` JSON-LD on the home page, `sitemap-index.xml`, `robots.txt`, and fixed image dimensions (no layout shift). **Set `SITE_URL` to the real domain before launch**; otherwise the canonical URLs, sitemap and robots.txt point to localhost.

## Quality gate

```bash
npm run check   # fails on any raw colour outside the tokens, then runs the build
```

## Sample content to replace before launch

The full asset list (sizes, source slides, Dato fields) is in [ASSETS.md](ASSETS.md) (Indonesian).

- **Photos:** sample photos from Unsplash (in `src/lib/fallback.ts`) appear whenever an image field in Dato is empty. Replace them with real photos.
- **Images from the client proposal** (`public/sample/`: route maps and the race pack flat-lay) are placeholders; ask for the original files.
- **Organizer contact numbers** in the fallback are placeholders; enter the real numbers in DatoCMS (Contact).
- **Sponsor logos:** the fictional brands in `public/dummy/` (Velocita, Aquanova, Kopi Lari) are placeholders. Delete the folder and remove `dummyLogo` from `src/lib/fallback.ts` when real sponsors are in place.

## Structure

```
src/styles/theme.css   centralised theme (tokens + skin)
src/config.ts          menu, locale, fonts, UI text
src/lib/               DatoCMS client, queries + fallback merge, text helpers (rich/md), types
src/components/        Countdown, VideoEmbed, Gallery, Newsletter, Tabs, RacepackViewer, PageBanner, Icon, Photo
src/layouts/Base.astro sticky/transparent header + footer
src/pages/             index, tentang, racepack, galeri
scripts/               datocms-schema.mjs, check.mjs
```

## Not implemented yet

- ID/EN language toggle (all site text is Indonesian).
- Mobile menu (hamburger); on narrow screens the menu currently wraps to a second row.
- Captcha on the newsletter form (currently a honeypot only). Without `newsletter_action` the form runs in demo mode. Set it to an endpoint that accepts a JSON POST (Formspree, Getform, Basin, etc.); Mailchimp needs a small intermediary endpoint because it does not allow `fetch` from the browser.
- Gallery carousel (currently a grid + lightbox).
