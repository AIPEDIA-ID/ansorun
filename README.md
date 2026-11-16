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

## Struktur CSS (`src/styles/theme.css`)

File ini satu-satunya tempat tampilan diatur dan sudah diberi daftar isi di bagian atas:

| Bagian | Isi |
|---|---|
| 1. TOKENS | Warna, bentuk (`--t-radius-card`), ritme (`--t-section-y`, `--t-flush`, `--t-head-gap`). **Hanya di sini boleh ada warna mentah.** |
| 2. TURUNAN | Nilai yang dihitung dari token (`--t-wash`, `--t-shadow`, dst.). Jangan ditulis ulang |
| 3. TAILWIND | Token dibuka sebagai utility (`bg-primary`, `text-ink`, `font-heading`) |
| 4. BASE | html, body, tautan, judul |
| 5.1 sampai 5.9 | Komponen per kelompok: layout, latar, header, hero, tombol, kartu, blok konten, dekor, footer |

Aturan perawatan:
- **Kartu**: semua permukaan terang (`.card`, `.flow-tile`, `.info-card`, `details.faq`, `.photo-matte`) memakai satu aturan di 5.6. Ubah di sana, jangan menimpa per komponen.
- **Latar section terang** dipakai bergantian: `bg-fade`, `bg-pattern`, `bg-fade`, ... agar warna ujung bertemu.
- **Ritme vertikal** lewat token, bukan angka di markup: padding section `--t-section-y`, jarak judul `--t-head-gap`, jarak antar blok dalam section `mt-10`, grid kartu `gap-5`, dua kolom `gap-8`.
- Tambahkan komponen baru di kelompok yang sesuai, bukan di akhir file. Pakai token, bukan warna mentah. `npm run check` menolak warna mentah.

Penguraian teks markdown (rundown, konsep sosial, harga) ada di `src/lib/parse.ts`. Judul section memakai `SectionHeading.astro`, foto berbingkai memakai `MatteImage.astro`.

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

Otomatis: title/description per halaman (field **SEO: deskripsi** di Dato), canonical, Open Graph + Twitter card, JSON-LD `SportsEvent` di Beranda, `sitemap-index.xml`, `robots.txt`, ukuran gambar tetap (tanpa layout shift). **Isi `SITE_URL` dengan domain asli sebelum rilis**, kalau tidak canonical, sitemap, dan robots menunjuk ke localhost (`npm run check` memperingatkan bila masih kosong atau localhost). Ada halaman 404 (`src/pages/404.astro`), gaya fokus keyboard, dan dukungan `prefers-reduced-motion`.

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
src/styles/theme.css   tema terpusat (token + komponen, ada daftar isi di atas file)
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query + merge fallback, teks (rich/md), parse.ts (rundown, misi, harga), tipe
src/components/        Countdown, Gallery, Photo, MatteImage, SectionHeading, Icon, PageBanner, Prizes, RouteTabs, Steps, VideoEmbed, ContactList
src/layouts/Base.astro header transparan lalu kaca terang + footer
src/pages/             index (9 blok), racepack, galeri (tanpa nav); /tentang dan /lari di-redirect
scripts/               datocms-schema.mjs
```

## Belum ada
- Toggle bahasa ID/EN (semua teks Indonesia).
- Newsletter: sengaja tidak ada (tidak ada di struktur klien). Komponennya sudah dihapus; field `newsletter_action` di model Dato tidak dipakai.
- Carousel galeri (saat ini grid + lightbox).
