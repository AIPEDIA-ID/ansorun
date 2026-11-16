# ANSORUN 2027 — Astro + DatoCMS + Tailwind

🇮🇩 Bahasa Indonesia · 🇬🇧 [English](README.en.md)

Situs event lari statis (ANSORUN 2027 Run to Ramadhan). **Struktur halaman** mengikuti brief klien: Beranda 7 section (Hero + countdown, About, Event Highlights/video, Race Information, Prizes & Racepack, How to Join, FAQ & Contact), halaman Tentang, Racepack (info pengambilan + 3 langkah visual + isi race pack), dan Galeri. **Skin**: gaya tema WordPress ~2018, warna solid dan datar, Montserrat + Open Sans, palet teal gelap + lime, tanpa glass. Gradient hanya untuk latar section gelap dan banner (token `--t-grad-*`, mengikuti latar slide klien).

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

Membuat 19 model: singleton (Site Settings, Halaman Beranda, Halaman Tentang, Halaman Racepack) dan koleksi berurutan (Sponsor, Footer Link, Kontak Panitia, Langkah Konsep Sosial, Penerima Manfaat, Info Race, Rundown, Rute Lari, Hadiah, Langkah Cara Daftar, FAQ, Info/Langkah Pengambilan Racepack, Isi Race Pack, Foto Galeri). Idempotent: model yang sudah ada dilewati. **Coba dulu di sandbox environment.** Script ini belum dijalankan terhadap project Dato sungguhan.

Agar konten tampil setelah diedit: buat webhook Dato → build hook Netlify/Vercel/Cloudflare.

### Judul dengan penekanan
Field judul mendukung `**tebal**` dan baris baru, mis. `AYO` ⏎ `**BERLARI** Lebih Jauh`. Di hero, bagian tebal berat 800 dan sisanya tipis; di judul section, bagian tebal berwarna aksen. HTML di-escape.

### Video promo
Isi **Highlights: link video YouTube** di Halaman Beranda. Selama kosong, tampil placeholder "Video promo segera hadir". Video dimuat hanya saat diklik (youtube-nocookie), poster otomatis dari thumbnail YouTube.

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
| Ikon baru | `src/lib/icon-names.mjs` + path di `src/components/Icon.astro` |

## Halaman yang disembunyikan

Halaman Tentang dan Galeri tidak ada di brief klien, jadi disembunyikan: file tetap ada di `src/pages/`, tapi tidak muncul di menu, footer, sitemap, dan diberi `noindex`. Untuk mengaktifkan lagi, hapus path-nya dari `HIDDEN_PATHS` di `src/lib/pages.mjs`.

## SEO

Otomatis: title/description per halaman (field **SEO: deskripsi** di Dato), canonical, Open Graph + Twitter card, JSON-LD `SportsEvent` di Beranda, `sitemap-index.xml`, `robots.txt`, ukuran gambar tetap (tanpa layout shift). **Isi `SITE_URL` dengan domain asli sebelum rilis**, kalau tidak canonical, sitemap, dan robots menunjuk ke localhost.

## Pagar kualitas

```bash
npm run check   # gagal bila ada warna mentah di luar token, lalu build
```

Foto contoh dari Unsplash (di `src/lib/fallback.ts`) muncul bila field gambar Dato kosong; ganti dengan foto asli sebelum rilis.

## Isi contoh yang perlu diganti sebelum rilis

Daftar lengkap aset beserta ukuran, sumber slide, dan field Dato-nya ada di [ASSETS.md](ASSETS.md).

- **Foto:** foto contoh Unsplash (di `src/lib/fallback.ts`) muncul bila field gambar di Dato kosong. Ganti dengan foto asli.
- **Gambar dari proposal klien** (`public/sample/`: peta rute dan flat-lay race pack) adalah placeholder; minta file asli.
- **Nomor kontak panitia** di fallback masih placeholder; isi nomor asli di DatoCMS (Kontak Panitia).
- **Logo sponsor:** brand fiktif di `public/dummy/` (Velocita, Aquanova, Kopi Lari) hanyalah placeholder. Hapus folder itu dan buang `dummyLogo` dari `src/lib/fallback.ts` setelah sponsor asli terisi.

## Struktur

```
src/styles/theme.css   tema terpusat (token + skin)
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query + merge fallback, teks (rich/md), tipe
src/components/        Countdown, VideoEmbed, Gallery, Newsletter, Tabs, RacepackViewer, PageBanner, Icon, Photo
src/layouts/Base.astro header sticky/transparan + footer
src/pages/             index, tentang, racepack, galeri
scripts/               datocms-schema.mjs
```

## Belum ada
- Toggle bahasa ID/EN (semua teks Indonesia).
- Menu mobile (hamburger); saat ini menu membungkus ke baris kedua di layar sempit.
- Captcha di form newsletter (sekarang hanya honeypot). Tanpa `newsletter_action` form berjalan dalam mode contoh. Isi dengan endpoint yang menerima POST JSON (Formspree, Getform, Basin, dsb.); Mailchimp perlu endpoint perantara karena tidak mengizinkan fetch dari browser.
- Carousel galeri (saat ini grid + lightbox).
