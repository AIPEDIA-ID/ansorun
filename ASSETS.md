# Daftar aset yang perlu disiapkan (slice manual)

Gambar di PDF proposal sudah "rata" (satu slide = satu gambar) dan resolusinya rendah. **Minta file sumber dari desainer** (PSD/AI/Figma/PPT) atau, kalau terpaksa, ekspor dari PPT/Keynote dengan *Save as picture* di ukuran besar. Jangan screenshot.

Format: foto → JPG/WebP kualitas 80–85, hasil akhir ≤ 400 KB per gambar. Logo → SVG (utama) atau PNG transparan. Nama file bebas; upload lewat DatoCMS pada field yang tertera. Selama field kosong, situs memakai gambar contoh.

## Wajib sebelum rilis

| # | Aset | Ukuran / rasio | Sumber di PDF | Field di Dato |
|---|---|---|---|---|
| 1 | ~~Logo ANSORUN~~ **sudah terpasang** dari `.docs/assets_bank/KV DSGN` (versi gelap + hitam). Idealnya SVG vektor dari file .cdr | – | `public/brand/` | Site Settings → Logo / Logo latar terang |
| 2 | ~~Foto hero~~ **KV approved sudah terpasang** (layout KV, `public/brand/kv.webp`) | – | `.docs/assets_bank/KV DSGN` | Site Settings → Hero: KV lengkap |
| 3 | **Peta rute 5K** | 1700×956 (16:9) | Slide 11 | Rute Lari → "Rute 5K" → Gambar peta |
| 4 | **Peta rute 10K** | 1700×956 (16:9) | Slide 12 | Rute Lari → "Rute 10K" → Gambar peta |
| 5 | **Flat-lay isi race pack** | 1700×1070 (≈16:10) | Slide 20 (tanpa tepi lime) | Halaman Beranda → Gambar race pack |
| 6 | **Logo sponsor** (versi putih/terang, latar transparan, satu file per sponsor) | SVG atau PNG ≥ 480×128 | Dari tiap sponsor | Sponsor → Logo (+ isi Peran) |
| 7 | ~~Favicon~~ **sudah terpasang** (huruf A dari logo) | `public/favicon.png` + `.ico` | – | – |
| 8 | **Nomor telepon panitia** (teks) | – | Slide 27 | Kontak Panitia |

## Opsional (meningkatkan kualitas)

| # | Aset | Ukuran / rasio | Sumber di PDF | Field di Dato |
|---|---|---|---|---|
| 9 | Banner halaman Racepack | 1920×600 min., lebar | Foto suasana pengambilan race pack / flat-lay yang dipotong lebar | Halaman Racepack → Banner: gambar latar |
| 10 | Foto per item race pack (6): kaos, air, roti, multivitamin, e-money, kalender | 1700×1070 (rasio sama seperti #5), latar polos | Potong dari slide 20 / foto produk asli | Isi Race Pack → Gambar preview (kosong = tampil flat-lay #5) |
| 11 | Poster video promo | 1280×720 | Frame dari video | Halaman Beranda → Highlights: poster (kosong = thumbnail YouTube) |
| 12 | Link video YouTube promo | – | – | Halaman Beranda → Highlights: link video |
| 13 | Surat kuasa (PDF) | – | – | Halaman Racepack → File surat kuasa |
| 14 | Foto galeri (nanti, pasca-event) | ≥ 1600 px sisi panjang, 4:3, landscape | Dokumentasi event | Foto Galeri → Foto (+ caption) |
| 15 | Gambar Open Graph khusus (kartu share WhatsApp/IG) | 1200×630 | Dari KV | Saat ini memakai foto hero (#2); minta ditambahkan field khusus bila perlu |

## Foto hadiah (sudah terpasang)
Slide 13 menyimpan tiap hadiah sebagai gambar terpisah dengan latar transparan, jadi saya ekstrak langsung dari PDF (bukan screenshot): BYD ATTO 1, motor listrik, jam Garmin, dan headset, di `public/sample/prizes/*.webp`. Kualitasnya cukup untuk tampil di situs. Untuk mengganti, unggah foto di DatoCMS → Hadiah → Foto hadiah (PNG/WebP transparan paling bagus). Hapus `public/sample/` setelah semua aset asli terpasang.

## Ada di PDF tapi **belum dipakai** di situs

| Slide | Isi | Catatan |
|---|---|---|
| 1, 2, 9, 26 | KV dan poster promo | Berisi teks tertanam; cocok untuk sosmed, bukan hero |
| 3, 14 | Foto pembicara podcast dan artis | Perlu izin penggunaan. Tidak dipakai |
| 6, 7 | Foto lokasi (Hutan Kota GBK, Parkir Timur GBK) | Berteks hitam tertanam; lokasi masih belum final (lihat catatan konfirmasi). Bisa dipakai sebagai foto lokasi bila klien mengirim versi tanpa teks |
| 21 | Jersey lelaki/wanita | Bisa jadi gambar item "Kaos Lari" (#10) |
| 22 | Medali dan nomor dada | Belum ada slot (race pack di brief tidak menyebut medali) |
| 23–25 | Mockup gate, A-board, backdrop | Materi produksi/sponsor, bukan untuk situs |
| 15–19 | Paket sponsor, benefit, timeline | Proposal untuk sponsor, tidak masuk situs publik |

## Catatan teknis
- Rasio dipaksa lewat CSS; gambar yang tidak pas akan dipotong (cover), jadi pastikan objek penting di tengah.
- Logo dipakai dua rupa: putih (CSS filter) di atas hero, dan warna asli setelah header jadi putih. Karena itu logo **harus satu warna gelap**; logo kuning-putih bergaris tidak akan terbaca di header putih.
- Gambar Unsplash dan `public/sample/` hanyalah placeholder. Hapus `public/sample/` dan `public/dummy/` setelah semua aset asli terpasang.
