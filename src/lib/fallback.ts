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
  metaDescription: 'ANSORUN Run to Ramadan 2027, 31 Januari 2027 di GBK Senayan, Jakarta. Lari 5K dan 10K, hasil pendaftaran dikonversi menjadi takjil.', // CATATAN: rangkuman dari proposal, minta persetujuan klien
  categories: '5K • 10K',
  eventDate: '2027-01-31T05:30:00+07:00', // CATATAN: flag off 10K 05.30 (rundown tentatif proposal hal. 8); hal. 5 menulis 06.00. Konfirmasi klien
  location: 'GBK Senayan, Jakarta', // proposal hal. 5. CATATAN: titik tepatnya (Hutan Kota / Parkir Timur / Pintu 7 GBK) belum konsisten, konfirmasi klien
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
  { group: 'Event', label: 'Prizes', url: '/#hadiah' },
  { group: 'Event', label: 'Racepack', url: '/#racepack' },
  { group: 'Peserta', label: 'How to Join', url: '/#daftar' },
  { group: 'Peserta', label: 'Racepack Collection', url: '/racepack' },
  { group: 'Peserta', label: 'FAQ', url: '/#faq' },
  { group: 'Peserta', label: 'Kontak', url: '/#kontak' },
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
  // Teks apa adanya dari proposal hal. 2 (body) dan hal. 4 (konsep sosial). CATATAN: PDF menulis "ANSOR RUN 2027 Road to Ramadhan", KV menulis "ANSORUN Run to Ramadan"; nama resmi menunggu konfirmasi klien
  body: `ANSOR RUN 2027 “Road to Ramadhan” adalah ajang lari 5K dan 10K yang menyambut bulan suci Ramadhan 1448 H dengan semangat sehat, bergerak, dan berbagi.

Bukan sekadar lomba lari: seluruh hasil pendaftaran peserta dikonversi menjadi paket takjil buka puasa untuk anak yatim piatu, lansia di panti jompo, dan masyarakat kurang mampu.

Setiap kilometer yang ditempuh pelari menjadi jalan kebaikan yang nyata, dan setiap brand yang terlibat ikut menjadi bagian dari gerakan tersebut.

Dan acara ini juga menjadi salah satu sarana kolaborasi toleransi antar umat beragama, tidak hanya Masyarakat muslim saja yang memeriahkan acara ini namun lintas semua agama juga akan berpartisipasi dalam mengikuti acara ini`,
  mission: `**Konsep sosial: dari garis start menjadi takjil buka puasa**

1. **Pendaftaran:** Rp150.000 per peserta untuk kategori 5K atau Rp.200.000 untuk 10K
2. **Konversi takjil:** sebagian hasil pendaftaran dibelanjakan menjadi paket takjil buka puasa
3. **Berbagi dari pelari:** Disalurkan langsung oleh GP Ansor Bersama Organisasi lintas Agama Bersama perwakilan pelari

**Penerima manfaat:** Panti Asuhan Anak Yatim Piatu, Panti Jompo, Masyarakat Kurang Mampu`,
  faqTitle: 'FAQ &\n**Contact**',
};

/* ---- HOME 03: EVENT HIGHLIGHTS (video promo) -> home.videoId ---- */

/* ---- HOME 04: RACE INFORMATION (kategori, jadwal, lokasi, rute) ---- */
// Sumber: proposal hal. 4, 5, 8, 11, 12. Peta rute = gambar dari proposal (public/brand/rute-*.webp)
export const raceCategories: RaceCategory[] = [
  {
    name: '5K',
    detail: '**Rp150.000**\n\nKategori umum. Sudah termasuk racepack lengkap.',
    routeDetail: '**Start / Finish:** Pintu 7 GBK (Jalan APEC)\n\n**Rute:** Pintu 7 GBK – Jl. Jenderal Sudirman – Akses Kuningan (Loop / Putar Balik) – Kembali melewati Jl. Jenderal Sudirman – Pintu 7 GBK\n\n**Jarak:** ± 5 Kilometer',
    routeMapImage: brand('rute-5k.webp', 'Peta rute lari 5K ANSORUN 2027', 1671, 941),
  },
  {
    name: '10K',
    detail: '**Rp200.000**\n\nKategori umum. Sudah termasuk racepack lengkap.',
    routeDetail: '**Start / Finish:** Pintu 7 GBK (Jalan APEC)\n\n**Rute:** Pintu 7 GBK – Jl. Jenderal Sudirman – Semanggi – Dukuh Atas – Jl. MH Thamrin – Bundaran HI (Putar Balik 1) – Kembali via Jl. Jenderal Sudirman – Bundaran Senayan / Patung Pemuda Membangun (Putar Balik 2) – Kembali ke Pintu 7 GBK\n\n**Jarak:** ± 10 Kilometer',
    routeMapImage: brand('rute-10k.webp', 'Peta rute lari 10K ANSORUN 2027', 1672, 941),
  },
];

