# Plan: Implementasi Konten ANSORUN Run to Ramadan 2027

Status: **rencana, belum ada kode yang diubah.**
Sumber: `content_structure.md`, `assets_bank/`, referensi struktur https://digiland.co.id/run, pedoman `.claude/skills/wp-classic-theme/SKILL.md`.

Prinsip utama: **perubahan sesedikit mungkin.** Sistem tema (token di `src/styles/theme.css`, font di `src/config.ts`, konten di `fallback.ts` + DatoCMS) sudah terpusat. Pekerjaan ini terutama *ganti isi token + ganti konten + susun ulang section*, bukan menulis ulang komponen.

---

## 1. Analisa `content_structure.md`

### Halaman 1: Landing Page (Home), 7 section

| # | Section | Isi | Pemetaan ke kode yang ada |
|---|---|---|---|
| 01 | Home / Hero | KV, headline, countdown, CTA | `index.astro` (hero) + `Countdown.astro`. Sudah ada. |
| 02 | About Ansorun | Event dan misi sosial | Isi dari `tentang.astro` (blok "Tentang"), dipindah ke Home. |
| 03 | Event Highlights | Video promo | **Baru**: embed video (komponen kecil). |
| 04 | Race Information | Kategori, jadwal, lokasi, rute | Pakai `Tabs.astro` (sudah dipakai di `lari.astro` untuk Event Information). |
| 05 | Prizes & Racepack | Hadiah dan perlengkapan peserta | Pakai `RacepackViewer.astro` (item: jersey, medali, BIB, tas serut). |
| 06 | How to Join | Pendaftaran dan race pack collection | **Baru** tapi sederhana: daftar langkah (komponen `Steps`, dipakai ulang di halaman 2). |
| 07 | FAQ & Contact | Info tambahan dan kontak | Blok FAQ `<details class="faq">` dari `tentang.astro` + tombol kontak. |

### Halaman 2: Racepack (`/racepack`)

- Hero image + judul **Racepack Collection**, tagline **GET YOUR RACEPACK. GET READY TO RUN.**
- Konten: tanggal, jam operasional, lokasi, dokumen yang dibawa, mekanisme diwakilkan, kontak panitia.
- **Tiga langkah visual**: (1) Show your registration confirmation, (2) Verify your participant identity, (3) Collect your racepack.
- Template mirip `digiland.co.id/run`.

### Hasil membaca referensi digiland.co.id/run

Halaman "Lari" mereka berurutan: banner + breadcrumb, judul "Racepack Collection", lokasi + tanggal + jam, item racepack (ikon + preview), cara pengambilan (langkah bernomor), catatan perwakilan + unduh surat kuasa, CTA komunitas (Instagram), tab Event Information (S&K, FAQ, hadiah, rute, panduan, do's and don'ts), footer. Ini **sama persis** dengan `lari.astro` yang sudah ada. Jadi halaman Racepack = `lari.astro` yang diganti nama dan dipangkas, dengan langkah dari 5 menjadi 3.

> Catatan: `WebFetch` gagal mengambil situs ini (error sertifikat), jadi saya membacanya lewat browser pane.

### Perbedaan struktur lama vs baru

- Lama: Beranda, Tentang, Lari, Galeri. Baru: **Home (7 section), Racepack**.
- Konsekuensi: `/tentang` dilebur ke Home (section 02 dan 07). `/lari` menjadi `/racepack`. `/galeri` tidak ada di struktur baru.

---

## 2. Isi `assets_bank/`

| Folder | Isi | Dipakai untuk web? |
|---|---|---|
| `KV DSGN/` | KV 16:9 (PNG 5217x2936, **17 MB**, perlu dikompres), PDF dan CDR sumber, 2 versi **titling** transparan (`TITLING DSGN` = lime/putih untuk latar gelap, `TITLING- BLCK DSGN` = hitam untuk latar terang) | **Ya.** KV = hero + OG image. Titling = logo. PDF/CDR tidak. |
| `JERSEY/` | 2 mockup jersey depan/belakang (PNG 1774x887) + PDF desain | Ya: preview item Jersey. Pilih 1 dari 2 alternatif (perlu keputusan klien). |
| `MEDALI/` | Medali + pita, Alt 1 dan Alt 2 (PNG 2028x1300) + PDF | Ya: preview Medali. |
| `NOMOR DADA/` | BIB 15x21 cm, Alt 1 dan Alt 2 (nomor 0011, label 5K) + PDF | Ya: preview BIB. |
| `TAS SERUT/` | Drawstring bag 30x40 cm, Alt 1 dan Alt 2 (PNG 1149x1369) + PDF | Ya: preview Tas. |
| `FONTS/` | **Neospeed** (Regular + Oblique, .otf), **Golf Italic** (otf/ttf/woff/woff2), **Osaca Medium Italic** (ttf) | Ya, lihat bagian 4. |

Yang terbaca dari KV: tagline *"Tiap ayunan kaki, hadirkan jalan berbagi"*, judul **ANSORUN**, sub **RUN TO RAMADAN 2027**, tanggal **31/01/27**, kategori **5K - 10K**, QR "Online Registration", latar Jakarta (Monas) dengan 5 pelari berjersey hijau.

**Temuan yang perlu dikonfirmasi:**
1. Nama file KV tertulis "ANSORUN **2026**", tetapi isinya 2027 (judul, medali, jersey, BIB). Saya ikuti **2027**.
2. Kategori hanya **5K dan 10K** (bukan HM seperti template digiland), dan di BIB terlihat label **5K**.
3. Tiap item (jersey, medali, BIB, tas) punya 2 alternatif desain. Mockup "Alt" masih opsi, belum final. Default rencana: pakai Alt 1, mudah ditukar karena gambar ada di CMS/fallback.
4. QR di KV mengarah ke link registrasi yang belum saya tahu. Dibutuhkan URL pendaftaran asli.

---

## 3. Tema: palet hijau dari desain

Warna diambil dari sampel piksel KV, jersey, BIB, dan medali (bukan menebak):

| Peran | Sumber | Nilai |
|---|---|---|
| Teal gelap (latar jersey/KV) | jersey | `#01373d` |
| Teal BIB / pita medali | BIB, medali | `#114f58` |
| Hijau tengah | jersey, medali | `#027757` |
| Hijau terang | KV, medali | `#2c9669` |
| **Lime neon** (titling "ANSORUN") | titling PNG | `#dfff40` |
| Lime sekunder | jersey | `#bce930` |

Pemetaan ke token (hanya edit blok `TOKENS` di `theme.css`):

```css
--t-primary:   #027757;  /* tombol sekunder, angka countdown, judul penekanan di latar terang */
--t-accent:    #dfff40;  /* tombol utama, stripe, nomor (lime ala titling) */
--t-highlight: #bce930;  /* label kecil dan breadcrumb di latar gelap */
--t-on-accent: #01373d;  /* WAJIB gelap: teks di atas lime */
--t-dark:      #01373d;  /* section gelap */
--t-darker:    #012a2f;  /* footer (turunan lebih gelap) */
--t-alt:       #f0f6f4;  /* abu-hijau sangat muda */
--t-ink:       #1f3a3d;
--t-ink-soft:  #587074;
--t-line:      #dce6e4;
--t-dark-ink:  #9fc0bd;
```

