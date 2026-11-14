/**
 * Konten contoh. Dipakai bila DatoCMS belum terhubung atau sebuah field masih kosong.
 * Judul mendukung **tebal** dan baris baru (lihat lib/text.ts).
 */
import type {
  AboutPage, Faq, FooterLink, GalleryPhoto, InfoTab, LariPage,
  RacepackItem, RacepackStep, SiteSettings, Sponsor,
} from './types';


// Foto contoh dari Unsplash (hanya dipakai bila field gambar di DatoCMS kosong).
const un = (id: string, alt: string) => ({ url: `https://images.unsplash.com/photo-${id}`, alt, width: null, height: null });
// Logo sponsor palsu (brand fiktif) — hanya untuk gambaran; file ada di public/dummy/
const dummyLogo = (file: string, alt: string) => ({ url: `/dummy/sponsor-${file}.svg`, alt, width: 240, height: 64 });

const photo = {
  sunrise: un('1552674605-db6ffd4facb5', 'Pelari saat matahari terbit'),
  silhouette: un('1594882645126-14020914d58d', 'Siluet pelari di bukit'),
  trackTop: un('1502904550040-7534597429ae', 'Pelari di lintasan dilihat dari atas'),
  sprint: un('1532444458054-01a7dd3e9fca', 'Pelari berlomba di lintasan'),
  road: un('1571008887538-b36bb32f4571', 'Kaki pelari di jalan raya'),
  trail: un('1486218119243-13883505764c', 'Pelari di jalan pedesaan'),
  block: un('1461896836934-ffe607ba8211', 'Pelari bersiap di start block'),
  laces: un('1483721310020-03333e577078', 'Pelari mengikat tali sepatu'),
  stairs: un('1476480862126-209bfaa8edc8', 'Sepatu lari di tangga'),
};

export const site: SiteSettings = {
  eventName: 'Event Lari 2027',
  bannerTitle: '**EVENT LARI**\n2027',
  tagline: 'Era Baru Lari Dimulai di Sini',
  metaDescription: 'Event Lari 2027: Half Marathon, 10K, dan 5K di Stadion Utama, Jakarta. Daftar sekarang dan lihat jadwal, rute, serta informasi race pack.',
  categories: 'HM • 10K • 5K',
  eventDate: '2027-05-16T05:00:00+07:00',
  location: 'Stadion Utama, Jakarta',
  heroEyebrow: 'Ini bukan sekadar lomba.',
  heroHeadline: '**AYO**\n**BERLARI** Lebih Jauh',
  heroSubheadline: 'Ambil langkah pertamamu di era baru berlari!',
  heroImage: photo.sunrise,
  logo: null,
  primaryColor: null,
  accentColor: null,
  registrationUrl: '#',
  registrationLabel: 'Daftar Sekarang',
  countdownTitle: '**Event Lari** Dimulai Dalam',
  countdownText: 'Bersiaplah untuk bergerak, meningkatkan level, dan berkembang bersama kami.',
  instagramTitle: 'Ikuti kami di **Instagram**',
  instagramText: 'Dapatkan info terbaru dan jadi bagian dari #EventLari2027',
  instagramHandle: '@eventlari',
  instagramImage: photo.silhouette,
  instagramUrl: '#',
  galleryTitle: 'Momen di **Event Lari**',
  galleryText: 'Sorotan utama dan suasana event dalam satu galeri.',
  newsletterAction: null,
  contactUrl: 'mailto:halo@example.com',
  tiktokUrl: '#',
  facebookUrl: '#',
  xUrl: '#',
  threadsUrl: null,
  footerNote: '© 2027 Event Lari. Hak cipta dilindungi.',
};

export const sponsors: Sponsor[] = [
  { name: 'Velocita', url: null, role: 'Powered by', logo: dummyLogo('velocita', 'Velocita') },
  { name: 'Aquanova', url: null, role: 'Presented by', logo: dummyLogo('aquanova', 'Aquanova') },
  { name: 'Kopi Lari', url: null, role: 'In collaboration with', logo: dummyLogo('kopi-lari', 'Kopi Lari') },
];

export const footerLinks: FooterLink[] = [
  { group: 'Event', label: 'Tentang Event', url: '/tentang' },
  { group: 'Event', label: 'Galeri', url: '/galeri' },
  { group: 'Peserta', label: 'Race Pack Collection', url: '/lari' },
  { group: 'Peserta', label: 'Komunitas', url: '/lari#komunitas' },
  { group: 'Peserta', label: 'FAQ', url: '/tentang#faq' },
  { group: 'Legal', label: 'Syarat & Ketentuan', url: '/lari#info' },
];

export const about: AboutPage = {
  metaDescription: 'Kenali Event Lari 2027: tentang acara, kategori lomba, dan jawaban atas pertanyaan yang sering diajukan peserta.',
  sectionTitle: 'TENTANG\n**EVENT LARI**',
  eyebrow: 'EVENT LARI 2027',
  quote: 'Ini bukan sekadar mencapai garis finis. Ini tentang perjalanan ke depan.',
  body: `Event Lari 2027 adalah event lari tahunan yang mempertemukan pelari pemula hingga berpengalaman dalam satu lintasan. Memasuki tahun ketiga, kami menghadirkan rute baru dan pengalaman race yang lebih nyaman.

Event akan diselenggarakan pada **16 Mei 2027** di Stadion Utama, Jakarta, dengan tiga kategori: **5K**, **10K**, dan **Half Marathon (21K)**. Terbuka untuk pelari dari Indonesia maupun mancanegara.

Lebih dari sebuah perlombaan, ini adalah cara merayakan kemajuan, kebersamaan, dan semangat untuk terus bergerak.`,
  faqEyebrow: 'Questions & Answers',
  faqTitle: 'Pertanyaan yang\n**Sering Diajukan**',
  faqText: 'Temukan semua informasi yang perlu kamu ketahui tentang Event Lari 2027.',
};

