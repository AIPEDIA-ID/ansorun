/**
 * Konten contoh. Dipakai bila DatoCMS belum terhubung atau sebuah field masih kosong.
 * Nama event generik — ganti lewat DatoCMS > Site Settings.
 */
import type {
  AboutPage, Faq, FooterLink, GalleryPhoto, InfoTab, LariPage,
  RacepackItem, RacepackStep, SiteSettings, Sponsor,
} from './types';

export const site: SiteSettings = {
  eventName: 'Event Lari 2027',
  tagline: 'Lari bersama, melangkah lebih jauh',
  categories: 'HM • 10K • 5K',
  eventDate: '2027-05-16T05:00:00+07:00',
  location: 'Stadion Utama, Jakarta',
  heroHeadline: 'Lari Bersama, Lebih Jauh',
  heroSubheadline: 'Ambil langkah pertamamu di event lari terbesar tahun ini. Terbuka untuk pelari dari seluruh Indonesia.',
  heroImage: null,
  logo: null,
  primaryColor: null,
  accentColor: null,
  registrationUrl: '#',
  registrationLabel: 'Daftar Sekarang',
  newsletterAction: null,
  contactUrl: 'mailto:halo@example.com',
  instagramUrl: '#',
  tiktokUrl: '#',
  facebookUrl: '#',
  xUrl: '#',
  threadsUrl: null,
  footerNote: '© 2027 Event Lari. Hak cipta dilindungi.',
};

export const sponsors: Sponsor[] = [
  { name: 'Sponsor Utama', url: '#', role: 'Powered by', logo: null },
  { name: 'Mitra Resmi', url: '#', role: 'Presented by', logo: null },
  { name: 'Mitra Komunitas', url: '#', role: 'In collaboration with', logo: null },
];

export const footerLinks: FooterLink[] = [
  { group: 'Event', label: 'Tentang Event', url: '/tentang' },
  { group: 'Event', label: 'Galeri', url: '/galeri' },
  { group: 'Peserta', label: 'Pengambilan Race Pack', url: '/lari' },
  { group: 'Peserta', label: 'Komunitas', url: '/lari#komunitas' },
  { group: 'Peserta', label: 'FAQ', url: '/tentang#faq' },
  { group: 'Legal', label: 'Syarat & Ketentuan', url: '/lari#info' },
];

export const about: AboutPage = {
  title: 'Tentang Event',
  quote: 'Ini bukan sekadar mencapai garis finis. Ini tentang perjalanan ke depan.',
  body: `Event Lari 2027 adalah event lari tahunan yang mempertemukan pelari pemula hingga berpengalaman dalam satu lintasan. Memasuki tahun ketiga, kami menghadirkan rute baru, pengalaman race yang lebih nyaman, dan suasana yang ramah untuk semua.

Event akan diselenggarakan pada **16 Mei 2027**, dengan tiga kategori: **5K**, **10K**, dan **Half Marathon (21K)**. Terbuka untuk pelari dari Indonesia maupun mancanegara.

Lebih dari sebuah perlombaan, ini adalah cara merayakan kemajuan, kebersamaan, dan semangat untuk terus bergerak.`,
};

export const faqs: Faq[] = [
  { question: 'Kapan dan di mana event diselenggarakan?', answer: 'Event diselenggarakan pada **16 Mei 2027** di Stadion Utama, Jakarta.' },
  { question: 'Kategori apa saja yang tersedia?', answer: 'Tersedia kategori **5K**, **10K**, dan **Half Marathon (21K)**.' },
  { question: 'Bagaimana cara mendaftar?', answer: 'Pendaftaran dilakukan secara online melalui tombol **Daftar Sekarang** di halaman depan.' },
  { question: 'Apakah tiket bisa dipindahtangankan?', answer: 'Detail kebijakan akan diumumkan menjelang pendaftaran dibuka. Pantau terus info resmi kami.' },
];

export const racepackItems: RacepackItem[] = [
  { title: 'Jersey', description: 'Nyaman dan dirancang untuk menemani setiap langkah hingga garis finish.', image: null },
  { title: 'Finisher Medal', description: 'Medali eksklusif untuk setiap finisher.', image: null },
  { title: 'BIB', description: 'Identitas resmi peserta, memastikan pengalaman race berjalan tertib dan lancar.', image: null },
  { title: 'Race Pack Bag', description: 'Tas serut premium dengan identitas acara serta logo sponsor.', image: null },
];

export const racepackSteps: RacepackStep[] = [
  { description: 'Peserta datang ke lokasi Race Pack Collection sesuai jadwal dengan membawa email konfirmasi registrasi (cetak atau digital).', image: null },
  { description: 'Peserta menuju meja frontliner dan mengantre sesuai kategori lomba yang didaftarkan.', image: null },
  { description: 'Saat dipanggil, peserta menunjukkan email konfirmasi dan kartu identitas resmi untuk proses verifikasi data.', image: null },
  { description: 'Setelah terverifikasi, BIB dan race pack diserahkan. Periksa isi race pack di tempat, karena klaim kekurangan hanya bisa dilakukan saat pengambilan berlangsung.', image: null },
  { description: 'Selanjutnya, peserta melakukan scan BIB di area chip untuk memastikan BIB sudah terdaftar dan aktif.', image: null },
];

export const infoTabs: InfoTab[] = [
  { title: 'Syarat & Ketentuan', content: 'Syarat dan ketentuan resmi akan segera tersedia. Mohon menunggu sebelum menyelesaikan proses pendaftaran.' },
  { title: 'FAQ', content: 'Lihat daftar lengkap di halaman **Tentang**.' },
  { title: 'Hadiah Lomba', content: 'Informasi hadiah akan diumumkan.' },
  { title: 'Rute Lari', content: 'Peta rute akan dipublikasikan menjelang hari-H.' },
];

export const lari: LariPage = {
  racepackTitle: 'Pengambilan Race Pack',
  racepackIntro: 'Perlengkapan yang mendukung kenyamanan dan kelancaran lari Anda, lengkap dengan medali sesuai kategori bagi yang mencapai garis finish.',
  racepackVenue: 'Stadion Utama, Jakarta',
  racepackSchedule: '**13 – 15 Mei 2027**\n\nKamis & Jumat: 11.00 – 20.00 WIB\n\nSabtu: 11.00 – 17.00 WIB',
  stepsTitle: 'Cara Pengambilan Race Pack',
  proxyNote: 'Pengambilan race pack dapat diwakilkan **1 penerima kuasa** (maksimal 5 orang) dengan membawa Surat Kuasa dan email konfirmasi peserta yang dikuasakan dalam bentuk cetak.',
  proxyFileUrl: null,
  proxyFileLabel: 'Unduh Surat Kuasa',
  communityTitle: 'Bergabung dengan Komunitas',
  communityText: 'Dari komunitas lari lokal hingga nasional, kita berlari sebagai satu. Ikuti kami untuk info terbaru, tips latihan, dan cerita dari sesama pelari.',
  communityImage: null,
  communityUrl: '#',
  infoTitle: 'Informasi Event',
};

export const gallery: GalleryPhoto[] = [];