Aturan kontras dari SKILL yang berlaku di sini:
- Lime **tidak boleh jadi warna teks di latar putih**. Di latar terang, penekanan = `--t-primary-dark`; di latar gelap = lime. Aturan `.rich-accent` yang ada sudah menangani ini.
- `--t-on-accent` harus gelap (tombol lime dengan teks putih tidak terbaca).
- Banner halaman dalam memakai `--t-banner` (campuran primary + dark), tetap jalan otomatis.
- Dua `hex` di `fallback.ts`/CMS (`primaryColor`, `accentColor`) dikosongkan agar tidak menimpa token.
- Gradient tetap dilarang. Gradient di KV adalah bagian foto, bukan CSS. `.footer-rule` dan stripe yang sekarang pakai `linear-gradient` hanya memakai token, jadi ikut berubah warna otomatis.

---

## 4. Font

Saat ini: Montserrat (heading) + Open Sans (body) dari Google Fonts, diatur di `config.ts → fonts`.

Rencana (minimal):
- **Tetap** Open Sans untuk body dan Montserrat untuk heading, supaya teks panjang terbaca.
- **Tambah satu token `--t-font-display`** (Neospeed) untuk hal yang "bermerek": eyebrow, angka countdown, label kategori (5K/10K). Neospeed adalah font futuristik miring, cocok dengan karakter "RUN TO RAMADAN" dan sulit dibaca untuk paragraf.
- Golf Italic dan Osaca Medium Italic: **dipakai semua, mengikuti klien.** Tiap font dapat satu token peran di `config.ts`/`theme.css`: `--t-font-display` (Neospeed: judul bermerek, angka countdown), `--t-font-accent` (Golf Italic) dan `--t-font-tag` (Osaca Medium Italic: tagline dan label). **Pemetaan terkonfirmasi di Langkah 1** (sampel font dirender dan dicocokkan dengan KV): Golf Italic = huruf berlajur lintasan di judul ANSORUN dan angka 2027 (hanya untuk ukuran besar); Osaca Medium Italic = tagline "Tiap ayunan kaki..." dan "Run to Ramadan"; Neospeed = "RUN TO RAMADAN", tanggal, dan kategori di KV. Rencana turunannya: Neospeed untuk heading dan label, Osaca untuk tagline/eyebrow, Golf Italic untuk angka countdown dan judul hero halaman dalam. Open Sans tetap untuk paragraf. Karena hanya token, bila klien mau menukar peran cukup ubah satu baris.
- File font disalin ke `public/fonts/` (woff2 bila ada; Neospeed otf dikonversi ke woff2). `config.ts → fonts` mendapat daftar `faces` untuk `@font-face`, tetap satu tempat konfigurasi.
- Cek lisensi font (Neospeed diunduh dari marketplace "futuristic font 2026-11-06"): pastikan lisensi mengizinkan web embedding.

---

## 5. Rencana implementasi (berurutan)

### Langkah 1. Aset dan font
- Buat `public/brand/` berisi versi web:
  - `kv.webp` (hero, lebar 2400, target < 400 KB) dan `og.jpg` (1200x630) dari KV 17 MB.
  - `logo-light.png`/`.webp` (titling lime/putih, untuk header transparan dan footer) dan `logo-dark.png` (titling hitam, untuk header solid).
  - `jersey.webp`, `medali.webp`, `bib.webp`, `tas.webp` (dari Alt 1, lebar ~1200).
  - Favicon baru dari bentuk huruf "A" titling.
- Konversi dengan `sips`/`sharp` (satu skrip kecil, tidak ditambah ke dependency produksi bila bisa).
- Salin dan konversi font ke `public/fonts/`.
- Folder `.docs/assets_bank` tetap sebagai sumber, tidak di-serve.

### Langkah 2. Tema (token saja)
- Ubah blok `TOKENS` di `theme.css` sesuai bagian 3, tambah `--t-font-display`.
- `config.ts`: tambah `faces` font. Ubah `nav` menjadi: Beranda (`/`), Racepack (`/racepack`), plus anchor Home (`/#tentang`, `/#info`, `/#faq`) bila diinginkan.
- Hasil yang diharapkan: seluruh situs sudah berwarna teal/lime **tanpa menyentuh markup**. Verifikasi di sini sebelum lanjut.

### Langkah 3. Header/logo (perubahan markup kecil)
- `Base.astro`: header memakai 2 logo (terang saat transparan, gelap saat solid) menggantikan trik `filter: invert`. Atau cukup dua `<img>` yang di-toggle lewat class `.is-solid`.
- Logo titling lebarnya sangat panjang (rasio ~3.6:1, mengandung tagline dan 2027). Untuk header, **dicrop hanya kata ANSORUN** agar terbaca di tinggi ~44px. Versi penuh dipakai di footer atau hero.

### Langkah 4. Home (`index.astro`), 7 section
Urutan baru, memakai ulang komponen yang ada:
1. **Hero**: background = `kv.webp`. KV sudah memuat judul, tanggal, kategori, dan QR, jadi **tidak ditimpa teks besar lagi**. Yang ditambah hanya `<h1>` tersembunyi untuk SEO, tombol CTA di bawah, dan countdown. Overlay gelap kiri dikurangi. Sponsor di kiri bawah dipertahankan bila ada, kalau tidak disembunyikan otomatis.
2. **Countdown** (komponen yang ada, target `2027-01-31`).
3. **About Ansorun**: layout dua kolom dari `tentang.astro` (judul besar + kutipan tagline + isi misi sosial).
4. **Event Highlights**: komponen baru `VideoEmbed.astro` (thumbnail klik lalu iframe, tanpa autoplay, ~20 baris). Bila URL video kosong, section memakai KV sebagai poster dan tulisan "Segera Hadir" (sudah ada `ui.comingSoon`).
5. **Race Information**: `Tabs.astro` dengan 4 tab: Kategori (5K, 10K), Jadwal, Lokasi, Rute.
6. **Prizes & Racepack**: `RacepackViewer.astro` dengan 4 item (Jersey, Finisher Medal, BIB, Tas Serut) dan gambar dari aset. Hadiah kategori ditambahkan sebagai teks di panel kiri.
7. **How to Join**: `Steps` (pendaftaran lalu race pack collection) + tombol "Daftar Sekarang" + tautan ke `/racepack`.
8. **FAQ & Contact**: `<details class="faq">` + tombol kontak (sudah ada di `tentang.astro`).
9. Newsletter (komponen yang ada) tetap di bawah sebelum footer.

Blok CTA Instagram dan galeri **dilepas dari Home** karena tidak ada di struktur baru. Kodenya tidak dihapus: `/galeri` tetap ada tetapi tidak muncul di nav (keputusan di bagian 7). Video di section 4 memakai dummy embed YouTube.

### Langkah 5. Halaman Racepack (`/racepack`)
- Ganti nama `lari.astro` jadi `racepack.astro`. `PageBanner` dengan `crumb="Racepack"`, judul **Racepack Collection**, tagline **GET YOUR RACEPACK. GET READY TO RUN.**
- Blok info: tanggal, jam operasional, lokasi, dokumen yang dibawa, kontak panitia (grid kartu `card` dengan `Icon`).
- Tiga langkah visual: komponen `Steps.astro` bernomor besar + ikon + gambar, dengan teks:
  1. *Show your registration confirmation.*
  2. *Verify your participant identity.*
  3. *Collect your racepack.*
