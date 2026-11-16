/**
 * Konten contoh (ANSORUN 2027). Dipakai bila DatoCMS belum terhubung atau sebuah field masih kosong.
 * Judul mendukung **tebal** dan baris baru (lihat lib/text.ts).
 * Sumber: proposal klien (rev 1). Item bertanda TBC/TBA masih menunggu konfirmasi klien.
 */
import type {
  AboutPage, AboutStep, Beneficiary, Contact, Faq, FooterLink, GalleryPhoto, HomePage, Img,
  JoinStep, Prize, RaceFact, RaceRoute, RacepackInfo, RacepackItem, RacepackPage, RacepackStep,
  RundownItem, SiteSettings, Sponsor,
} from './types';

/* ---- gambar contoh ---- */
// Foto Unsplash: hanya dipakai bila field gambar di DatoCMS kosong.
const un = (id: string, alt: string): Img => ({ url: `https://images.unsplash.com/photo-${id}`, alt, width: null, height: null });
// Gambar dari proposal klien (public/sample/) — placeholder sampai file asli dikirim.
const sample = (file: string, alt: string, width: number, height: number): Img => ({ url: `/sample/${file}`, alt, width, height });
// Aset brand final dari klien (diekspor dari .docs/assets_bank, lihat AGENTS.md)
const brand = (file: string, alt: string, width: number, height: number, ogUrl?: string): Img => ({ url: `/brand/${file}`, alt, width, height, ...(ogUrl && { ogUrl }) });
// Logo sponsor palsu (brand fiktif) — hanya untuk gambaran; file ada di public/dummy/
const dummyLogo = (file: string, alt: string): Img => ({ url: `/dummy/sponsor-${file}.svg`, alt, width: 240, height: 64 });

const photo = {
  sunrise: un('1552674605-db6ffd4facb5', 'Pelari saat matahari terbit'),
  trackTop: un('1502904550040-7534597429ae', 'Pelari di lintasan dilihat dari atas'),
  sprint: un('1532444458054-01a7dd3e9fca', 'Pelari berlomba di lintasan'),
  road: un('1571008887538-b36bb32f4571', 'Kaki pelari di jalan raya'),
  trail: un('1486218119243-13883505764c', 'Pelari di jalan pedesaan'),
  block: un('1461896836934-ffe607ba8211', 'Pelari bersiap di start block'),
  laces: un('1483721310020-03333e577078', 'Pelari mengikat tali sepatu'),
  stairs: un('1476480862126-209bfaa8edc8', 'Sepatu lari di tangga'),
};

/* ---- situs ---- */
export const site: SiteSettings = {
  eventName: 'ANSORUN 2027',
  bannerTitle: '**ANSORUN** 2027',
  tagline: 'Tiap ayunan kaki, hadirkan jalan berbagi',
  metaDescription: 'ANSORUN 2027 Run to Ramadhan: lari 5K dan 10K di GBK Jakarta pada 31 Januari 2027. Hasil pendaftaran dikonversi menjadi takjil untuk yang membutuhkan.',
  categories: '5K • 10K',
  eventDate: '2027-01-31T05:30:00+07:00',
  location: 'GBK, Senayan, Jakarta',
  heroEyebrow: 'Run to Ramadhan',
  heroHeadline: '**ANSORUN** 2027',
  heroSubheadline: 'Tiap ayunan kaki, hadirkan jalan berbagi.',
  heroImage: photo.trail,
  logo: brand('logo-on-dark.webp', 'ANSORUN 2027 Run to Ramadan', 1000, 275),
  logoOnLight: brand('logo-on-light.webp', 'ANSORUN 2027 Run to Ramadan', 1000, 275),
  heroKv: brand('kv.webp', 'Key visual ANSORUN 2027 Run to Ramadan', 2400, 1351, '/brand/kv-og.jpg'),
  primaryColor: null,
  accentColor: null,
  registrationUrl: '/#join', // sementara menuju section How to Join; ganti dengan URL pendaftaran asli
  registrationLabel: 'Daftar Sekarang',
  galleryTitle: 'Momen di **ANSORUN**',
  galleryText: 'Sorotan utama dan suasana event dalam satu galeri.',
  newsletterAction: null,
  websiteUrl: 'https://www.ansorun.com',
  contactUrl: null,
  instagramUrl: null,
  tiktokUrl: null,
  facebookUrl: null,
  xUrl: null,
  threadsUrl: null,
  footerNote: '© 2027 ANSORUN. Hak cipta dilindungi.',
};

