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
  explore: 'Jelajahi',
  watchVideo: 'Putar video',
  videoTitle: 'Video promo ANSORUN',
  howToJoinCta: 'Race Pack Collection',
  tbd: 'Segera diumumkan',
  units: { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
  countdownDone: 'Event sedang berlangsung. Sampai jumpa di garis finis!',
  followInstagram: 'Follow di Instagram',
  galleryEyebrow: 'Galeri',
  viewAllPhotos: 'Lihat Semua Foto',
  galleryEmpty: 'Foto akan segera ditambahkan.',
  closeLightbox: 'Tutup',
  newsletterTitle: 'Tetap Bergerak',
  newsletterText: 'Dapatkan pembaruan eksklusif, tips latihan, dan info pendaftaran early bird langsung ke email Anda.',
  newsletterPlaceholder: 'Masukkan alamat email Anda',
  newsletterConsent: 'Dengan mengirimkan alamat email Anda, Anda setuju untuk menerima buletin, informasi acara, dan pembaruan resmi dari penyelenggara.',
  newsletterButton: 'Berlangganan',
  newsletterSending: 'Mengirim…',
  newsletterSuccess: 'Terima kasih! Silakan cek email Anda untuk konfirmasi.',
  newsletterError: 'Maaf, belum berhasil terkirim. Periksa email Anda lalu coba lagi.',
  newsletterDemo: 'Mode contoh: form belum terhubung ke layanan email.',
  newsletterPrivacy: 'Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.',
  contactLabel: 'Kontak',
  openMap: 'Buka peta',
  menuOpen: 'Buka menu',
  menuClose: 'Tutup menu',
  zoomMap: 'Perbesar peta',
  racepackItemsLabel: 'Perlengkapan peserta',
  // Label dari heading slide proposal (hal. 13 dan 10)
  prizesSub: 'Hadiah Utama',
  racepackSub: 'Racepack Peserta',
  stepsNoticeTitle: 'Penting',
  comingSoon: 'Segera Hadir',
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
  href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
  faces: [
    { family: 'Neospeed', file: 'neospeed.woff2', style: 'normal' },
    { family: 'Neospeed', file: 'neospeed-oblique.woff2', style: 'italic' },
    { family: 'Golf', file: 'golf-italic.woff2', style: 'normal' },
    { family: 'Golf', file: 'golf-italic.woff2', style: 'italic' },
    { family: 'Osaca', file: 'osaca-medium-italic.woff2', style: 'normal' },
    { family: 'Osaca', file: 'osaca-medium-italic.woff2', style: 'italic' },
  ],
  heading: '"Neospeed", "Montserrat", "Helvetica Neue", Arial, sans-serif',
  body: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
  tag: '"Osaca", "Open Sans", Arial, sans-serif',
  display: '"Golf", "Neospeed", Arial, sans-serif',
};

/** @font-face untuk font klien. Rentang weight 100–900 agar browser tidak membuat faux-bold. */
export const fontFaceCss = fonts.faces
  .map((f) => `@font-face{font-family:"${f.family}";src:url(/fonts/${f.file}) format("woff2");font-style:${f.style};font-weight:100 900;font-display:swap}`)
  .join('');
