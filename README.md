# ANSORUN Run to Ramadan 2027

Situs event lari statis (Astro + Tailwind). Klien mengedit teks dan gambar lewat `/admin` (CMS PHP kecil di cPanel).

## Jalankan

```bash
npm install
npm run dev
```

## Perintah

```bash
npm run check        # pagar warna mentah + build
npm run cms          # build + zip untuk cPanel: cpanel/dist/ansorun-<versi>.zip
npm run cms:parity   # tes: hasil PHP sama dengan Astro
```

## Deploy ke cPanel

1. `npm run cms` → `cpanel/dist/ansorun-<versi>.zip`
2. File Manager: unggah zip ke `/home/ansz8897/`, **Extract**. Selesai: situs tayang, `/admin` bisa login.

Akun admin ikut di dalam zip (dari `cpanel/local/config.php`, di luar git). Buat/ganti akun: `php cpanel/src/cms/bin/make-config.php <username>`, lalu `npm run cms` lagi.

Setelah update, buka `/admin` sekali agar suntingan klien diterapkan lagi ke halaman baru. Zip tidak menimpa `content/` dan `uploads/`.

Cek dulu bahwa `public_html` tidak punya `index.html`/`index.php` bawaan hosting yang masih dipakai. Cek hosting (PHP 8.0+): unggah `cpanel/tools/probe.php` ke `public_html`, buka, lalu hapus.

## Versi

`cpanel/version.json`, mulai 1.0, naik otomatis bila isi build berubah. Commit file ini, lalu `git tag v<versi>`.

## Konten klien ke git

Unduh `cms/content/content.json` dan `public_html/uploads/` dari server ke `cpanel/content/`, lalu commit. Satu arah saja (server → repo).

## Ubah di mana?

| Kebutuhan | File |
|---|---|
| Warna, ukuran, bentuk komponen | `src/styles/theme.css` (daftar isi di atas file; warna mentah hanya di TOKENS) |
| Font, menu, teks UI | `src/config.ts` |
| Teks, gambar, tanggal, FAQ, sponsor (nilai awal) | `src/lib/fallback.ts` |
| Susunan section | `src/pages/*.astro`, `src/components/` |

Setelah live, teks diubah lewat `/admin`, bukan lewat kode. Mengubah teks bawaan di kode membuat field itu dianggap baru, sehingga suntingan klien pada teks lama tidak berlaku.

## Sebelum rilis

- Foto contoh Unsplash di `fallback.ts` → ganti foto asli.
- `sponsors` masih kosong (bagian sponsor tersembunyi), `home.videoId` masih dummy, `site.registrationUrl` masih `#`.
- Domain asli ada di `scripts/cms-config.mjs` (`SITE_URL`); `npm run check` memperingatkan bila kosong atau localhost.

## Struktur

```
src/styles/theme.css   tema terpusat
src/lib/               content.ts, fallback.ts (isi konten), img.ts, cms.ts, teks, parse
src/components/        Hero, Countdown, RouteTabs, Prizes, ... ; src/pages/ index, racepack, galeri
cpanel/src/            kode PHP CMS (cms/ privat, public_html/admin/ publik)
scripts/               check.mjs, cms-build.mjs, cms-pack.mjs, cms-parity.mjs
```