export const sponsors: Sponsor[] = [
  { name: 'Velocita', url: null, role: 'Powered by', logo: dummyLogo('velocita', 'Velocita') },
  { name: 'Aquanova', url: null, role: 'Presented by', logo: dummyLogo('aquanova', 'Aquanova') },
  { name: 'Kopi Lari', url: null, role: 'In collaboration with', logo: dummyLogo('kopi-lari', 'Kopi Lari') },
];

export const footerLinks: FooterLink[] = [
  { group: 'Event', label: 'Event Highlights', url: '/#highlights' },
  { group: 'Event', label: 'Race Information', url: '/#race' },
  { group: 'Event', label: 'Hadiah & Race Pack', url: '/#prizes' },
  { group: 'Peserta', label: 'Cara Mendaftar', url: '/#join' },
  { group: 'Peserta', label: 'Racepack Collection', url: '/racepack' },
  { group: 'Peserta', label: 'FAQ', url: '/#faq' },
  { group: 'Peserta', label: 'Kontak', url: '/#kontak' },
];

/* Kontak panitia: isi nomor asli di DatoCMS (model "Kontak Panitia"). */
export const contacts: Contact[] = [
  { name: 'Panitia 1', phone: '08xx-xxxx-xxxx' },
  { name: 'Panitia 2', phone: '08xx-xxxx-xxxx' },
  { name: 'Panitia 3', phone: '08xx-xxxx-xxxx' },
];

/* ---- beranda ---- */
export const home: HomePage = {
  aboutTitle: 'About **ANSORUN**',
  aboutBody: `**ANSORUN 2027 “Run to Ramadhan”** adalah ajang lari 5K dan 10K yang menyambut bulan suci Ramadhan 1448 H dengan semangat sehat, bergerak, dan berbagi.

Bukan sekadar lomba lari: hasil pendaftaran peserta dikonversi menjadi paket takjil buka puasa untuk anak yatim piatu, lansia di panti jompo, dan masyarakat kurang mampu.`,
  stepsTitle: 'Dari garis start menjadi takjil buka puasa',
  beneficiariesTitle: 'Penerima manfaat',
  highlightsTitle: 'Event **Highlights**',
  highlightsText: 'Saksikan cuplikan semangat berbagi dan berlari bersama di ANSORUN.',
  videoUrl: null,
  videoPoster: photo.sprint,
  raceTitle: 'Race **Information**',
  raceText: 'Satu pagi, ribuan langkah kebaikan.',
  feeValue: 'Rp150.000 (5K) · Rp200.000 (10K)',
  feeNote: 'Sudah termasuk race pack lengkap. Hasil pendaftaran dikonversi menjadi takjil untuk yang membutuhkan pada bulan Ramadhan 2027.',
  rundownTitle: 'Rundown Race Day (Tentatif)',
  routesTitle: 'Rute Lari',
  prizesTitle: 'Prizes & **Racepack**',
  prizesText: 'Hadiah utama menanti para pelari, dan setiap peserta membawa pulang race pack lengkap.',
  racepackTitle: 'Race pack peserta',
  racepackText: 'Perlengkapan untuk menemani lari dan puasa Anda.',
  racepackImage: sample('racepack.jpg', 'Isi race pack ANSORUN 2027', 1700, 1068),
  joinTitle: 'How **to Join**',
  joinText: 'Daftar dulu, lalu ambil race pack Anda. Semuanya dalam enam langkah.',
  faqTitle: 'Pertanyaan yang **Sering Diajukan**',
  faqText: 'Informasi tambahan seputar ANSORUN 2027.',
  contactTitle: 'Hubungi **Panitia**',
  contactText: 'Kami siap membantu pendaftaran, race pack, dan informasi lainnya.',
};