export const faqs: Faq[] = [
  { question: 'Kapan dan di mana event diselenggarakan?', answer: 'Event diselenggarakan pada **16 Mei 2027** di Stadion Utama, Jakarta.' },
  { question: 'Kategori apa saja yang tersedia?', answer: 'Tersedia kategori **5K**, **10K**, dan **Half Marathon (21K)**.' },
  { question: 'Bagaimana cara mendaftar?', answer: 'Pendaftaran dilakukan secara online melalui tombol **Daftar Sekarang** di halaman depan.' },
  { question: 'Apakah tiket bisa dipindahtangankan?', answer: 'Detail kebijakan akan diumumkan menjelang pendaftaran dibuka.' },
];

export const racepackItems: RacepackItem[] = [
  { title: 'Jersey', description: 'Nyaman dan dirancang untuk menemani setiap langkah hingga garis finish.', icon: 'shirt', caption: null, image: null },
  { title: 'Finisher Medal', description: 'Medali eksklusif untuk setiap finisher.', icon: 'medal', caption: null, image: null },
  { title: 'BIB', description: 'Identitas resmi peserta, memastikan pengalaman race berjalan tertib dan lancar.', icon: 'bib', caption: null, image: null },
  { title: 'Race Pack Bag', description: 'Tas serut premium dengan identitas acara serta logo sponsor.', icon: 'bag', caption: null, image: null },
];

export const racepackSteps: RacepackStep[] = [
  { description: 'Peserta datang ke lokasi Race Pack Collection sesuai jadwal dengan membawa email konfirmasi registrasi (cetak atau digital).', image: photo.road },
  { description: 'Peserta menuju meja frontliner dan mengantre sesuai kategori lomba yang didaftarkan.', image: photo.laces },
  { description: 'Saat dipanggil, peserta menunjukkan email konfirmasi dan kartu identitas resmi untuk verifikasi data.', image: photo.block },
  { description: 'Setelah terverifikasi, BIB dan race pack diserahkan. Periksa isi race pack di tempat, karena klaim hanya bisa dilakukan saat pengambilan.', image: photo.stairs },
  { description: 'Peserta melakukan scan BIB di area chip untuk memastikan BIB sudah terdaftar dan aktif.', image: photo.trail },
];

export const infoTabs: InfoTab[] = [
  { title: 'Syarat & Ketentuan', content: 'Syarat dan ketentuan resmi akan segera tersedia. Mohon menunggu sebelum menyelesaikan proses pendaftaran.' },
  { title: 'FAQ', content: 'Lihat daftar lengkap di halaman [Tentang](/tentang#faq).' },
  { title: 'Hadiah Lomba', content: 'Informasi hadiah akan diumumkan.' },
  { title: 'Rute Lari', content: 'Peta rute akan dipublikasikan menjelang hari-H.' },
  { title: 'Panduan Lomba', content: 'Panduan lomba akan segera tersedia.' },
  { title: "Do's & Don'ts", content: 'Panduan perilaku peserta akan segera tersedia.' },
];

export const lari: LariPage = {
  metaDescription: 'Jadwal dan lokasi pengambilan race pack Event Lari 2027, isi race pack, langkah pengambilan, serta informasi lengkap event.',
  racepackTitle: 'Racepack Collection\n**Event Lari 2027**',
  racepackIntro: 'Perlengkapan yang mendukung kenyamanan dan kelancaran lari Anda, lengkap dengan medali sesuai kategori bagi yang mencapai garis finish.',
  racepackVenue: 'Stadion Utama, Jakarta',
  racepackSchedule: '**13 – 15 Mei 2027**\n\nKamis & Jumat: 11.00 – 20.00 WIB\n\nSabtu: 11.00 – 17.00 WIB',
  stepsTitle: 'Cara Pengambilan Race Pack',
  stepsText: 'Stadion Utama, 13 – 15 Mei 2027',
  proxyNote: 'Pengambilan race pack dapat diwakilkan **1 penerima kuasa** (maksimal 5 orang) dengan membawa Surat Kuasa dan email konfirmasi peserta yang dikuasakan dalam bentuk cetak.',
  proxyFileUrl: null,
  proxyFileLabel: 'Unduh Surat Kuasa',
  communityTitle: 'Bergabung dengan **Komunitas**',
  communityText: 'Dari komunitas lari lokal hingga nasional, kita berlari sebagai satu. Ikuti kami untuk info terbaru dan cerita dari sesama pelari.',
  communityImage: photo.trackTop,
  communityUrl: '#',
  infoTitle: 'Informasi **Event**',
  infoText: 'Seluruh informasi yang perlu Anda ketahui tentang Event Lari 2027, mulai dari peraturan, rute, hingga hadiah.',
};

// 6 tile placeholder agar layout terlihat sebelum foto diunggah
export const gallery: GalleryPhoto[] = [photo.sprint, photo.road, photo.trail, photo.block, photo.laces, photo.stairs].map((image) => ({ caption: null, image }));
