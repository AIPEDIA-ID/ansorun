# ANSORUN Run to Ramadan 2027 — Astro + DatoCMS + Tailwind

🇮🇩 [Bahasa Indonesia](README.md) · 🇬🇧 English

A static running-event website. The **page structure** follows `.docs/content_structure.md`, with digiland.co.id as the template reference (transparent header over the hero that turns into light glass after scrolling, countdown, dark footer). The Home has 9 blocks: Hero, About, Event Highlights, Race Information, Route, Prizes & Racepack, How to Join, FAQ, Contact; plus a `/racepack` page; `/galeri` still exists but is not in the nav. Some blocks are deliberately split from the client document (see section 21 of the plan). The **skin**: colours from the ANSORUN design palette (teal, jersey green, lime), soft gradient backgrounds, 14px cards with light shadows, raised buttons, headings in the client fonts (Neospeed, Golf Italic, Osaca) and paragraphs in Carlito (a free Calibri equivalent, the body font of the proposal PDF). Every visual value still goes through the tokens in `theme.css`. Full plan: `.docs/plan_implement_content.md`.

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

Creates 15 models: Section 01 (Hero and Site Settings), Sponsor, Footer Link, Section 02 (About Ansorun), Section 04 (Race Information, Race Categories), Section 05 (Prizes, Race Pack Items), Home Section Titles, Steps (How to Join and Racepack), Section 07 (FAQ, Contact, Contact People), Page 2 (Racepack), Gallery Photo. It is idempotent: models that already exist are skipped. **Try it in a sandbox environment first.** This script has not yet been run against a real Dato project.

To make edited content go live: create a Dato webhook → Netlify / Vercel / Cloudflare build hook.

### Titles with emphasis
Title fields support `**bold**` and line breaks, e.g. `AYO` ⏎ `**BERLARI** Lebih Jauh`. In the hero the bold part is weight 800 and the rest is light; in section headings the bold part takes the accent colour. HTML is escaped.

### Logo
Two files in `public/brand/`: `logo-light.webp` (white/lime, for the transparent header and the footer) and `logo-dark.webp` (dark). The header shows the light logo over the hero; after scrolling the header becomes light glass and the dark logo shows. Both are the client's original titling (not redrawn), 640px wide.

### Content conventions
Sample content in `src/lib/fallback.ts` follows the proposal PDF text. Anything still missing from the client is written as `[Konten menyusul: ...]` or "Segera diumumkan". Code markers: `TODO(data)` (waiting on the client) and `CATATAN` (an assumption or a conflict between PDF pages). The full lists are in sections 8, 13, 19, 20 and 21 of the plan.

## CSS structure (`src/styles/theme.css`)

This file is the only place where the look is defined, and it has a table of contents at the top:

| Section | Contents |
|---|---|
| 1. TOKENS | Colours, shapes (`--t-radius-card`), rhythm (`--t-section-y`, `--t-flush`, `--t-head-gap`). **The only place raw colours are allowed.** |
| 2. TURUNAN (derived) | Values computed from tokens (`--t-wash`, `--t-shadow`, ...). Do not rewrite them |
| 3. TAILWIND | Tokens exposed as utilities (`bg-primary`, `text-ink`, `font-heading`) |
| 4. BASE | html, body, links, headings |
| 5.1 to 5.9 | Components by group: layout, backgrounds, header, hero, buttons, cards, content blocks, decoration, footer |

Maintenance rules:
- **Cards**: every light surface (`.card`, `.flow-tile`, `.info-card`, `details.faq`, `.photo-matte`) shares one rule in 5.6. Change it there; do not override per component.
- **Light section backgrounds** alternate: `bg-fade`, `bg-pattern`, `bg-fade`, ... so the edge colours meet.
- **Vertical rhythm** comes from tokens, not numbers in markup: section padding `--t-section-y`, heading gap `--t-head-gap`, gap between blocks inside a section `mt-10`, card grids `gap-5`, two-column layouts `gap-8`.
- Add new components to the matching group, not at the end of the file. Use tokens, not raw colours. `npm run check` rejects raw colours.

Markdown parsing (rundown, social concept, prices) lives in `src/lib/parse.ts`. Section titles use `SectionHeading.astro` and framed photos use `MatteImage.astro`.

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

Automatic: per-page title and description (the **SEO: description** field in Dato), canonical URL, Open Graph + Twitter card, `SportsEvent` JSON-LD on the home page, `sitemap-index.xml`, `robots.txt`, and fixed image dimensions (no layout shift). **Set `SITE_URL` to the real domain before launch**; otherwise the canonical URLs, sitemap and robots.txt point to localhost (`npm run check` warns while it is empty or localhost). There is a 404 page (`src/pages/404.astro`), keyboard focus styles, and `prefers-reduced-motion` support.

## Quality gate

```bash
npm run check   # fails on any raw colour outside the tokens, then runs the build
```

## Sample content to replace before launch

- **Photos:** sample photos from Unsplash (in `src/lib/fallback.ts`) appear whenever an image field in Dato is empty. Replace them with real photos.
- **Sponsors:** no official sponsors yet; the hero sponsor row stays hidden until `sponsors` in `src/lib/fallback.ts` (or DatoCMS) is filled.
- **Video:** Event Highlights uses a dummy YouTube ID (`home.videoId`).
- **Registration URL:** the "Daftar Sekarang" button still points to `#` (`site.registrationUrl`).

## Structure

```
src/styles/theme.css   centralised theme (tokens + components, table of contents at the top)
src/config.ts          menu, locale, fonts, UI text
src/lib/               DatoCMS client, queries + fallback merge, text helpers (rich/md), parse.ts (rundown, mission, prices), types
src/components/        Countdown, Gallery, Photo, MatteImage, SectionHeading, Icon, PageBanner, Prizes, RouteTabs, Steps, VideoEmbed, ContactList
src/layouts/Base.astro transparent-to-glass header + footer
src/pages/             index (9 blocks), racepack, galeri (not in nav); /tentang and /lari redirect
scripts/               datocms-schema.mjs, check.mjs
```

## Not implemented yet

- ID/EN language toggle (all site text is Indonesian).
- Newsletter: deliberately absent (not in the client structure). The component was removed; the `newsletter_action` field in the Dato model is unused.
- Gallery carousel (currently a grid + lightbox).
