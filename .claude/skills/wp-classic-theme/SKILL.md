---
name: wp-classic-theme
description: Gaya web "tema WordPress ~2018" yang datar, solid, dan tidak terlihat seperti AI slop. Pakai saat membuat atau me-restyle website/landing page/event/company profile dengan nuansa klasik rapi (bukan 2000-an, bukan gradient ungu/glass), terutama bila klien butuh tema yang mudah diganti lewat token. Pemicu - "gaya wordpress", "oldschool tapi bersih", "jangan AI slop", "tema terpusat".
---

# WP Classic (~2018)

Rasa visual: tema premium WordPress/ThemeForest sekitar 2017-2019. Datar, solid, tegas, rapi. **Bukan** gaya 2000-an (tabel, bevel, gradient tombol) dan **bukan** gaya "AI default" (gradient ungu, glassmorphism, kartu melayang).

## Aturan keras (jangan dilanggar)
- Warna solid. Tidak ada gradient dekoratif (satu-satunya gradient: overlay gelap di atas foto hero dan mask untuk stripe).
- Tidak ada glassmorphism, `backdrop-blur`, glow, neon shadow, atau bayangan besar. Bayangan hanya tipis (header solid, lightbox).
- Tidak ada emoji sebagai ikon. Ikon = SVG stroke tunggal, ukuran konsisten.
- Tidak ada ungu/indigo sebagai warna default. Mulai dari biru, hijau, atau merah dari brand.
- Radius kecil (4px) untuk kartu/input gambar; **pill penuh hanya** untuk tombol, tab, input newsletter.
- Tidak ada animasi berlebihan: hanya transisi 0.2-0.25s untuk hover, header, dan accordion.
- Tidak ada ilustrasi/blob/shape acak. Dekorasi = stripe diagonal saja.

## Tipografi
- Heading: Montserrat (300 untuk headline besar, 700-800 untuk penekanan). Body: Open Sans 400/600.
- Headline hero besar dan tipis, bagian penting ditebalkan (`**tebal**` -> `<strong>`). Eyebrow kecil uppercase dengan letter-spacing lebar.
- Angka countdown: italic 800, sangat besar.
- Font hanya diatur di satu tempat (`config.ts` -> `fonts`), bukan tersebar.

## Struktur halaman (pola, urut)
1. Header fixed, transparan di atas hero, jadi putih solid setelah scroll (>40px). Logo di-filter putih saat transparan.
2. Hero full-height: foto + overlay gelap kiri, eyebrow, headline, subheadline, lokasi | tanggal, dua tombol (outline + utama), logo sponsor di kiri bawah, stripe di bawah.
3. Countdown 4 angka. 4. CTA sosial dengan foto latar. 5. Galeri di section gelap + lightbox. 6. Newsletter. 7. Footer gelap 4 kolom + garis 4px.
- Halaman dalam: banner dengan breadcrumb, judul dua baris (tebal + tipis), tagline kanan, stripe di bawah header (jangan menimpa menu).
- Ritme: section terang dan gelap bergantian. Kartu putih bergaris tipis di latar abu muda.

## Sistem tema (wajib)
Semua nilai visual lewat token CSS di satu file (`src/styles/theme.css`, blok `TOKENS`), lalu diekspos ke Tailwind (`@theme inline`). Token minimum:
`--t-primary`, `--t-accent`, `--t-highlight`, `--t-dark`, `--t-darker`, `--t-paper`, `--t-surface`, `--t-on-dark`, `--t-on-accent`, `--t-ink`, `--t-ink-soft`, `--t-line`, `--t-alt`, `--t-radius`, `--t-container`, `--t-header-h`.
- Warna turunan (hover, tint, kartu gelap, banner) dihitung dengan `color-mix`, bukan ditulis ulang.
- **Tidak boleh ada warna mentah** (hex/rgb/hsl) di luar blok token, termasuk putih (`#fff` -> `--t-on-dark` / `--t-surface`). Pasang skrip `check` yang gagal bila ada, lalu menjalankan build.
- Layout pakai utility Tailwind di markup; bentuk komponen (tombol, kartu, hero, stripe) di `@layer components` yang hanya memakai token.
- Warna utama/aksen boleh ditimpa dari CMS lewat `<style>:root{--t-primary:...}</style>`.

## Kontras (sering salah)
- Aksen terang (lime/neon) butuh teks gelap di atasnya; aksen gelap butuh teks putih -> atur `--t-on-accent` setiap ganti aksen.
- Warna aksen terang tidak boleh dipakai sebagai warna teks di latar putih. Teks penekanan di latar terang = `--t-primary-dark`; di latar gelap = aksen.
- Banner halaman dalam jangan sekontras warna primary penuh: pakai `--t-banner` (campuran primary + dark).
- Stripe/dekorasi tidak boleh menutupi navigasi.

## Konten & CMS
- Judul mendukung `**tebal**` + baris baru (escape HTML dulu). Konten contoh (fallback) tersedia agar situs jalan tanpa CMS dan tanpa gambar; foto contoh dari Unsplash dipakai hanya bila field gambar kosong.
- Teks UI statis dan menu di satu file config; konten di CMS.

## Checklist sebelum selesai
- [ ] Ganti 3 token warna -> seluruh situs ikut berubah, tidak ada yang tertinggal.
- [ ] `npm run check` lolos (tanpa warna mentah) dan build lolos.
- [ ] Cek teks terbaca di tiap kombinasi latar (terang, gelap, di atas foto, di atas aksen).
- [ ] Tidak ada gradient/glass/emoji/ungu default yang menyelinap.
- [ ] Header, hover, accordion, tab, lightbox dicoba di browser.