export const aboutSteps: AboutStep[] = [
  { title: 'Pendaftaran', description: 'Rp150.000 per peserta untuk kategori 5K atau Rp200.000 untuk 10K.', icon: 'run' },
  { title: 'Konversi takjil', description: 'Hasil pendaftaran dibelanjakan menjadi paket takjil buka puasa.', icon: 'bowl' },
  { title: 'Berbagi dari pelari', description: 'Disalurkan langsung oleh GP Ansor bersama organisasi lintas agama dan perwakilan pelari.', icon: 'heart' },
];

export const beneficiaries: Beneficiary[] = [
  { title: 'Panti asuhan anak yatim piatu', icon: 'people' },
  { title: 'Panti jompo', icon: 'elder' },
  { title: 'Masyarakat kurang mampu', icon: 'heart' },
];

export const raceFacts: RaceFact[] = [
  { value: '31 Jan 2027', note: 'Hari Minggu', icon: 'calendar' },
  { value: '05.30 WIB', note: 'Flag off 10K · 5K pukul 06.00 WIB', icon: 'clock' },
  { value: 'GBK Senayan', note: 'Parkir Timur / Hutan Kota GBK, Jakarta (lokasi final TBC)', icon: 'pin' },
  { value: '5K & 10K', note: 'Kategori umum', icon: 'route' },
];

export const rundown: RundownItem[] = [
  { time: '04.30', label: 'Open gate & registrasi ulang' },
  { time: '05.00', label: 'Pemanasan bersama' },
  { time: '05.30', label: 'Flag off 10K' },
  { time: '06.00', label: 'Flag off 5K' },
  { time: '07.30', label: 'Finish, recovery & bazar' },
  { time: '08.30', label: 'Penampilan Ndarboy Genk (TBC)' },
  { time: '09.15', label: 'Seremoni & pelepasan takjil simbolis' },
  { time: '10.15', label: 'Podcast Clash of Religion' },
  { time: '10.30', label: "Penampilan MALIQ & D'Essentials (TBC)" },
  { time: '11.30', label: 'Grand Prize & acara selesai' },
];

export const routes: RaceRoute[] = [
  {
    title: 'Rute 5K',
    image: sample('route-5k.jpg', 'Peta rute lari 5K', 1700, 956),
    description: '**Start / Finish:** Pintu 7 GBK (Jl. APEC)\n\n**Rute:** Pintu 7 GBK – Jl. Jenderal Sudirman – Akses Kuningan (loop / putar balik) – kembali melewati Jl. Jenderal Sudirman – Pintu 7 GBK\n\n**Jarak:** ± 5 kilometer\n\n*Ilustrasi konsep: perlu validasi GPS dan perizinan.*',
  },
  {
    title: 'Rute 10K',
    image: sample('route-10k.jpg', 'Peta rute lari 10K', 1700, 958),
    description: '**Start / Finish:** Pintu 7 GBK (Jl. APEC)\n\n**Rute:** Pintu 7 GBK – Jl. Jenderal Sudirman – Semanggi – Dukuh Atas – Jl. MH Thamrin – Bundaran HI (putar balik 1) – kembali via Jl. Jenderal Sudirman – Bundaran Senayan / Patung Pemuda Membangun (putar balik 2) – Pintu 7 GBK\n\n**Jarak:** ± 10 kilometer\n\n*Ilustrasi konsep: perlu validasi GPS dan perizinan.*',
  },
];

export const prizes: Prize[] = [
  { quantity: '1', title: 'Grandprize BYD ATTO 1', icon: 'car', image: sample('prizes/byd.webp', 'BYD ATTO 1', 900, 458) },
  { quantity: '5', title: 'Motor Listrik Polytron Fox 200', icon: 'scooter', image: sample('prizes/motor.webp', 'Motor listrik Polytron Fox 200', 312, 410) },
  { quantity: '10', title: 'Jam Garmin Runner', icon: 'watch', image: sample('prizes/garmin.webp', 'Jam Garmin Runner', 376, 459) },
  { quantity: '25', title: 'Headset Runner', icon: 'headphones', image: sample('prizes/headset.webp', 'Headset Runner', 410, 258) },
];

