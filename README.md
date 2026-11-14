# Event Lari — Astro + DatoCMS + Tailwind

Situs event lari statis. Tampilan sengaja bergaya tema WordPress ~2018: header sticky, hero full-width, section berselang-seling, tombol solid datar, Montserrat + Open Sans.

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

Membuat 10 model (Site Settings, Sponsor, Footer Link, Halaman Tentang, FAQ, Halaman Lari, Isi Race Pack, Langkah Race Pack, Tab Informasi Event, Foto Galeri). Idempotent. **Coba dulu di sandbox environment.** Script ini belum dijalankan terhadap project Dato sungguhan.

Agar konten tampil setelah diedit: buat webhook Dato → build hook Netlify/Vercel/Cloudflare.

## Feedback klien: ubah di mana?

| Kebutuhan | File |
|---|---|
| Warna, font, lebar, radius | `src/styles/theme.css` bagian TOKENS |
| Warna utama/aksen tanpa deploy kode | DatoCMS → Site Settings → Warna utama / aksen |
| Bentuk komponen (tombol, kartu, header, hero) | `src/styles/theme.css` bagian SKIN |
| Menu & teks UI statis | `src/config.ts` |
| Teks, gambar, tanggal, FAQ, sponsor | DatoCMS |
| Struktur halaman | `src/pages/*.astro` |

Layout memakai utility Tailwind di markup; semua nilai visual bergantung pada token `--t-*`.

## Struktur

```
src/styles/theme.css   tema terpusat
src/config.ts          menu, locale, teks UI
src/lib/               datocms client, query+merge fallback, tipe
src/components/        Countdown, Tabs, Gallery, Sidebar, ...
src/pages/             index, tentang, lari, galeri
scripts/               datocms-schema.mjs
```