- Catatan perwakilan (surat kuasa) memakai kartu "Penting" yang sudah ada.
- Hapus blok komunitas dan tab Event Information (tidak diminta di struktur baru).
- `Steps.astro` dipakai juga di Home bagian How to Join, jadi tidak ada duplikasi.

### Langkah 6. Konten dan CMS
- Ubah `fallback.ts` agar situs jalan tanpa CMS: semua teks ANSORUN dalam Bahasa Indonesia (nama event, tagline, tanggal 31 Jan 2027, kategori 5K/10K, lokasi sementara).
- Ubah `types.ts` dan query di `content.ts` secara aditif: field baru `videoUrl`, section about/misi, data race info (kategori/jadwal/lokasi/rute), langkah join, info racepack (tanggal, jam, lokasi, dokumen, kontak).
- Perbarui `scripts/datocms-schema.mjs` (skrip idempoten, model yang sudah ada dilewati) untuk field baru. **Tidak** menjalankan terhadap DatoCMS tanpa persetujuan eksplisit, karena ini menulis ke layanan eksternal.
- Redirect: `/tentang` ke `/#tentang`, `/lari` ke `/racepack` (di `astro.config.mjs`) agar tautan lama tidak mati.
- Perbarui `sitemap`, `README.md`, dan `README.en.md` seperlunya.

### Langkah 7. Verifikasi
- `npm run check` (tidak boleh ada warna mentah) lalu `npm run build`.
- Jalankan `astro dev --background` lalu cek di browser: Home 7 section, `/racepack`, header transparan ke solid, tab, accordion, lightbox (bila dipakai).
- Cek kontras tiap kombinasi (lime di atas teal, teks gelap di atas lime, hijau primer di atas putih) dan layout mobile 375px.
- Ganti 3 token warna secara uji coba, pastikan tidak ada warna yang tertinggal.
- Cek ukuran halaman (hero < 400 KB) dan Lighthouse sederhana.

---

## 6. Ringkasan perubahan file

| File | Perubahan | Ukuran |
|---|---|---|
| `src/styles/theme.css` | Ganti nilai token, tambah `--t-font-display` | kecil |
| `src/config.ts` | `nav`, `fonts.faces`, beberapa teks `ui` | kecil |
| `src/layouts/Base.astro` | Dua logo (terang/gelap) | kecil |
| `src/pages/index.astro` | Susun ulang jadi 7 section dari komponen yang ada | sedang |
| `src/pages/lari.astro` ke `racepack.astro` | Rename + pangkas + 3 langkah | sedang |
| `src/components/VideoEmbed.astro` | **Baru** | kecil |
| `src/components/Steps.astro` | **Baru** | kecil |
| `src/lib/{fallback,types,content}.ts` | Konten ANSORUN + field baru (aditif) | sedang |
| `scripts/datocms-schema.mjs` | Field baru | kecil |
| `public/brand`, `public/fonts` | Aset web hasil konversi | aset |
| `Countdown`, `Tabs`, `RacepackViewer`, `Photo`, `Icon`, `Newsletter`, `PageBanner` | **Tidak diubah** | 0 |

---

## 7. Keputusan (sudah dijawab)

| Topik | Keputusan |
|---|---|
| Tahun, kategori | 2027, kategori 5K dan 10K (dikonfirmasi) |
| Hero | KV dipakai utuh, judul tidak dibuat ulang |
| Alt 1 vs Alt 2 | Pakai **Alt 1** dulu untuk jersey, medali, BIB, tas |
| Galeri dan CTA Instagram | **Disimpan, tidak muncul di nav.** `galeri.astro` tetap ada (tidak dihapus), cukup keluar dari `nav` di `config.ts` |
| Video promo | **Dummy embed YouTube** (ID placeholder, mudah diganti di CMS/fallback) |
| Font | **Semua dipakai** (Neospeed, Golf Italic, Osaca), mengikuti klien. Lihat bagian 4: tiap font dapat satu token peran, pemetaan final setelah dicocokkan dengan desain di Langkah 1 |
| Data event | **Ditunda.** Pakai placeholder bertanda `TODO`, lihat bagian 8 |

## 8. TODO data

Legenda: `- [x]` terisi dari proposal (lihat bagian 14 untuk catatan asumsi), `- [ ]` masih menunggu klien. Penanda di kode: `TODO(data)` (menunggu) dan `CATATAN` (asumsi/improvisasi).

**Home 01, HOME / HERO**
- [ ] Headline hero resmi (sementara tagline dari KV)
- [ ] URL registrasi asli untuk tombol CTA (isi QR di KV)
- [x] Jam start untuk countdown: 31 Januari 2027 05.30 WIB (flag off 10K). Konflik dengan hal. 5 (06.00), lihat bagian 14
- [x] Lokasi: GBK Senayan, Jakarta
- [ ] Konfirmasi tulisan tombol CTA

**Home 02, ABOUT ANSORUN**
- [x] Teks tentang event (ringkasan proposal hal. 2)
- [x] Teks misi sosial dan penerima manfaat (proposal hal. 2 sampai 4)

**Home 03, EVENT HIGHLIGHTS**
- [ ] Video promo asli (sementara embed YouTube dummy `jNQXAC9IVRw`)

**Home 04, RACE INFORMATION**
- [x] Kategori 5K dan 10K beserta biaya (Rp150.000 dan Rp200.000)
- [x] Jadwal: rundown tentatif race day
- [x] Lokasi: GBK Senayan, start/finish Pintu 7 GBK (Jl. APEC)
- [x] **Peta rute 5K dan 10K** (tampil sebagai section sendiri `#rute`, bukan tab) (proposal hal. 11 dan 12, tersimpan di `public/brand/rute-5k.webp` dan `rute-10k.webp`) beserta keterangan rute dan jarak
- [ ] Titik venue pasti (Hutan Kota GBK atau Parkir Timur GBK)
- [ ] Validasi GPS dan perizinan rute (peta masih ilustrasi konsep)
- [ ] Peta lokasi resmi dari klien (sementara link pencarian Google Maps buatan kami)

**Home 05, PRIZES & RACEPACK**
- [x] Hadiah: BYD ATTO 1, 5 Polytron Fox 200, 10 Garmin Runner, 25 headset runner (section sendiri dengan foto dari proposal hal. 13)
- [x] Deskripsi item: Jersey, Air Minum, Roti, Multivitamin, Kartu E-Money, Kalender Puasa
- [ ] Deskripsi Finisher Medal, BIB, Tas Serut
- [ ] Keputusan klien: Alt 1 atau Alt 2 untuk jersey, medali, BIB, tas (PDF memuat kedua alternatif di halaman 1 dan 2)
- [ ] Daftar racepack final (lihat bagian 14), termasuk gambar untuk item tanpa gambar

**Home 06, HOW TO JOIN**
- [x] Pendaftaran: dibuka Desember 2026, biaya, termasuk racepack
- [x] Race pack collection: Januari 2027 (tanggal, jam, lokasi masih menunggu)

**Home 07, FAQ & CONTACT**
- [x] FAQ awal (5 pertanyaan dari fakta proposal)
- [ ] FAQ resmi dari klien
- [x] Kontak panitia dari proposal hal. 27 (Dika, Hesti, Komet + www.ansorun.com) dipasang atas permintaan; catatan: nomor mungkin pribadi, tetap tandai untuk konfirmasi