export const raceInfo: RaceInfo = {
  scheduleDate: 'Minggu, 31 Januari 2027',
  // Rundown tentatif, apa adanya dari proposal hal. 8
  scheduleDetail: `| Waktu | Acara |
|---|---|
| 04.30 | Open gate & registrasi ulang |
| 05.00 | Pemanasan bersama |
| 05.30 | Flag off 10K |
| 06.00 | Flag off 5K |
| 07.30 | Finish, recovery & bazar |
| 08.30 | Penampilan Ndarboy Genk ( TBC ) |
| 09.15 | Seremoni & pelepasan takjil simbolis |
| 10.15 | Podcast CLASH OG RELIGION |
| 10.30 | Penampilan MALIQ & D'Essentials ( TBC ) |
| 11.30 | Grand Prize & Acara selesai |`,
  locationName: 'Parkir Timur GBK / Hutan Kota GBK', // proposal hal. 5. CATATAN: hal. 6 menulis Hutan Kota GBK, hal. 7 Parkir Timur GBK, peta rute memakai Pintu 7. Menunggu konfirmasi klien
  locationAddress: 'Senayan, Jakarta',
  locationMapUrl: 'https://www.google.com/maps/search/?api=1&query=Pintu+7+GBK+Senayan+Jakarta', // CATATAN: link pencarian Google Maps buatan kami, bukan dari klien
  locationMapImage: null,
  routeDetail: '*Ilustrasi konsep – perlu validasi GPS dan perizinan.*', // tertulis di gambar peta hal. 11 dan 12
  routeMapUrl: null,
};

/* ---- HOME 05: PRIZES & RACEPACK (hadiah dan perlengkapan peserta) ---- */
// Hadiah utama: proposal hal. 13 (foto = potongan gambar dari proposal, public/brand/hadiah-*.webp).
// CATATAN: merek dari proposal, konfirmasi klien boleh ditampilkan
export const prizes: Prize[] = [
  { quantity: 1, title: 'Grandprize BYD ATTO 1', description: '', image: brand('hadiah-mobil.webp', 'BYD ATTO 1', 900, 459) },
  { quantity: 5, title: 'Motor Listrik Polytron Fox 200', description: '', image: brand('hadiah-motor.webp', 'Motor listrik Polytron Fox 200', 338, 444) },
  { quantity: 10, title: 'Jam Garmin Runner', description: '', image: brand('hadiah-jam.webp', 'Jam Garmin Runner', 409, 482) },
  { quantity: 25, title: 'Headset Runner', description: '', image: brand('hadiah-headset.webp', 'Headset Runner', 450, 314) },
];

