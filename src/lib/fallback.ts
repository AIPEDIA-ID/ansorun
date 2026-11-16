/**
 * Konten contoh. Dipakai bila DatoCMS belum terhubung atau sebuah field masih kosong.
 * Judul mendukung **tebal** dan baris baru (lihat lib/text.ts).
 */
import type {
  AboutPage, ContactInfo, Faq, FooterLink, GalleryPhoto, HomePage, Img, Prize,
  RaceCategory, RaceInfo, RacepackItem, RacepackPage, SiteSettings, Sponsor, Step,
} from './types';


// Foto contoh dari Unsplash (hanya dipakai bila field gambar di DatoCMS kosong).
const un = (id: string, alt: string) => ({ url: `https://images.unsplash.com/photo-${id}`, alt, width: null, height: null });
// Aset resmi ANSORUN (hasil olahan dari .docs/assets_bank) — file ada di public/brand/
const brand = (file: string, alt: string, width: number, height: number): Img => ({ url: `/brand/${file}`, alt, width, height });

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

/*
 * KEBIJAKAN KONTEN: hanya fakta dari materi klien (nama, tagline, tanggal, kategori, nama item
 * racepack, judul section dari content_structure.md). Selain itu = PLACEHOLDER, bukan teks karangan.
 * Cari "TODO(data)" untuk semua yang menunggu klien.
 */
const TBD = 'Segera diumumkan';
const ph = (what: string) => `[Konten menyusul: ${what}]`;

export const site: SiteSettings = {
  eventName: 'ANSORUN 2027',
  bannerTitle: '**ANSORUN**\n2027',
  tagline: 'Tiap ayunan kaki, hadirkan jalan berbagi', // dari KV
  metaDescription: 'ANSORUN Run to Ramadan 2027. 31 Januari 2027, kategori 5K dan 10K.', // TODO(data): teks SEO resmi
  categories: '5K • 10K',
  eventDate: '2027-01-31T00:00:00+07:00', // TODO(data): jam start resmi (sementara tengah malam)
  location: 'Lokasi: ' + TBD.toLowerCase(), // TODO(data)
  heroEyebrow: 'Run to Ramadan 2027',
  heroHeadline: 'Tiap ayunan kaki, hadirkan jalan berbagi', // TODO(data): headline resmi (sementara tagline dari KV)
  heroSubheadline: 'Tiap ayunan kaki, hadirkan jalan berbagi',
  heroImage: brand('kv.webp', 'ANSORUN Run to Ramadan 2027, 31 Januari 2027, kategori 5K dan 10K', 2400, 1351),
  logo: null,
  primaryColor: null,
  accentColor: null,
  registrationUrl: '#', // TODO(data): URL registrasi asli (isi QR di KV)
  registrationLabel: 'Daftar Sekarang',
  countdownTitle: '',
  countdownText: '',
  instagramTitle: 'Ikuti kami di **Instagram**', // tidak dipakai di Beranda baru
  instagramText: '',
  instagramHandle: '',
  instagramImage: null,
  instagramUrl: null,
  galleryTitle: 'Galeri', // /galeri tidak ada di nav
  galleryText: '',
  newsletterAction: null,
  contactUrl: null, // TODO(data): kontak panitia
  tiktokUrl: null,
  facebookUrl: null,
  xUrl: null,
  threadsUrl: null,
  footerNote: '© 2027 ANSORUN',
};

// TODO(data): sponsor/mitra resmi. Kosong = bagian sponsor tidak ditampilkan.
export const sponsors: Sponsor[] = [];

export const footerLinks: FooterLink[] = [
  { group: 'Event', label: 'About ANSORUN', url: '/#tentang' },
  { group: 'Event', label: 'Race Information', url: '/#race' },
  { group: 'Event', label: 'Prizes & Racepack', url: '/#hadiah' },
  { group: 'Peserta', label: 'How to Join', url: '/#daftar' },
  { group: 'Peserta', label: 'Racepack Collection', url: '/racepack' },
  { group: 'Peserta', label: 'FAQ & Contact', url: '/#faq' },
];

/* =====================================================================
   STRUKTUR KONTEN: satu blok per section di .docs/content_structure.md
   ===================================================================== */

/* ---- HOME 01: HOME / HERO (KV, headline, countdown, CTA) -> `site` di atas:
        heroImage, heroHeadline, eventDate (countdown), registrationLabel + registrationUrl (CTA) */

/* ---- HOME 02: ABOUT ANSORUN (tentang event dan misi sosial) ---- */
export const about: AboutPage = {
  metaDescription: site.metaDescription,
  sectionTitle: 'ABOUT\n**ANSORUN**',
  body: ph('tentang event'), // TODO(data)
  mission: ph('misi sosial'), // TODO(data)
  faqTitle: 'FAQ &\n**Contact**',
};

/* ---- HOME 03: EVENT HIGHLIGHTS (video promo) -> home.videoId ---- */

