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

## 8. TODO data (ditunda, diisi nanti)

Semua item di `src/lib/fallback.ts` ditandai `TODO(data)` dan tampil sebagai placeholder `[Konten menyusul: ...]` atau "Segera diumumkan". Dikelompokkan per section di `content_structure.md`.

**Home 01, HOME / HERO**
- [ ] Headline hero resmi (sementara memakai tagline dari KV)
- [ ] URL registrasi asli untuk tombol CTA (isi QR di KV)
- [ ] Jam start resmi (countdown sementara ke 31 Januari 2027 pukul 00:00 WIB)
- [ ] Lokasi event (hero dan footer sementara "Lokasi: segera diumumkan")
- [ ] Konfirmasi tulisan tombol CTA

**Home 02, ABOUT ANSORUN**
- [ ] Teks tentang event
- [ ] Teks misi sosial (termasuk penerima manfaat)

**Home 03, EVENT HIGHLIGHTS**
- [ ] Video promo asli (sementara embed YouTube dummy `jNQXAC9IVRw`)

**Home 04, RACE INFORMATION**
- [ ] Kategori: detail 5K dan 10K (hanya nama kategori yang diketahui dari KV)
- [ ] Jadwal: jam start tiap kategori (hanya tanggal 31 Januari 2027 yang diketahui)
- [ ] Lokasi start dan finish
- [ ] **Peta dan rute lari**: tidak ada di `assets_bank` maupun di kelima PDF (lihat bagian 9). Minta file peta/rute ke klien (gambar atau link Google Maps) dan tentukan apakah peta ada di tab Lokasi, Rute, atau keduanya
- [ ] Keterangan rute 5K dan 10K (jarak, titik putar, water station)

**Home 05, PRIZES & RACEPACK**
- [ ] Hadiah (juara per kategori, doorprize, dan sebagainya)
- [ ] Deskripsi tiap item racepack: Jersey, Finisher Medal, BIB, Tas Serut
- [ ] Keputusan klien: Alt 1 atau Alt 2 untuk jersey, medali, BIB, tas (PDF memuat kedua alternatif di halaman 1 dan 2)
- [ ] Apakah ada item racepack lain di luar empat item ini

**Home 06, HOW TO JOIN**
- [ ] Langkah pendaftaran (cara, biaya, pembayaran, kuota)
- [ ] Langkah race pack collection (ringkasan, mengarah ke halaman Racepack)

**Home 07, FAQ & CONTACT**
- [ ] Daftar FAQ (pertanyaan dan jawaban)
- [ ] Kontak panitia (email, WhatsApp, atau link)

**Halaman 2, RACEPACK**
- [ ] Hero image khusus halaman Racepack (sementara memakai KV)
- [ ] Tanggal pengambilan
- [ ] Jam operasional
- [ ] Lokasi pengambilan
- [ ] Dokumen yang harus dibawa
- [ ] Mekanisme pengambilan yang diwakilkan (dan file surat kuasa bila ada)
- [ ] Informasi kontak panitia
- [ ] Deskripsi singkat tiap dari tiga langkah visual (judul sudah dari dokumen)

**Umum**
- [ ] Sponsor/mitra resmi dan logonya (bagian sponsor di hero tersembunyi sampai ada)
- [ ] Akun media sosial (footer)
- [ ] Syarat dan ketentuan, bila diperlukan
- [ ] Lisensi font Neospeed untuk web
- [ ] Konfirmasi tahun 2027 (nama file KV tertulis 2026)
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
| 04 Race Information | Judul + empat tab: Kategori, Jadwal, Lokasi, Rute |
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