**Halaman 2, RACEPACK**
- [ ] Hero image khusus halaman Racepack (sementara KV)
- [x] Tanggal pengambilan: "Januari 2027, menjelang race day" (tanggal pasti menunggu)
- [ ] Jam operasional
- [ ] Lokasi pengambilan
- [ ] Dokumen yang harus dibawa
- [ ] Mekanisme pengambilan yang diwakilkan (dan file surat kuasa bila ada)
- [x] Informasi kontak panitia (memakai kontak proposal hal. 27)
- [ ] Deskripsi singkat tiap dari tiga langkah visual (judul sudah dari dokumen)

**Umum**
- [ ] Sponsor/mitra resmi dan logonya (materi sponsor di proposal tidak dipasang)
- [ ] Akun media sosial (footer)
- [ ] Syarat dan ketentuan, bila diperlukan
- [ ] Lisensi font Neospeed untuk web
- [ ] Apakah newsletter diinginkan (tidak ada di struktur klien, dilepas dari Beranda)

## 9. Soal "sudah ikutin PDF?"

Awalnya warna saya ambil dari PNG, bukan dari PDF. Sudah saya cek ulang **semua halaman** kelima PDF (masing-masing 2 halaman, total 10): halaman 1 = Alt 1 dan halaman 2 = Alt 2 untuk jersey, medali, BIB, tas; PDF KV halaman 1 = poster, halaman 2 = titling. Warnanya sama dengan PNG (teal gelap, hijau, lime neon), jadi palet di bagian 3 tetap berlaku. **Tidak ada peta, rute, lokasi, atau jadwal di PDF mana pun** (teks yang ada hanya: tagline, tanggal 31/01/27, 5K - 10K, ajakan scan QR registrasi, nama desain, dan nomor BIB 0011). Poster KV hanya menampilkan ilustrasi siluet kota dengan Monas sebagai latar, bukan peta lomba.

## 10. Status implementasi

Selesai (belum di-commit): Langkah 1 sampai 7. Aset di `public/brand` dan `public/fonts` (logo memakai titling asli apa adanya, tidak dibuat ulang), token tema teal/lime, font klien, Home 7 section, `/racepack` (3 langkah visual), `/galeri` tetap ada tanpa nav, redirect `/tentang` dan `/lari`, skema DatoCMS (belum dijalankan ke Dato), `npm run check` dan build lolos. Sisa: semua item bagian 8 (data klien).

### Kebijakan konten (penting untuk scope klien)

Teks karangan sudah dibuang. Yang tampil hanya fakta dari materi klien (nama, tagline, 31 Januari 2027, 5K dan 10K, nama item racepack, judul section dari `content_structure.md`). Selebihnya berbentuk `[Konten menyusul: ...]` supaya jelas mana yang masih kosong. Newsletter dilepas dari Beranda karena tidak ada di struktur klien (komponennya tetap ada). Lokasi dan jam start tidak diisi (sebelumnya sempat "Jakarta" dan 06:00, itu tebakan dan sudah dihapus).

## 11. Disiplin ke `content_structure.md` (revisi)

Home mengikuti persis tujuh section dan hanya berisi apa yang disebut di dokumen:

| Section | Isi sekarang |
|---|---|
| 01 Home / Hero | KV, headline (tagline), countdown (di dalam hero), satu tombol CTA |
| 02 About Ansorun | Judul + placeholder tentang event dan misi sosial |
| 03 Event Highlights | Judul + video (dummy) |
| 04 Race Information | Judul + blok Kategori, Lokasi, Jadwal (tanpa tab) |
| 04b Rute (dipisah atas permintaan) | Section sendiri `#rute`: peta dan keterangan rute 5K dan 10K, selebar penuh |
| 05 Prizes & Racepack | Judul + hadiah (placeholder) + empat item racepack dengan gambar |
| 06 How to Join | Judul + dua langkah: Pendaftaran, Race Pack Collection |
| 07 FAQ & Contact | Judul + FAQ (placeholder) + kontak |

Yang dibuang karena tidak ada di dokumen: subjudul/paragraf pengantar di tiap section, kutipan di About, tombol "Info Racepack" di hero dan Prizes, countdown dengan judul sendiri, dan newsletter.

Halaman Racepack: hero image (KV sementara) + judul **Racepack Collection**, headline **GET YOUR RACEPACK. GET READY TO RUN.**, enam isi (tanggal, jam, lokasi, dokumen, perwakilan, kontak), tiga langkah visual dengan judul persis dari dokumen.

## 12. Struktur konten (satu blok per section di `content_structure.md`)

Struktur data di `src/lib/fallback.ts` (isi sementara, jalan tanpa CMS) dan model di `scripts/datocms-schema.mjs` (nama model diberi awalan "Section NN" agar urutannya sama dengan dokumen). Query ada di `src/lib/content.ts`. Isi yang belum ada = placeholder `[Konten menyusul: ...]`.

### Halaman 1: Home

| Section | Field konten | Data fallback | Model DatoCMS | Status |
|---|---|---|---|---|
| 01 Home / Hero | KV, headline, tanggal (countdown), label dan URL CTA | `site.heroImage`, `heroHeadline`, `eventDate`, `registrationLabel`, `registrationUrl` | Section 01: Hero dan Pengaturan Situs | KV, tanggal, label CTA terisi. Headline, jam start, URL CTA: TODO |
| 02 About Ansorun | Judul, tentang event, misi sosial | `about.sectionTitle`, `body`, `mission` | Section 02: About Ansorun | Placeholder |
| 03 Event Highlights | Judul, ID video YouTube | `home.videoTitle`, `videoId` | Judul Section Beranda | Video dummy |
| 04 Race Information | Kategori (daftar nama + detail), jadwal (tanggal + jam start), lokasi (nama, alamat, link peta, gambar peta), rute (keterangan, link peta, gambar peta) | `raceCategories`, `raceInfo` | Section 04: Race Information (singleton), Section 04: Kategori Lomba (daftar) | 5K, 10K, 31 Januari 2027 terisi. Sisanya TODO. Slot peta sudah ada |
| 05 Prizes & Racepack | Hadiah (daftar), perlengkapan peserta (daftar: nama, deskripsi, ikon, gambar) | `prizes`, `racepackItems` | Section 05: Hadiah, Section 05: Perlengkapan Racepack | 4 item + gambar terisi. Hadiah dan deskripsi: TODO |
| 06 How to Join | Langkah pendaftaran dan race pack collection (judul, deskripsi, ikon) | `joinSteps` | Langkah (kelompok `join`) | Judul terisi, deskripsi TODO |
| 07 FAQ & Contact | FAQ (pertanyaan, jawaban), kontak (email, WhatsApp, catatan) | `faqs`, `contact` | Section 07: FAQ, Section 07: Kontak | Placeholder |

Judul section Beranda (03 sampai 06) dan judul FAQ ada di model "Judul Section Beranda" dan "Section 02" (judul FAQ).

### Halaman 2: Racepack

| Bagian | Field konten | Data fallback | Model DatoCMS | Status |
|---|---|---|---|---|
| Hero Image | Gambar hero | `racepack.heroImage` | Halaman 2: Racepack | Sementara KV |
| Title | Racepack Collection | `racepack.bannerTitle` | idem | Terisi |
| Headline | GET YOUR RACEPACK. GET READY TO RUN. | `racepack.title` | idem | Terisi |
| Konten | Tanggal, jam operasional, lokasi, dokumen, mekanisme diwakilkan (+ file surat kuasa), kontak panitia | `racepack.date`, `hours`, `venue`, `documents`, `proxyNote`, `proxyFileUrl`, `contact` | idem | TODO |
| Tiga langkah visual | Judul dan deskripsi tiap langkah | `collectSteps` | Langkah (kelompok `collect`) | Judul terisi, deskripsi TODO |