export const joinSteps: JoinStep[] = [
  { title: 'Daftar online', description: 'Pilih kategori 5K atau 10K, lalu isi formulir pendaftaran lewat tombol Daftar Sekarang atau scan QR di poster.', icon: 'ticket' },
  { title: 'Selesaikan pembayaran', description: 'Lakukan pembayaran sesuai kategori yang dipilih.', icon: 'wallet' },
  { title: 'Simpan email konfirmasi', description: 'Email konfirmasi registrasi dibutuhkan saat pengambilan race pack, simpan dalam bentuk cetak atau digital.', icon: 'mail' },
];

/* ---- tentang ---- */
export const about: AboutPage = {
  metaDescription: 'Kenali ANSORUN 2027 Run to Ramadhan: misi sosial, konsep takjil, dan jawaban atas pertanyaan yang sering diajukan peserta.',
  sectionTitle: 'TENTANG **ANSORUN**',
  eyebrow: 'ANSORUN 2027 · RUN TO RAMADHAN',
  quote: 'Tiap ayunan kaki, hadirkan jalan berbagi.',
  body: `**ANSORUN 2027 “Run to Ramadhan”** adalah ajang lari 5K dan 10K yang menyambut bulan suci Ramadhan 1448 H dengan semangat sehat, bergerak, dan berbagi.

Bukan sekadar lomba lari: hasil pendaftaran peserta dikonversi menjadi paket takjil buka puasa untuk anak yatim piatu, lansia di panti jompo, dan masyarakat kurang mampu. Setiap kilometer yang ditempuh pelari menjadi jalan kebaikan yang nyata, dan setiap brand yang terlibat ikut menjadi bagian dari gerakan tersebut.

Acara ini juga menjadi salah satu sarana kolaborasi toleransi antarumat beragama. Tidak hanya masyarakat muslim, pelari lintas semua agama pun akan berpartisipasi.

Dalam momentum ini hadir pula **Podcast ANSOR Feat Clash of Religion**, podcast lintas agama yang sekaligus menjadi endorsement kegiatan, mengajak masyarakat berolahraga lari di hari Minggu dan berbagi berkah dari hasil sumbangan para pelari di bulan Ramadhan.`,
  faqEyebrow: 'Questions & Answers',
  faqTitle: 'Pertanyaan yang **Sering Diajukan**',
  faqText: 'Temukan informasi yang perlu Anda ketahui tentang ANSORUN 2027.',
};

export const faqs: Faq[] = [
  { question: 'Kapan dan di mana event diselenggarakan?', answer: '**Minggu, 31 Januari 2027** di kawasan GBK, Senayan, Jakarta. Flag off 10K pukul 05.30 WIB dan 5K pukul 06.00 WIB.' },
  { question: 'Kategori apa saja yang tersedia dan berapa biayanya?', answer: 'Tersedia kategori **5K (Rp150.000)** dan **10K (Rp200.000)**, sudah termasuk race pack lengkap.' },
  { question: 'Ke mana hasil pendaftaran disalurkan?', answer: 'Hasil pendaftaran dikonversi menjadi paket takjil untuk anak yatim piatu, lansia di panti jompo, dan masyarakat kurang mampu pada Ramadhan 2027.' },
  { question: 'Siapa saja yang boleh ikut?', answer: 'ANSORUN terbuka untuk semua kalangan lintas agama, dan menjadi sarana kolaborasi toleransi antarumat beragama.' },
  { question: 'Apa saja isi race pack?', answer: 'Kaos lari, air minum, roti, multivitamin, kartu e-money edisi khusus ANSORUN 2027 (TBC), dan kalender puasa Ramadhan 1448 H.' },
  { question: 'Bagaimana cara mengambil race pack?', answer: 'Tunjukkan konfirmasi registrasi, verifikasi identitas, lalu ambil race pack. Jadwal dan lokasi akan diumumkan di halaman [Racepack](/racepack).' },
];