/* ---- HOME 04: RACE INFORMATION (kategori, jadwal, lokasi, rute) ---- */
// Kategori: nama dari KV (5K, 10K), detail menunggu klien
export const raceCategories: RaceCategory[] = [
  { name: '5K', detail: ph('detail kategori 5K') }, // TODO(data)
  { name: '10K', detail: ph('detail kategori 10K') }, // TODO(data)
];

export const raceInfo: RaceInfo = {
  scheduleDate: '31 Januari 2027', // dari KV
  scheduleDetail: ph('jam start tiap kategori'), // TODO(data)
  locationName: TBD, // TODO(data)
  locationAddress: '',
  locationMapUrl: null, // TODO(data): link peta lokasi
  locationMapImage: null,
  routeDetail: ph('keterangan rute'), // TODO(data)
  routeMapUrl: null, // TODO(data): link peta rute
  routeMapImage: null, // TODO(data): gambar peta rute (belum ada di assets_bank)
};

/* ---- HOME 05: PRIZES & RACEPACK (hadiah dan perlengkapan peserta) ---- */
// Hadiah: menunggu klien
export const prizes: Prize[] = [{ title: ph('hadiah'), description: '' }]; // TODO(data)

// Perlengkapan peserta: nama dan gambar dari assets_bank (Alt 1), deskripsi placeholder
export const racepackItems: RacepackItem[] = [
  { title: 'Jersey', description: ph('deskripsi'), icon: 'shirt', caption: null, image: brand('jersey.webp', 'Jersey ANSORUN 2027 tampak depan dan belakang', 1400, 809) },
  { title: 'Finisher Medal', description: ph('deskripsi'), icon: 'medal', caption: null, image: brand('medali.webp', 'Medali ANSORUN 2027', 1200, 684) },
  { title: 'BIB', description: ph('deskripsi'), icon: 'bib', caption: null, image: brand('bib.webp', 'Nomor dada ANSORUN 2027', 1200, 857) },
  { title: 'Tas Serut', description: ph('deskripsi'), icon: 'bag', caption: null, image: brand('tas.webp', 'Tas serut ANSORUN 2027', 1000, 771) },
];

/* ---- HOME 06: HOW TO JOIN (pendaftaran dan race pack collection) ---- */
export const joinSteps: Step[] = [
  { title: 'Pendaftaran', description: ph('cara pendaftaran'), icon: 'file' }, // TODO(data)
  { title: 'Race Pack Collection', description: ph('cara pengambilan race pack'), icon: 'bag' }, // TODO(data)
];

/* ---- HOME 07: FAQ & CONTACT (informasi tambahan dan kontak) ---- */
export const faqs: Faq[] = [
  { question: ph('pertanyaan 1'), answer: ph('jawaban 1') }, // TODO(data)
  { question: ph('pertanyaan 2'), answer: ph('jawaban 2') },
  { question: ph('pertanyaan 3'), answer: ph('jawaban 3') },
];

export const contact: ContactInfo = { email: '', whatsapp: '', note: ph('kontak') }; // TODO(data)

/* ---- Judul section Beranda ---- */
export const home: HomePage = {
  metaDescription: site.metaDescription,
  videoTitle: 'Event **Highlights**',
  videoId: 'jNQXAC9IVRw', // TODO(data): ID dummy, ganti dengan ID video YouTube promo yang asli
  raceTitle: 'Race **Information**',
  prizesTitle: 'Prizes & **Racepack**',
  joinTitle: 'How to **Join**',
};

/* ---- HALAMAN 2: RACEPACK ---- */
// Tiga langkah visual: judul persis dari content_structure.md
export const collectSteps: Step[] = [
  { title: 'Show your registration confirmation', description: ph('deskripsi langkah 1'), icon: 'mail' },
  { title: 'Verify your participant identity', description: ph('deskripsi langkah 2'), icon: 'id' },
  { title: 'Collect your racepack', description: ph('deskripsi langkah 3'), icon: 'bag' },
];

export const racepack: RacepackPage = {
  metaDescription: 'Racepack Collection ANSORUN Run to Ramadan 2027.',
  heroImage: site.heroImage, // TODO(data): hero image khusus halaman Racepack (sementara KV)
  bannerTitle: '**RACEPACK**\nCOLLECTION',
  title: 'GET YOUR **RACEPACK.**\nGET READY TO **RUN.**',
  date: TBD, // TODO(data): tanggal pengambilan
  hours: TBD, // TODO(data): jam operasional
  venue: TBD, // TODO(data): lokasi pengambilan
  documents: ph('dokumen yang harus dibawa'), // TODO(data)
  proxyNote: ph('mekanisme pengambilan yang diwakilkan'), // TODO(data)
  proxyFileUrl: null,
  proxyFileLabel: 'Unduh Surat Kuasa',
  contact: TBD, // TODO(data): kontak panitia
};

// 6 tile placeholder agar layout /galeri terlihat sebelum foto diunggah (halaman tidak ada di nav)
export const gallery: GalleryPhoto[] = [photo.sprint, photo.road, photo.trail, photo.block, photo.laces, photo.stairs].map((image) => ({ caption: null, image }));