Catatan: skrip `npm run dato:schema` belum dijalankan ke DatoCMS. Model lama (`lari_page`, `racepack_step`, `info_tab`) sudah tidak dipakai kode dan tidak dibuat lagi oleh skrip.

## 13. Hasil analisa `PROPOSAL ANSOR RUN rev 1 .pdf` (27 halaman)

Ini **proposal sponsorship** (bukan konten situs). Sebagian isinya adalah sumber data resmi yang selama ini kita tandai TODO, sebagian lagi internal dan tidak boleh tampil di situs publik. Belum ada yang dipasang ke situs; menunggu keputusan.

### Pemetaan ke struktur konten

| Section situs | Data dari proposal | Halaman |
|---|---|---|
| Hero | Tanggal 31 Januari 2027, 5K dan 10K | 5 |
| About Ansorun | Latar belakang (menyambut Ramadhan 1448 H, sehat, bergerak, berbagi), misi sosial (hasil pendaftaran jadi paket takjil), kolaborasi toleransi lintas agama, podcast ANSOR feat Clash of Religion | 2, 3 |
| About (misi sosial) | Alur: pendaftaran, konversi jadi takjil, penyaluran oleh GP Ansor bersama organisasi lintas agama dan perwakilan pelari. Penerima: panti asuhan yatim piatu, panti jompo, masyarakat kurang mampu | 4 |
| Race Information, Kategori | 5K Rp150.000, 10K Rp200.000, kategori umum, sudah termasuk racepack | 4, 5 |
| Race Information, Jadwal | Rundown race day (tentatif): 04.30 open gate, 05.00 pemanasan, 05.30 flag off 10K, 06.00 flag off 5K, 07.30 finish dan bazar, 08.30 hiburan, 09.15 seremoni dan pelepasan takjil simbolis, 10.15 podcast, 10.30 hiburan, 11.30 grand prize dan selesai | 5, 8 |
| Race Information, Lokasi | GBK Senayan Jakarta. Start/finish di peta rute: Pintu 7 GBK (Jl. APEC). Venue di halaman 6 dan 7: Hutan Kota GBK dan Parkir Timur GBK, 05.30 sampai 11.30 WIB | 5, 6, 7, 11, 12 |
| Race Information, **Rute (peta)** | **Halaman 11 = peta rute 5K, halaman 12 = peta rute 10K.** Keduanya gambar siap pakai (ilustrasi bergaya ANSORUN) dengan keterangan rute dan jarak. Tertulis "Ilustrasi konsep, perlu validasi GPS dan perizinan" | 11, 12 |
| Prizes | 1 Grandprize BYD ATTO 1, 5 Motor Listrik Polytron Fox 200, 10 Jam Garmin Runner, 25 Headset Runner | 13 |
| Racepack | Kaos lari, air minum, roti, multivitamin, kartu e-money (TBC), kalender puasa. Gambar halaman 20 menambah tas serut, stiker logo, salep peregang otot. Halaman 22: medali (2 alt) dan nomor dada (2 alt) | 10, 20, 21, 22 |
| How to Join | Timeline: Des 2026 registrasi online dibuka, Jan 2027 racepack collection, 31 Jan race day, Ramadhan 1448 H penyaluran takjil | 19 |
| FAQ & Contact | Kontak: Dika 082118990008, Hesti 082114338181, Komet 08122720154. Situs: www.ansorun.com | 27 |

Rute 5K (hal. 11): Pintu 7 GBK, Jl. Jenderal Sudirman, akses Kuningan (loop/putar balik), kembali lewat Jl. Jenderal Sudirman, Pintu 7 GBK, sekitar 5 km.
Rute 10K (hal. 12): Pintu 7 GBK, Jl. Jenderal Sudirman, Semanggi, Dukuh Atas, Jl. MH Thamrin, Bundaran HI (putar balik 1), kembali via Jl. Jenderal Sudirman, Bundaran Senayan/Patung Pemuda Membangun (putar balik 2), Pintu 7 GBK, sekitar 10 km.

### Bukan untuk situs publik (bagian sponsorship)

Halaman 9 (alasan jadi sponsor), 15 sampai 17 (harga paket Rp25 juta sampai Rp2,5 miliar dan tabel benefit), 18 (publikasi), 23 sampai 26 (gate, a-board, photobooth, promo). Jangan dipasang tanpa konfirmasi klien.

### Konflik dan hal yang perlu dikonfirmasi klien

- [ ] Nama event: proposal menulis "ANSOR RUN 2027 Road to Ramadhan" (hal. 2) dan "Run to Ramadhan"; KV dan semua desain menulis "ANSORUN Run to Ramadan 2027". Ejaan Ramadhan vs Ramadan juga berbeda
- [ ] Lokasi: Hutan Kota GBK (hal. 6) atau Parkir Timur GBK (hal. 7). Peta rute start/finish di Pintu 7 GBK (Jl. APEC)
- [ ] Jam flag off: hal. 5 menulis 06.00 WIB; rundown hal. 8 menulis 10K 05.30 dan 5K 06.00; venue buka 05.30 (hal. 6, 7) padahal rundown mulai 04.30
- [ ] "100% hasil pendaftaran jadi takjil" (hal. 5) vs "sebagian hasil pendaftaran" (hal. 4)
- [ ] Rute masih "ilustrasi konsep, perlu validasi GPS dan perizinan": boleh dipublikasikan sebagai final?
- [ ] Isi racepack: proposal tidak menyebut medali, nomor dada, tas serut (padahal ada di desain); gambar hal. 20 memuat stiker dan salep yang tidak ada di daftar hal. 10. Daftar final yang mana, dan nama item mengikuti daftar apa
- [ ] Kartu e-money dan penampilan MALIQ, Ndarboy Genks bertanda TBC: boleh ditampilkan?
- [ ] Hiburan (hal. 14) dan podcast Clash of Religion: tampil di situs? Tidak ada di struktur klien
- [ ] Nomor telepon pribadi di hal. 27: boleh dipublikasikan di situs, atau pakai kontak resmi lain
- [ ] Hadiah: apakah daftar hal. 13 final dan boleh disebut merek (BYD, Polytron, Garmin)
- [ ] Biaya pendaftaran dan timeline registrasi (hal. 4, 19) final atau masih bisa berubah

## 14. Catatan asumsi dan improvisasi saat memasang data proposal

Dipasang dengan izin "improvisasi tipis asal ada catatan". Semua ditandai `CATATAN` di `src/lib/fallback.ts`.