/* ---- racepack ---- */
export const racepackPage: RacepackPage = {
  metaDescription: 'Racepack Collection ANSORUN 2027: tanggal, jam, lokasi, dokumen yang dibawa, dan cara pengambilan race pack.',
  bannerImage: photo.laces,
  title: 'Racepack **Collection**',
  slogan: 'GET YOUR RACEPACK. GET READY TO RUN.',
  intro: 'Semua informasi pengambilan race pack ANSORUN 2027 ada di sini. Siapkan dokumen Anda dan ikuti tiga langkah berikut.',
  stepsTitle: 'Tiga langkah **mengambil race pack**',
  itemsTitle: 'Isi **race pack**',
  itemsText: 'Pilih item untuk melihat detailnya.',
  proxyFileUrl: null,
  proxyFileLabel: 'Unduh Surat Kuasa',
};

export const racepackInfo: RacepackInfo[] = [
  { title: 'Tanggal pengambilan', content: 'Akan diumumkan (TBA).', icon: 'calendar' },
  { title: 'Jam operasional', content: 'Akan diumumkan (TBA).', icon: 'clock' },
  { title: 'Lokasi pengambilan', content: 'Akan diumumkan (TBA).', icon: 'pin' },
  { title: 'Dokumen yang dibawa', content: 'Email konfirmasi registrasi (cetak atau digital) dan kartu identitas resmi.', icon: 'id' },
  { title: 'Pengambilan diwakilkan', content: 'Mekanisme pengambilan oleh perwakilan akan diumumkan (TBA).', icon: 'people' },
];

export const racepackSteps: RacepackStep[] = [
  { title: 'Show your registration confirmation', description: 'Tunjukkan email konfirmasi registrasi Anda, dicetak atau digital.', icon: 'mail' },
  { title: 'Verify your participant identity', description: 'Petugas memverifikasi identitas Anda dengan kartu identitas resmi.', icon: 'id' },
  { title: 'Collect your racepack', description: 'Terima BIB dan race pack Anda, lalu periksa isinya di tempat.', icon: 'bag' },
];

export const racepackItems: RacepackItem[] = [
  { title: 'Kaos Lari', description: 'Jersey resmi ANSORUN 2027.', icon: 'shirt', caption: 'Jersey Event', image: sample('race/jersey.webp', 'Jersey ANSORUN 2027 tampak depan dan belakang', 900, 517) },
  { title: 'Tas Serut', description: 'Tas serut bermotif ANSORUN 2027.', icon: 'bag', caption: 'Tas Serut', image: sample('race/tas-serut.webp', 'Tas serut ANSORUN 2027', 700, 540) },
  { title: 'Air Minum', description: 'Hidrasi sebelum dan sesudah lari.', icon: 'bottle', caption: null, image: null },
  { title: 'Roti', description: 'Asupan energi untuk peserta.', icon: 'bread', caption: null, image: null },
  { title: 'Multivitamin', description: 'Menjaga daya tahan tubuh.', icon: 'pill', caption: null, image: null },
  { title: 'Salep Peregang Otot', description: 'Untuk otot yang kaku setelah berlari.', icon: 'bandage', caption: null, image: null },
  { title: 'Kartu E-Money', description: 'Edisi khusus ANSORUN 2027 (TBC).', icon: 'wallet', caption: null, image: null },
  { title: 'Jadwal Puasa Ramadan', description: 'Kalender imsakiyah Ramadhan 1448 H.', icon: 'calendar', caption: null, image: null },
  { title: 'Stiker Logo ANSORUN', description: 'Stiker dengan logo ANSORUN 2027.', icon: 'sticker', caption: null, image: null },
];

/* ---- galeri ---- */
// Placeholder agar layout terlihat sebelum foto diunggah
export const gallery: GalleryPhoto[] = [photo.sprint, photo.road, photo.sunrise, photo.block, photo.trackTop, photo.stairs].map((image) => ({ caption: null, image }));
