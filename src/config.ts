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
  newsletterPrivacy: 'Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.',
  faqContact: 'Masih memiliki pertanyaan?',
  contactButton: 'Hubungi Kami',
  stepsNoticeTitle: 'Penting',
  comingSoon: 'Segera Hadir',
  backToTop: 'Kembali ke atas',
};
