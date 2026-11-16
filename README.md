# ANSORUN Run to Ramadan 2027 — Astro + DatoCMS + Tailwind

🇮🇩 Bahasa Indonesia · 🇬🇧 [English](README.en.md)

Situs event lari statis. **Struktur halaman** mengikuti digiland.co.id (header transparan di atas hero, countdown, CTA Instagram, galeri, newsletter, footer gelap; Beranda 7 section: Hero, About, Event Highlights, Race Information, Prizes & Racepack, How to Join, FAQ & Contact; halaman `/racepack`; `/galeri` tetap ada tapi tidak di nav). **Skin**-nya: gaya tema WordPress ~2018, warna solid dan datar, palet teal + hijau + lime dari desain ANSORUN, font klien (Neospeed, Golf Italic, Osaca) + Open Sans untuk paragraf, tanpa gradient/glass. Rencana lengkap: `.docs/plan_implement_content.md`.

## Menjalankan

```bash
cp .env.example .env     # isi DATOCMS_API_TOKEN (CDA, read-only)
npm install
npm run dev
```

Tanpa token, situs tetap jalan memakai konten contoh di `src/lib/fallback.ts`.

## Menyiapkan DatoCMS

```bash
DATOCMS_CMA_TOKEN=... npm run dato:schema
```

Membuat model (Site Settings, Sponsor, Footer Link, Halaman Tentang, FAQ, Halaman Beranda, Halaman Racepack, Isi Race Pack, Langkah, Tab Race Information, Foto Galeri). Idempotent: model yang sudah ada dilewati. **Coba dulu di sandbox environment.** Script ini belum dijalankan terhadap project Dato sungguhan.

Agar konten tampil setelah diedit: buat webhook Dato → build hook Netlify/Vercel/Cloudflare.

### Judul dengan penekanan
Field judul mendukung `**tebal**` dan baris baru, mis. `AYO` ⏎ `**BERLARI** Lebih Jauh`. Di hero, bagian tebal berat 800 dan sisanya tipis; di judul section, bagian tebal berwarna aksen. HTML di-escape.

### Logo
Satu file saja. Di atas hero logo otomatis dibuat putih (CSS filter), setelah scroll tampil warna asli. Pakai logo berwarna gelap/solid agar hasil filter bersih.

## Feedback klien: ubah di mana?

| Kebutuhan | File |
|---|---|
| Warna, lebar, tinggi header | `src/styles/theme.css` bagian TOKENS (termasuk `--t-on-dark` / `--t-surface` untuk putih) |
| Font (link + nama font) | `src/config.ts` → `fonts` |
| Warna utama/aksen tanpa deploy kode | DatoCMS → Site Settings |
| Bentuk komponen (tombol, kartu, hero, stripe) | `src/styles/theme.css` bagian SKIN |
| Menu & teks UI statis | `src/config.ts` |
| Teks, gambar, tanggal, FAQ, sponsor | DatoCMS |
| Susunan section | `src/pages/*.astro` |

## SEO

Otomatis: title/description per halaman (field **SEO: deskripsi** di Dato), canonical, Open Graph + Twitter card, JSON-LD `SportsEvent` di Beranda, `sitemap-index.xml`, `robots.txt`, ukuran gambar tetap (tanpa layout shift). **Isi `SITE_URL` dengan domain asli sebelum rilis**, kalau tidak canonical, sitemap, dan robots menunjuk ke localhost.

## Pagar kualitas

```bash
npm run check   # gagal bila ada warna mentah di luar token, lalu build
```

Foto contoh dari Unsplash (di `src/lib/fallback.ts`) muncul bila field gambar Dato kosong; ganti dengan foto asli sebelum rilis.

## Isi contoh yang perlu diganti sebelum rilis

- **Foto:** foto contoh Unsplash (di `src/lib/fallback.ts`) muncul bila field gambar di Dato kosong. Ganti dengan foto asli.
- **Sponsor:** belum ada sponsor resmi, bagian sponsor di hero tersembunyi sampai `sponsors` di `src/lib/fallback.ts` (atau DatoCMS) terisi. Folder `public/dummy/` boleh dihapus.

## Struktur

```
src/styles/theme.css   tema terpusat (token + skin)
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query + merge fallback, teks (rich/md), tipe
src/components/        Countdown, Gallery, Newsletter, Tabs, RacepackViewer, PageBanner, Icon, Photo
src/layouts/Base.astro header sticky/transparan + footer
src/pages/             index (7 section), racepack, galeri (tanpa nav); /tentang dan /lari di-redirect
scripts/               datocms-schema.mjs
```

## Belum ada
- Toggle bahasa ID/EN (semua teks Indonesia).
- Captcha di form newsletter (sekarang hanya honeypot). Tanpa `newsletter_action` form berjalan dalam mode contoh. Isi dengan endpoint yang menerima POST JSON (Formspree, Getform, Basin, dsb.); Mailchimp perlu endpoint perantara karena tidak mengizinkan fetch dari browser.
- Carousel galeri (saat ini grid + lightbox).