// Perlengkapan: 4 item pertama = desain di assets_bank (Alt 1); sisanya dari daftar racepack proposal hal. 10 (tanpa gambar).
// CATATAN: hal. 10 hanya mencantumkan 6 item (tanpa medali, nomor dada, tas serut; ketiganya ada sebagai desain di hal. 22 dan assets_bank). Daftar final menunggu klien.
export const racepackItems: RacepackItem[] = [
  { title: 'Kaos Lari', description: 'Jersey resmi ANSOR RUN 2027', icon: 'shirt', caption: null, image: brand('jersey.webp', 'Jersey ANSORUN 2027 tampak depan dan belakang', 1400, 809) },
  { title: 'Medali', description: ph('deskripsi'), icon: 'medal', caption: null, image: brand('medali.webp', 'Medali ANSORUN 2027', 1200, 684) },
  { title: 'Nomor Dada', description: ph('deskripsi'), icon: 'bib', caption: null, image: brand('bib.webp', 'Nomor dada ANSORUN 2027', 1200, 857) },
  { title: 'Tas Serut', description: ph('deskripsi'), icon: 'bag', caption: null, image: brand('tas.webp', 'Tas serut ANSORUN 2027', 1000, 771) },
  { title: 'Air Minum', description: 'Hidrasi sebelum dan sesudah lari', icon: 'star', caption: null, image: null },
  { title: 'Roti', description: 'Asupan energi untuk peserta', icon: 'star', caption: null, image: null },
  { title: 'Multivitamin', description: 'Menjaga daya tahan tubuh', icon: 'star', caption: null, image: null },
  { title: 'Kartu E-Money', description: 'Edisi khusus ANSOR RUN 2027 ( TBC )', icon: 'star', caption: null, image: null },
  { title: 'Kalender Puasa', description: 'Jadwal imsakiyah Ramadhan 1448 H', icon: 'star', caption: null, image: null },
];

/* ---- HOME 06: HOW TO JOIN (pendaftaran dan race pack collection) ---- */
// Sumber: proposal hal. 4, 5, 19
export const joinSteps: Step[] = [
  { title: 'Pendaftaran', description: 'Pendaftaran online dibuka **Desember 2026**.\n\nBiaya **Rp150.000** (5K) dan **Rp200.000** (10K), sudah termasuk racepack lengkap. Link pendaftaran: segera diumumkan.', icon: 'file' }, // TODO(data): URL registrasi
  { title: 'Race Pack Collection', description: 'Pengambilan racepack pada **Januari 2027**, menjelang race day. Tanggal, jam, dan lokasi: segera diumumkan. Lihat halaman [Racepack](/racepack).', icon: 'bag' },
];

/* ---- HOME 07: FAQ & CONTACT (informasi tambahan dan kontak) ---- */
// FAQ disusun dari fakta proposal (CATATAN: pertanyaan dan susunan jawaban buatan kami, minta persetujuan klien)
export const faqs: Faq[] = [
  { question: 'Kapan dan di mana ANSORUN 2027 diselenggarakan?', answer: '**Minggu, 31 Januari 2027** di GBK Senayan, Jakarta. Rundown tentatif ada di bagian Race Information.' },
  { question: 'Kategori apa saja dan berapa biayanya?', answer: 'Tersedia **5K** (Rp150.000) dan **10K** (Rp200.000), kategori umum, sudah termasuk racepack lengkap.' },
  { question: 'Ke mana hasil pendaftaran disalurkan?', answer: 'Hasil pendaftaran dikonversi menjadi paket takjil buka puasa untuk anak yatim piatu, lansia di panti jompo, dan masyarakat kurang mampu.' },
  { question: 'Apakah acara ini terbuka untuk semua agama?', answer: 'Ya. Acara ini terbuka untuk semua kalangan lintas agama.' },
  { question: 'Bagaimana cara mengambil racepack?', answer: 'Lihat halaman [Racepack](/racepack) untuk informasi pengambilan.' },
];

// Kontak dari proposal hal. 27. CATATAN: nomor mungkin pribadi, klien meminta tetap dipasang
export const contact: ContactInfo = {
  people: [
    { name: 'Dika', phone: '082118990008' },
    { name: 'Hesti', phone: '082114338181' },
    { name: 'Komet', phone: '08122720154' },
  ],
  website: 'https://www.ansorun.com',
  email: '',
  note: '',
};

/* ---- Judul section Beranda ---- */
export const home: HomePage = {
  metaDescription: site.metaDescription,
  videoTitle: 'Event **Highlights**',
  videoId: 'jNQXAC9IVRw', // TODO(data): ID dummy, ganti dengan ID video YouTube promo yang asli
  raceTitle: 'Race **Information**',
  routeTitle: 'Rute **Lari**',
  prizesTitle: 'Prizes & **Racepack**',
  racepackTitle: '**Racepack**',
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
  date: 'Januari 2027, menjelang race day', // proposal hal. 19. TODO(data): tanggal pasti
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
