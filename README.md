# Event Lari — Astro + DatoCMS + Tailwind

Situs event lari statis. **Struktur halaman** mengikuti digiland.co.id (header transparan di atas hero, countdown, CTA Instagram, galeri, newsletter, footer gelap; halaman Tentang/FAQ, Lari/Race Pack, Galeri). **Skin**-nya sengaja beda: gaya tema WordPress ~2018, warna solid dan datar, Montserrat + Open Sans, tanpa gradient/glass.

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

Membuat 10 model (Site Settings, Sponsor, Footer Link, Halaman Tentang, FAQ, Halaman Lari, Isi Race Pack, Langkah Race Pack, Tab Informasi Event, Foto Galeri). Idempotent: model yang sudah ada dilewati. **Coba dulu di sandbox environment.** Script ini belum dijalankan terhadap project Dato sungguhan.

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

## Struktur

```
src/styles/theme.css   tema terpusat (token + skin)
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query + merge fallback, teks (rich/md), tipe
src/components/        Countdown, Gallery, Newsletter, Tabs, RacepackViewer, PageBanner, Icon, Photo
src/layouts/Base.astro header sticky/transparan + footer
src/pages/             index, tentang, lari, galeri
scripts/               datocms-schema.mjs
```

## Belum ada
- Toggle bahasa ID/EN (semua teks Indonesia).
- Captcha di form newsletter (form nonaktif sampai `newsletter_action` diisi).
- Carousel galeri (saat ini grid + lightbox).
