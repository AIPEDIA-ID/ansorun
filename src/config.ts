/**
 * Konfigurasi statis & teks UI yang BUKAN konten CMS.
 * Teks yang sering diubah klien (judul event, tanggal, FAQ, dll.) ada di DatoCMS.
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
  countdownTitle: 'Hitung Mundur Menuju Hari-H',
  countdownDone: 'Event sedang / telah berlangsung. Sampai jumpa di garis finis!',
  units: { days: 'Hari', hours: 'Jam', minutes: 'Menit', seconds: 'Detik' },
  newsletterTitle: 'Berlangganan Info',
  newsletterText: 'Dapatkan kabar terbaru, tips latihan, dan info early bird langsung ke email Anda.',
  newsletterPlaceholder: 'Alamat email Anda',
  newsletterButton: 'Daftar',
  newsletterPrivacy: 'Kami menghormati privasi Anda. Berhenti berlangganan kapan saja.',
  eventInfoTitle: 'Info Event',
  followUs: 'Ikuti Kami',
  faqTitle: 'Pertanyaan yang Sering Diajukan',
  faqContact: 'Masih punya pertanyaan?',
  contactButton: 'Hubungi Kami',
  galleryTitle: 'Galeri',
  galleryEmpty: 'Foto akan segera ditambahkan.',
  comingSoon: 'Segera hadir.',
  backToTop: '↑ Kembali ke atas',
};
