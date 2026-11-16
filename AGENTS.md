## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project: ANSORUN 2027 — Run to Ramadhan

Situs event lari statis (Astro + Tailwind v4 + DatoCMS, konten contoh di `src/lib/fallback.ts`). Dokumentasi lengkap ada di `README.md` (ID) / `README.en.md` (EN); daftar aset yang masih kurang ada di `ASSETS.md`.

- **Tema terpusat** di `src/styles/theme.css` (blok TOKENS). Dilarang menulis warna mentah di luar token; `npm run check` akan gagal.
- **Brief klien** ada di `.docs/text_content.md` (Beranda 7 section + halaman Racepack) dan `.docs/PROPOSAL ANSOR RUN rev 1 .pdf` (27 slide: gaya & konten). Halaman Tentang/Galeri disembunyikan lewat `src/lib/pages.mjs`.
- Setelah mengubah kode: `npm run check` (cek warna + build). Foto contoh Unsplash dan `public/sample/`, `public/dummy/` hanyalah placeholder.

## Asset bank (`.docs/assets_bank/`)

Sumber desain asli dari klien (±89 MB). **Jangan diimpor langsung ke situs** (terlalu besar, sebagian format cetak). Aset web diekspor ke `public/` lewat `python3 scripts/export-assets.py` (butuh Pillow; idempotent). Kalau aset sumber diganti, jalankan ulang skrip itu.

| Folder / file | Isi | Ukuran | Status & pemakaian |
|---|---|---|---|
| `KV DSGN/TITLING DSGN - ANSORUN 2026.-APPROVED.png` | Logo/lettering lengkap (ANSORUN + tagline + Run to Ramadan 2027), gradient lime→putih, transparan | 4805×1322 | **APPROVED.** Dipakai sebagai logo untuk latar gelap → `public/brand/logo-on-dark.webp` (header transparan, footer). Sumber favicon (huruf A) |
| `KV DSGN/TITLING- BLCK DSGN - ANSORUN 2026.-APPROVED.png` | Logo versi hitam solid, transparan | 4806×1322 | **APPROVED.** Logo untuk latar terang → `public/brand/logo-on-light.webp` (header putih saat scroll) |
| `KV DSGN/KV DSGN - ANSORUN 2026.-APPROVED.png` | Key visual: 5 pelari, Monas & skyline, judul, tanggal, QR pendaftaran | 5217×2936, 17 MB, tanpa transparansi | **APPROVED.** Hero Beranda → `public/brand/kv.webp` (2400 px) dan `kv-og.jpg` (1200 px, og:image). Teks (judul, tagline, tanggal, QR) sudah menyatu di gambar |
| `KV DSGN/KV DSGN - ANSORUN 2026.-APPROVED.pdf` | KV versi vektor/cetak | – | Tidak dipakai. Sumber bila perlu ukuran poster |
| `KV DSGN/KV DSGN - ANSORUN 2026.-APPROVED.cdr` | File sumber CorelDRAW (22 MB) | – | Tidak bisa dibaca dari sini. Buka di CorelDRAW untuk ekspor ulang (mis. KV tanpa teks) |
| `JERSEY/Teal and Lime Running Jersey Mockups.png` | Mockup jersey depan+belakang, **Alt 1** (aksen lime diagonal) | 1774×887, latar putih | Dipakai di item "Kaos Lari" (latar putih dihapus) → `public/sample/race/jersey.webp` |
| `JERSEY/Teal Neon Diagonal Sports Jersey Mockup.png` | Mockup jersey **Alt 2** (motif halftone) | 1774×887, latar putih | Alternatif, belum dipakai. Klien belum memilih final |
| `JERSEY/Jersey Ansorun 2027.pdf` | Desain jersey untuk produksi | – | Tidak dipakai |
| `TAS SERUT/ANSORUN Ramadan 2027 Drawstring Bag alt 1.png` | Mockup tas serut **Alt 1** | 1149×1369, latar putih | Dipakai di item "Tas Serut" → `public/sample/race/tas-serut.webp` |
| `TAS SERUT/ANSORUN Ramadan 2027 Drawstring Bag Alt 2.png` | Mockup tas serut **Alt 2** | 1149×1369, latar putih | Alternatif, belum dipakai |
| `TAS SERUT/Tas Serut 30x40cm.pdf` | Desain produksi tas 30×40 cm | – | Tidak dipakai |
| `NOMOR DADA/Nomor Dada Alt 1.png`, `Alt 2.png` | Desain BIB (nomor "0011", kategori 5K), 2 alternatif | 2482×1772, transparan | Belum dipakai: belum ada slot di situs (brief tidak menyebut BIB). Bisa jadi item race pack bila klien mau |
| `NOMOR DADA/Nomor Dada 15x21 cm.pdf` | Desain produksi BIB 15×21 cm | – | Tidak dipakai |
| `MEDALI/Medali Alt 1.png`, `Medali Alt 2.png` | Medali + pita, 2 alternatif | 2028×1300, transparan | Belum dipakai: brief tidak menyebut medali |
| `MEDALI/Alternatif Medali Ansorun 2027.pdf` | Desain produksi medali | – | Tidak dipakai |
| `FONTS/Osaca-MediumItalic.zip`, `Golf-Italic.zip`, `neospeed-futuristic-font-….zip` | Font brand dari desain KV/logo | – | **Tidak dipakai di situs** (judul sudah berupa gambar; situs memakai Montserrat + Open Sans). Cek lisensi web-embed sebelum dipakai (Neospeed berasal dari marketplace berlisensi). Jangan menaruh file font di `public/` tanpa izin |

### Catatan penting
- Nama file memakai "2026" tetapi event adalah **2027**. Di dalam KV, nomor dada pelari bertuliskan "ANSORUN 2026" (kemungkinan salah ketik di desain, tanyakan ke klien).
- Semua desain produk (jersey, tas, BIB, medali) masih **"Alt 1 / Alt 2"**: belum ada keputusan final. Pasang yang final saja setelah klien memilih.
- Dua versi logo dipasang lewat dua field Dato (`logo` untuk latar gelap, `logoOnLight` untuk latar terang). Bila hanya `logo` diisi, CSS filter dipakai seperti sebelumnya.
- Hero memakai layout KV bila field `heroKv` ada; bila kosong, kembali ke hero teks di atas foto (`heroImage`).
- Folder ini berat dan berisi file biner (.cdr 22 MB). Pertimbangkan Git LFS atau jangan di-commit.
