/**
 * Konfigurasi statis & teks UI yang BUKAN konten CMS.
 * Teks yang sering diubah klien (judul, tanggal, FAQ, dll.) ada di DatoCMS.
 */
export const LOCALE = 'id-ID';
export const TIMEZONE = 'Asia/Jakarta';

import { isLive } from './lib/pages.mjs';

// Semua halaman; yang masuk daftar HIDDEN_PATHS (src/lib/pages.mjs) otomatis tidak muncul di menu.
const allPages = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/racepack', label: 'Racepack' },
  { href: '/galeri', label: 'Galeri' },
] as const;
export const nav = allPages.filter((p) => isLive(p.href));

export const ui = {
  explore: 'Jelajahi Event',
  units: { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
  countdownDone: 'Event sedang berlangsung. Sampai jumpa di garis finis!',
  // Label kecil di atas judul section (Beranda)
  eyebrows: {
    about: 'Tentang event dan misi sosial',
    steps: 'Konsep sosial',
    highlights: 'Video promo',
    race: 'Kategori, jadwal, lokasi, rute',
    prizes: 'Hadiah dan perlengkapan peserta',
    join: 'Pendaftaran dan pengambilan race pack',
    faq: 'Informasi tambahan dan kontak',
  },
  feeLabel: 'Biaya pendaftaran',
  prizesHeading: 'Hadiah utama',
  learnMore: 'Selengkapnya',
  seeRacepack: 'Info Racepack Collection',
  joinRegister: 'Pendaftaran',
  joinCollect: 'Race pack collection',
  videoSoon: 'Video promo segera hadir',
  videoPlay: 'Putar video',
  mapZoom: 'Ketuk peta untuk membuka ukuran penuh',
  sponsorsTitle: 'Didukung oleh',
  contactHeading: 'Kontak panitia',
  racepackInfoHeading: 'Informasi pengambilan race pack',
  website: 'Website resmi',
  email: 'Email',
  closeLightbox: 'Tutup',
  newsletterTitle: 'Tetap Bergerak',
  newsletterText: 'Dapatkan pembaruan jadwal race pack, rundown, dan info penting ANSORUN langsung ke email Anda.',
  newsletterPlaceholder: 'Masukkan alamat email Anda',
  newsletterConsent: 'Dengan mengirimkan alamat email Anda, Anda setuju untuk menerima informasi acara dan pembaruan resmi dari penyelenggara.',
  newsletterButton: 'Berlangganan',
  newsletterSending: 'Mengirim…',
  newsletterSuccess: 'Terima kasih! Silakan cek email Anda untuk konfirmasi.',
  newsletterError: 'Maaf, belum berhasil terkirim. Periksa email Anda lalu coba lagi.',
  newsletterDemo: 'Mode contoh: form belum terhubung ke layanan email.',
  newsletterPrivacy: 'Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.',
  faqContact: 'Masih memiliki pertanyaan?',
  contactButton: 'Hubungi Kami',
  comingSoon: 'Segera Hadir',
  backToTop: 'Kembali ke atas',
};

/**
 * Font: satu-satunya tempat untuk mengganti font. `href` = link Google Fonts,
 * `heading`/`body` = nilai font-family (dipakai sebagai --t-font-heading / --t-font-body).
 */
export const fonts = {
  href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,500;0,600;0,700;0,800;1,800&family=Open+Sans:wght@400;600;700&display=swap',
  heading: '"Montserrat", "Helvetica Neue", Arial, sans-serif',
  body: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
};