- **Ejaan:** proposal menulis "Ramadhan", kami memakai "Ramadan" mengikuti KV dan desain. Nama event memakai "ANSORUN Run to Ramadan 2027" (bukan "ANSOR RUN Road to Ramadhan").
- **Jam countdown 05.30 WIB:** diambil dari flag off 10K pada rundown. Halaman 5 menulis flag off 06.00.
- **Lokasi:** hanya "GBK Senayan, Jakarta" dan "Pintu 7 GBK (Jl. APEC)" (dari peta rute). Hutan Kota GBK dan Parkir Timur GBK (hal. 6 dan 7) sengaja tidak ditulis karena belum jelas mana venue-nya.
- **Link peta lokasi:** link pencarian Google Maps ("Pintu 7 GBK Senayan Jakarta") dibuat oleh kami, bukan dari klien.
- **Rundown:** ditulis "tentatif". Nama penampil (MALIQ & D'Essentials, Ndarboy Genks, keduanya TBC) tidak ditulis, diganti "Penampilan hiburan". Podcast tetap ditulis tanpa nama acara.
- **Hasil pendaftaran:** hanya ditulis "dikonversi menjadi takjil", tanpa angka persen, karena hal. 4 ("sebagian") dan hal. 5 ("100%") berbeda.
- **Teks About dan misi sosial:** ringkasan dan penyusunan ulang kalimat proposal (hal. 2 sampai 4), bukan salinan persis.
- **FAQ:** lima pertanyaan dan jawaban dibuat dari fakta proposal; pertanyaannya buatan kami.
- **Hadiah:** merek (BYD, Polytron, Garmin) ditulis seperti proposal. Perlu izin klien untuk menampilkan merek.
- **Racepack:** 4 item desain (jersey, medali, BIB, tas) ditambah 5 item dari daftar proposal (air minum, roti, multivitamin, kartu e-money TBC, kalender puasa) tanpa gambar. Gambar racepack di hal. 20 menyebut juga stiker dan salep peregang otot, tidak dimasukkan.
- **Peta rute:** gambar diambil langsung dari proposal, bertuliskan "ilustrasi konsep, perlu validasi GPS dan perizinan". Catatan itu ikut ditampilkan di tab Rute.
- **Tidak dipasang:** harga dan benefit sponsor (hal. 9, 15 sampai 18), foto venue hal. 6 dan 7, panggung hiburan (hal. 14), nomor telepon pribadi (hal. 27).

## 15. Revisi struktur: Rute dipisah jadi section

Struktur klien menulis "Kategori, jadwal, lokasi, rute" dalam satu section (04). Atas permintaan, Rute dipisah menjadi section sendiri tepat setelah Race Information, sehingga Home menjadi 8 blok. Ini **menyimpang dari `content_structure.md`** dan perlu diberitahukan ke klien. Data tetap di model `race_info` dan `race_category`; judul section ada di field `route_title` (model Judul Section Beranda).

## 16. Revisi UX: Rute berbentuk tab

Section Rute memakai komponen `src/components/RouteTabs.astro`: tab pill per kategori (5K, 10K), peta besar di kiri dan keterangan rute di kanan (bertumpuk di layar kecil), klik peta untuk zoom (dialog lightbox lebar), navigasi tab dengan panah kiri/kanan, dan kategori bisa dibuka langsung lewat link seperti `/#rute-10k`. Tab dibuat otomatis dari daftar kategori di CMS, jadi kategori baru ikut muncul.

## 17. Audit kesesuaian (diperiksa terhadap situs yang berjalan)

Sumber banding: `content_structure.md`, `PROPOSAL ANSOR RUN rev 1 .pdf`, digiland.co.id (Beranda dan /run). Status: SESUAI, SEBAGIAN, BELUM.

### A. Terhadap `content_structure.md`

| Item | Status | Catatan |
|---|---|---|
| Home 01 Hero: KV, headline, countdown, CTA | SEBAGIAN | KV, countdown, tombol CTA ada. Headline memakai tagline (dokumen tidak memberi teks). **Tombol CTA masih `href="#"`** (URL registrasi belum ada) |
| Home 02 About: event dan misi sosial | SESUAI | Teks dari proposal, perlu persetujuan klien |
| Home 03 Event Highlights: video promo | SEBAGIAN | Embed jalan, tetapi memutar video dummy (bukan promo ANSORUN) |
| Home 04 Race Information: kategori, jadwal, lokasi, rute | SESUAI, dengan satu penyimpangan | Rute dipisah menjadi section sendiri atas permintaan, jadi Home 8 blok bukan 7 |
| Home 05 Prizes & Racepack | SESUAI | Hadiah dan 9 item perlengkapan. 3 item (medali, BIB, tas) belum punya deskripsi |
| Home 06 How to Join: pendaftaran dan race pack collection | SESUAI | Dua langkah. Link pendaftaran belum ada |
| Home 07 FAQ & Contact | SEBAGIAN | FAQ ada (pertanyaan buatan kami), kontak masih placeholder |
| Racepack: hero image, title, headline | SESUAI | Hero image sementara KV |
| Racepack: 6 konten (tanggal, jam, lokasi, dokumen, perwakilan, kontak) | SEBAGIAN | Semua slot ada. Hanya tanggal yang terisi (perkiraan "Januari 2027"); sisanya placeholder |
| Racepack: tiga langkah visual dengan judul persis | SEBAGIAN | Judul persis, deskripsi placeholder. "Visual" masih ikon, belum foto/ilustrasi (lihat C) |
| Template mirip digiland.co.id/run | SEBAGIAN | Lihat C |

### B. Terhadap proposal

Sesuai: nama dan tanggal event, 5K dan 10K, biaya (Rp150.000 dan Rp200.000), rundown, lokasi GBK dan Pintu 7, kedua peta rute dan keterangannya, hadiah, daftar racepack, misi sosial dan penerima manfaat, kolaborasi lintas agama, timeline registrasi dan racepack.

Belum atau berbeda:
- [ ] Nama: proposal "ANSOR RUN 2027 Road to Ramadhan", situs mengikuti KV "ANSORUN Run to Ramadan 2027"
- [ ] Tagline proposal hal. 2 dan 3: "Hadirkan **Toleransi** untuk Jalan Berbagi", KV: "Hadirkan jalan berbagi"
- [ ] Venue: Hutan Kota GBK atau Parkir Timur GBK belum diputuskan (situs hanya menulis GBK Senayan dan Pintu 7)
- [ ] Countdown 05.30 (rundown) vs flag off 06.00 (hal. 5)
- [ ] "100%" vs "sebagian" hasil pendaftaran (tidak ditulis angkanya)
- [ ] Podcast CLASH OF RELIGION dan hiburan (hal. 3, 14) hanya muncul di rundown tanpa nama
- [ ] Tahap Ramadan 1448 H (penyaluran takjil dan laporan) di timeline hal. 19 belum ditampilkan di How to Join
- [ ] Stiker logo dan salep peregang otot (gambar racepack hal. 20) tidak dimasukkan
- [ ] Kontak (hal. 27) dan www.ansorun.com belum ditampilkan
- Disengaja tidak dipasang: harga dan benefit sponsor, publikasi, desain gate/a-board/photobooth
- Kontak hal. 27 sekarang dipasang atas permintaan klien (lihat bagian 18)

### C. Terhadap digiland.co.id

Sama: header transparan menjadi putih saat scroll, countdown, motif stripe, ritme section terang dan gelap, footer gelap, halaman racepack berisi banner + breadcrumb, info lokasi/jadwal, item racepack, langkah pengambilan, catatan perwakilan.

Berbeda:
- Langkah pengambilan di digiland berupa **kartu bernomor dengan foto** (5 langkah, plus kartu catatan). Kita 3 langkah dengan ikon, karena belum ada foto atau ilustrasi
- Digiland punya **menu mobile (hamburger)**, kita hanya menurunkan nav ke baris kedua
- Digiland punya sponsor (powered by, presented by), CTA Instagram, galeri, newsletter, dan pilihan bahasa ID/EN. Semuanya tidak ada di struktur klien sehingga tidak dibuat (sponsor ada di proposal, bisa menyusul)
- Struktur Beranda kita mengikuti dokumen klien (7 section), bukan beranda digiland
- Footer kita 2 kolom tautan, digiland 4

### D. Perbaikan yang dilakukan saat audit

- Hadiah: "10 Jam Garmin: Runner" dan "25 Headset: Runner" dibetulkan menjadi "10 Jam Garmin Runner" dan "25 Headset Runner"
- Layar kecil (375 px): nav turun ke baris kedua sehingga menutupi bagian atas poster KV. Jarak atas hero ditambah di bawah 640 px (kemudian digantikan oleh hamburger, tinggi header kembali 76 px)

### E. Usulan perbaikan berikutnya

- [x] Menu hamburger untuk mobile (selesai: tombol di bawah 768 px, panel menu, tutup lewat klik tautan, Esc, klik di luar)
- [ ] Foto atau ilustrasi untuk tiga langkah racepack (atau kartu bergaya digiland bila klien memberi foto)
- [ ] Ganti video dummy dan isi URL registrasi sebelum publikasi
- [ ] Tampilkan tahap penyaluran takjil (Ramadan 1448 H) bila klien setuju

## 18. Revisi: Prizes dipisah dari Racepack, kontak dipasang

- **Prizes dan Racepack dipisah** menjadi dua section (`#hadiah` dan `#racepack`), sehingga Home menjadi 9 blok. Ini **menyimpang dari `content_structure.md`** yang menulis "Prizes & Racepack" sebagai satu section; beri tahu klien. Hadiah tampil sebagai kartu dengan foto produk (potongan gambar dari proposal hal. 13: `public/brand/hadiah-mobil|motor|jam|headset.webp`) dan jumlah. Racepack tetap memakai pemilih item (jersey, medali, BIB, tas, dan seterusnya). Judul masing-masing section ada di model "Judul Section Beranda" (`prizes_title`, `racepack_title`).
- Model hadiah di CMS sekarang punya `quantity`, `title`, `description`, `image`.
- **Kontak** dari proposal hal. 27: tiga narahubung (nama dan nomor, tombol WhatsApp berupa link `wa.me` dengan awalan 62) dan situs www.ansorun.com. Tampil di FAQ & Contact (Home) dan di kartu Kontak panitia (halaman Racepack) lewat komponen `ContactList.astro`. Di CMS: model "Section 07: Kontak" (website, email, catatan) dan "Section 07: Narahubung" (daftar nama dan nomor).
- [ ] Konfirmasi ke klien: nomor di hal. 27 boleh tampil publik (kemungkinan nomor pribadi) dan merek hadiah boleh ditampilkan. Foto hadiah berasal dari proposal, periksa hak pakainya.

## 19. Ekstrak ulang dari PDF (About, Race Info + Rute, Hadiah & Racepack, halaman Racepack)

Copy diganti teks apa adanya dari proposal; tema/CSS tidak diubah. Copy yang dikoreksi karena tidak ada di PDF: "ribuan", "sebagian besar", "komunitas lintas agama", "Doorprize", "Hadiah Utama & Doorprize" (kini "Hadiah Utama"), label "Unit", badge "Grand Prize", badge "Kategori Resmi", "Mulai dari Rp150.000", "Perlengkapan resmi lomba yang siap menemani langkah kebaikanmu", "Exclusive Runner Gear", "Alur pengambilan paket", emoji di tab. Judul "Event Highlights", "How to Join", "Race Information", "Prizes & Racepack" kini dari data (sesuai content_structure.md).

- [ ] Nama event: PDF "ANSOR RUN 2027 Road to Ramadhan" vs KV "ANSORUN Run to Ramadan"
- [ ] Jam flag off: hal. 5 "06.00" vs rundown hal. 8 "05.30 (10K) / 06.00 (5K)"
- [ ] Hasil pendaftaran: hal. 2 "seluruh", hal. 4 "sebagian", hal. 5 "100%"
- [ ] Venue: hal. 6 Hutan Kota GBK, hal. 7 Parkir Timur GBK, peta rute Pintu 7
- [ ] Penampil bertanda TBC (Ndarboy Genk, MALIQ & D'Essentials) tampil seperti di PDF
- [ ] Daftar racepack: hal. 10 hanya 6 item; medali, nomor dada (hal. 22) dan tas serut (assets_bank) belum ada deskripsi
- [ ] FAQ: PDF tidak punya FAQ; pertanyaan di fallback buatan kami
- [ ] Belum dikoreksi (di luar fokus): section FAQ/Kontak/CTA tambahan di index.astro, judul "TENTANG"/copy Race Info lain, copy tab Racepack di Home
- [ ] Halaman Racepack: urutan baru = headline + 3 langkah, tanggal/jam/lokasi, dokumen + diwakilkan, kontak. Section "isi paket" dibuang (sudah ada di Home)
- [x] Tema dikembalikan ke versi datar (ec74a9b): tanpa gradient/blur/bayangan besar, font klien (Neospeed, Golf, Osaca). Home dibangun dari versi data-driven + copy PDF; Prizes & Racepack satu section. ContactList ditulis ulang sebagai satu kartu daftar (nama, nomor, tombol WhatsApp per baris).
- [x] Restyle ala digiland (lega, tanpa kotak): padding section lebih besar, judul lebih besar, Race Information = tiga fakta besar + rundown daftar jam (dari raceInfo.scheduleDetail), Prizes tanpa kartu, Racepack = grid gambar + daftar perlengkapan (RacepackViewer tidak dipakai lagi di Home/Racepack). Class baru di theme.css: .fact-value, .fact-sub, .time-row.
- [ ] Foto lapangan/pelari dari klien untuk latar penuh section About dan Video (belum ada; hanya KV dan render produk)
- [x] Polesan dekor dari aset proposal: foto venue hal. 6 dan 7 (Race Information), foto isi racepack hal. 20 (Prizes & Racepack), foto model berjersey hal. 21 (banner /racepack), render gate hal. 23 sebagai latar Event Highlights dengan overlay gelap, garis aksen di bawah judul section, stripe diagonal di bawah video. Foto di `public/brand/`, dikonstanta di `fallback.ts` (venuePhotos, racepackPhoto, eventBackdrop), belum ada model CMS.
- [ ] Foto hal. 20 menampilkan item yang tidak ada di daftar hal. 10 (mis. salep pereda otot, stiker logo): konfirmasi daftar racepack final
- [ ] Hak pakai foto venue, render gate, dan foto model dari proposal
- [x] About dibuat berlapis: teks hal. 2 + foto podcast hal. 3 (about-podcast.webp), tiga ubin langkah konsep sosial + penerima manfaat hal. 4 (diurai dari about.mission). Latar section terang bergaris diagonal tipis (.bg-pattern), backdrop Event Highlights dipudarkan (overlay 94%).
- [ ] Izin pakai foto tokoh podcast (hal. 3) dari klien
- [x] How to Join diperluas atas permintaan dari 2 jadi 4 langkah dari timeline hal. 19 (Pendaftaran Des 2026, Race Pack Collection Jan 2027, Race Day 31 Jan 2027, Berbagi Takjil Ramadhan 1448 H). Dokumen content_structure.md hanya menyebut 2; "laporan ke sponsor" sengaja tidak ditulis.
- [x] Tekstur titik diganti gradient lembut (.bg-pattern radial lime/hijau, .bg-fade linear) atas permintaan; ini menyimpang dari aturan "tanpa gradient" di wp-classic-theme.
- [x] Audit + rapikan: FAQ tidak lagi terbuka otomatis; anchor #racepack kini menunjuk subjudul "Racepack Peserta" (sebelumnya div kosong); judul FAQ satu baris; lebar kontak sejajar FAQ. Tautan anchor valid, 1 h1, semua img beralt, tanpa error konsol.
- [ ] Komponen tidak terpakai lagi: RacepackViewer, Newsletter, Tabs (dibiarkan; hapus bila tidak dipakai di versi final)
- [x] Poles: kartu kontak vertikal (avatar inisial, nomor, tombol WhatsApp); Event Highlights dalam container (panel bergambar gate, bukan lagi section penuh); About tanpa foto podcast (dibuang, foto tokoh bukan bagian "tentang event dan misi sosial" dan butuh izin) diganti kutipan judul hal. 2; Race Information: fakta berikon bersekat garis, foto venue dan racepack dalam bingkai matte putih.
- [x] Tombol 3D timbul: sisi bawah tebal 5px lebih gelap per varian (--btn-edge), naik 1px saat hover, menekan saat diklik; .btn-sm didefinisikan (sebelumnya tidak ada di CSS).
- [x] Tombol 3D dibatalkan atas permintaan; diganti tombol solid biasa: sudut membulat 10px, hover sedikit lebih gelap, menekan halus (scale .98).
- [x] Tombol timbul gaya Duolingo: persegi membulat 12px, alas 4px lebih gelap (box-shadow, tidak mengubah layout), tertekan saat diklik; btn-sm alas 3px.
- [x] Kontak jadi tabel sederhana tanpa ikon/avatar (Nama, Telepon, tombol Chat WhatsApp); CSS kartu kontak dibuang.
- [x] Kedalaman tanpa mengubah struktur: token --t-shadow (bayangan tipis) di kartu/ubin/foto/FAQ, hover mengangkat, sorotan radial di belakang foto hadiah, zebra rundown, How to Join jadi section gelap bergradien (.bg-dark-glow) agar ritme terang-gelap lebih terasa.
- [x] Font isi mengikuti PDF: Carlito (padanan gratis Calibri) untuk body; judul tetap Neospeed/Golf/Osaca. Ukuran dasar 19px agar setara. Calibri/Arial berlisensi Microsoft dan Biennale (PDF hal. 1-3) hanya tertanam sebagian huruf, jadi tidak dipakai langsung.
- [x] How to Join: ikon dibuang (tidak ada di PDF), diganti timeline hal. 19: tanggal lime miring, titik pada garis putus-putus, kartu; Race Day disorot seperti di PDF.
- [x] Revisi atas permintaan: Event Highlights kembali section penuh (latar gate, overlay 92%); pengalih rute jadi kontrol segmen berlabel "Pilih kategori rute"; Prizes dan Racepack DIPISAH jadi dua section (menyimpang dari content_structure.md yang menulis satu section); FAQ dan Contact DIPISAH (juga menyimpang dari "FAQ & CONTACT"); timeline How to Join tanpa garis putus di awal dan akhir.
- [x] Prizes: Grandprize jadi kartu besar, tiga hadiah lain sejajar di bawahnya. Racepack: foto isi racepack hal. 20 di kiri (menempel saat scroll), daftar bernomor 9 item di kanan dengan thumbnail bila ada gambar.
- [x] Prizes/Racepack dirapikan: Prizes satu baris 5 kolom (Grandprize 2 kolom, kartu bergaris aksen lime di atas; di mobile 2 kolom); Racepack foto kiri + daftar bernomor padat kanan (thumbnail 40px, baris rapat).
- [x] Prizes dan Racepack digabung lagi jadi satu section 'Prizes & Racepack' (sesuai content_structure.md) agar lebih padat: baris Prizes lima kolom + foto isi racepack dan daftar bernomor, heading dan padding section cukup satu kali (1560px menjadi 1350px di desktop).
- [x] Prizes dan Racepack tanpa kartu: Prizes satu baris bergaris hijau di atas; Racepack foto isi racepack kiri + empat gambar bernomor (sorotan radial) kanan + lima perlengkapan lain sebagai baris bernomor bergaris tipis.
- [x] Racepack: kolom kiri dan kanan setara tinggi (foto mengisi tinggi kolom), tile gambar dipendekkan (16:10); subjudul 'Hadiah Utama' dan 'Racepack Peserta' diberi garis bawah pendek (.sub-title); Prizes lebih padat (foto 96-112px, angka sejajar nama).
- [x] About dipercantik: kutipan judul hal. 2 dalam panel gelap bergradien dengan tanda kutip lime besar; teks dengan garis aksen di kiri; tiga langkah konsep sosial dihubungkan panah (seperti hal. 4); penerima manfaat dalam strip bertitik.
- [x] About didesain ulang: bagian terang (judul besar rata kiri + kutipan di kiri, teks dengan paragraf pembuka besar di kanan) dan pita hijau jersey bergradien (.bg-green-glow) berisi tiga langkah konsep sosial berpanah plus penerima manfaat sebagai pil outline. Panel kutipan gelap sebelumnya dibuang.
- [x] About kembali satu section terang (tanpa pita berwarna); panah antar langkah dan SEMUA border-top beraksen dibuang (ubin langkah dan kartu Prizes). Catatan desain: user tidak suka garis atas beraksen.
- [x] Sistem kartu dinaikkan (token --t-radius-card 14px): permukaan bergradien tipis, highlight dalam, bayangan berlapis, hover mengangkat dengan pendar hijau; ubin langkah About memakai lencana angka bulat; FAQ menyorot saat terbuka; kartu gelap (timeline) bergradien dengan highlight; kontak dalam kartu; bingkai foto membulat. Berlaku di Home dan /racepack.
- [x] Kartu bermotif lintasan: tambalan stripe diagonal di pojok kanan atas (melebar saat hover) dan angka hantu besar di pojok kanan bawah (counter CSS) pada ubin langkah About, kartu timeline, dan info-card /racepack. Hijau di kartu terang, lime di kartu gelap.
- [x] Latar section terang: dua gradient yang saling menyambung (.bg-fade putih ke hijau muda dengan pendar lime kanan atas, .bg-pattern kebalikannya dengan pendar hijau kiri bawah) dipakai bergantian agar tidak ada sambungan terlihat; About memakai .bg-fade. Gambar Prizes dan Racepack diberi garis tepi hijau mengikuti siluet (.silhouette); jersey.webp dan tas.webp diolah menghapus latar putih (backup: asli di .docs/assets_bank).
- [x] Race Information dan Rute dipadatkan (.section-tight: padding 36-56px, judul lebih kecil, ikon fakta 42px, baris rundown lebih rapat, foto venue rasio 2.1:1, kartu rute p-5); tinggi desktop 1155 menjadi 954 dan 823 menjadi 725. Gradient latar terang dipertegas (hijau muda 11 menjadi 20 persen, pendar lime 40 persen, pendar hijau 30 persen).
- [x] DIBATALKAN atas permintaan: nav transparan baru, hero layar penuh, dan pita transisi antar section (edge). Dikembalikan ke nav semula (transparan di atas hero, putih solid setelah scroll) dan hero poster semula.
