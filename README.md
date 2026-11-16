# ANSORUN Run to Ramadan 2027 — Astro + DatoCMS + Tailwind

🇮🇩 Bahasa Indonesia · 🇬🇧 [English](README.en.md)

Situs event lari statis. **Struktur halaman** mengikuti `.docs/content_structure.md` dengan template referensi digiland.co.id (header transparan di atas hero lalu kaca terang setelah scroll, countdown, footer gelap). Beranda 9 blok: Hero, About, Event Highlights, Race Information, Rute, Prizes & Racepack, How to Join, FAQ, Contact; halaman `/racepack`; `/galeri` tetap ada tapi tidak di nav. Beberapa blok sengaja dipisah dari dokumen klien (lihat bagian 21 plan). **Skin**-nya: warna dari palet desain ANSORUN (teal, hijau jersey, lime), gradient lembut untuk latar, kartu bersudut 14px berbayangan tipis, tombol timbul, judul dengan font klien (Neospeed, Golf Italic, Osaca) dan paragraf dengan Carlito (padanan gratis Calibri, font isi di PDF proposal). Semua nilai visual tetap lewat token di `theme.css`. Rencana lengkap: `.docs/plan_implement_content.md`.

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

Membuat 15 model: Section 01 (Hero dan Pengaturan Situs), Sponsor, Footer Link, Section 02 (About Ansorun), Section 04 (Race Information, Kategori Lomba), Section 05 (Hadiah, Perlengkapan Racepack), Judul Section Beranda, Langkah (How to Join dan Racepack), Section 07 (FAQ, Kontak, Narahubung), Halaman 2 (Racepack), Foto Galeri. Idempotent: model yang sudah ada dilewati. **Coba dulu di sandbox environment.** Script ini belum dijalankan terhadap project Dato sungguhan.

Agar konten tampil setelah diedit: buat webhook Dato → build hook Netlify/Vercel/Cloudflare.

### Judul dengan penekanan
Field judul mendukung `**tebal**` dan baris baru, mis. `AYO` ⏎ `**BERLARI** Lebih Jauh`. Di hero, bagian tebal berat 800 dan sisanya tipis; di judul section, bagian tebal berwarna aksen. HTML di-escape.

### Logo
Dua file di `public/brand/`: `logo-light.webp` (putih/lime, untuk header transparan dan footer) dan `logo-dark.webp` (gelap). Header memakai logo terang di atas hero. Setelah scroll header menjadi kaca terang dan logo gelap tampil. Keduanya adalah titling asli klien (tidak dibuat ulang), lebar 640px.

### Konvensi konten
Konten contoh di `src/lib/fallback.ts` mengikuti teks PDF proposal. Yang belum ada dari klien berbentuk `[Konten menyusul: ...]` atau "Segera diumumkan". Penanda di kode: `TODO(data)` (menunggu klien) dan `CATATAN` (asumsi atau konflik antar halaman PDF). Daftar lengkap ada di bagian 8, 13, 19, 20, dan 21 plan.

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
- **Sponsor:** belum ada sponsor resmi, bagian sponsor di hero tersembunyi sampai `sponsors` di `src/lib/fallback.ts` (atau DatoCMS) terisi.
- **Video:** Event Highlights memakai ID YouTube dummy (`home.videoId`).
- **URL registrasi:** tombol "Daftar Sekarang" masih menuju `#` (`site.registrationUrl`).

## Struktur

```
src/styles/theme.css   tema terpusat (token + skin)
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query + merge fallback, teks (rich/md), tipe
src/components/        Countdown, Gallery, Photo, Icon, PageBanner, Prizes, RouteTabs, Steps, VideoEmbed, ContactList
src/layouts/Base.astro header transparan lalu kaca terang + footer
src/pages/             index (9 blok), racepack, galeri (tanpa nav); /tentang dan /lari di-redirect
scripts/               datocms-schema.mjs
```

## Belum ada
- Toggle bahasa ID/EN (semua teks Indonesia).
- Newsletter: sengaja tidak ada (tidak ada di struktur klien). Komponennya sudah dihapus; field `newsletter_action` di model Dato tidak dipakai.
- Carousel galeri (saat ini grid + lightbox).
