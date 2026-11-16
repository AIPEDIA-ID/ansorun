/**
 * Konfigurasi statis & teks UI yang BUKAN konten CMS.
 * Teks yang sering diubah klien (judul, tanggal, FAQ, dll.) ada di DatoCMS.
 */
export const LOCALE = 'id-ID';
export const TIMEZONE = 'Asia/Jakarta';

// Galeri sengaja tidak ada di nav (halaman /galeri tetap ada, belum ditampilkan).
export const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/#tentang', label: 'Tentang' },
  { href: '/#race', label: 'Race Info' },
  { href: '/racepack', label: 'Racepack' },
] as const;

export const ui = {
  watchVideo: 'Putar video',
  videoTitle: 'Video promo ANSORUN',
  howToJoinCta: 'Race Pack Collection',
  tbd: 'Segera diumumkan',
  units: { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
  countdownDone: 'Event sedang berlangsung. Sampai jumpa di garis finis!',
  closeLightbox: 'Tutup',
  contactTitle: '**Contact**',
  routePick: 'Pilih kategori rute',
  openMap: 'Buka peta',
  menuOpen: 'Buka menu',
  menuClose: 'Tutup menu',
  zoomMap: 'Perbesar peta',
  // Label dari heading slide proposal (hal. 13 dan 10)
  prizesSub: 'Hadiah Utama',
  racepackSub: 'Racepack Peserta',
  backToTop: 'Kembali ke atas',
};

/**
 * Font: satu-satunya tempat untuk mengganti font.
 *  - `href`    : link Google Fonts (hanya font body)
 *  - `faces`   : font klien yang di-host sendiri di /public/fonts (dibuat jadi @font-face)
 *  - `heading` / `body` / `tag` / `display` : font-family per peran
 *      heading = Neospeed (judul, label) | body = Open Sans (paragraf)
 *      tag = Osaca Medium Italic (tagline, eyebrow) | display = Golf Italic (judul besar, angka; hanya ukuran besar)
 */
export const fonts = {
  href: 'https://fonts.googleapis.com/css2?family=Carlito:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  faces: [
    { family: 'Neospeed', file: 'neospeed.woff2', style: 'normal' },
    { family: 'Neospeed', file: 'neospeed-oblique.woff2', style: 'italic' },
    { family: 'Golf', file: 'golf-italic.woff2', style: 'normal' },
    { family: 'Golf', file: 'golf-italic.woff2', style: 'italic' },
    { family: 'Osaca', file: 'osaca-medium-italic.woff2', style: 'normal' },
    { family: 'Osaca', file: 'osaca-medium-italic.woff2', style: 'italic' },
  ],
  heading: '"Neospeed", "Montserrat", "Helvetica Neue", Arial, sans-serif',
  body: '"Carlito", "Calibri", Arial, sans-serif', // Carlito = padanan gratis Calibri (font isi di PDF proposal)
  tag: '"Osaca", "Carlito", Arial, sans-serif',
  display: '"Golf", "Neospeed", Arial, sans-serif',
};

/** @font-face untuk font klien. Rentang weight 100–900 agar browser tidak membuat faux-bold. */
export const fontFaceCss = fonts.faces
  .map((f) => `@font-face{font-family:"${f.family}";src:url(/fonts/${f.file}) format("woff2");font-style:${f.style};font-weight:100 900;font-display:swap}`)
  .join('');
