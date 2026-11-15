/**
 * Konfigurasi statis & teks UI yang BUKAN konten CMS.
 * Teks yang sering diubah klien (judul, tanggal, FAQ, dll.) ada di DatoCMS.
 */
export const LOCALE = 'id-ID';
export const TIMEZONE = 'Asia/Jakarta';

export const nav = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
  { href: '/lari', label: 'Lari' },
  { href: '/galeri', label: 'Galeri' },
] as const;

export const ui = {
  explore: 'Jelajahi',
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
  faqContact: 'Masih memiliki pertanyaan?',
  contactButton: 'Hubungi Kami',
  stepsNoticeTitle: 'Penting',
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
