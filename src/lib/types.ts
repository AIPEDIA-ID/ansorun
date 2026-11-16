export interface Img {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

/** Teks yang mendukung **tebal** dan baris baru — lihat lib/text.ts */
type RichText = string;

export interface SiteSettings {
  eventName: string;
  bannerTitle: RichText;
  tagline: string;
  metaDescription: string; // SEO: deskripsi Beranda & default
  categories: string;
  eventDate: string; // ISO
  location: string;
  heroEyebrow: string;
  heroHeadline: RichText;
  heroSubheadline: string;
  heroImage: Img | null;
  logo: Img | null;
  primaryColor: string | null; // hex, override tema
  accentColor: string | null;
  registrationUrl: string | null;
  registrationLabel: string;
  countdownTitle: RichText;
  countdownText: string;
  instagramTitle: RichText;
  instagramText: string;
  instagramHandle: string;
  instagramImage: Img | null;
  instagramUrl: string | null;
  galleryTitle: RichText;
  galleryText: string;
  newsletterAction: string | null;
  contactUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  xUrl: string | null;
  threadsUrl: string | null;
  footerNote: string;
}

export interface Sponsor {
  name: string;
  url: string | null;
  role: string; // "Powered by" | "Presented by" | ...
  logo: Img | null;
}

export interface FooterLink {
  group: string;
  label: string;
  url: string;
}

/** Section 02: About Ansorun (tentang event dan misi sosial) + judul FAQ */
export interface AboutPage {
  metaDescription: string;
  sectionTitle: RichText;
  body: string; // markdown: tentang event
  mission: string; // markdown: misi sosial
  faqTitle: RichText;
}

export interface Faq {
  question: string;
  answer: string; // markdown
}

export type IconName = 'shirt' | 'medal' | 'bib' | 'bag' | 'star';

export interface RacepackItem {
  title: string;
  description: string;
  icon: IconName | null;
  caption: string | null; // label kecil di preview, mis. "Jersey by Brand"
  image: Img | null;
}

export interface Step {
  title: string;
  description: string; // markdown
  icon: string | null; // nama ikon di components/Icon.astro
}

export interface InfoTab {
  title: string;
  content: string; // markdown
}

/** Section 04: Race Information (kategori, jadwal, lokasi, rute) */
export interface RaceCategory {
  name: string; // mis. "5K"
  detail: string; // markdown: biaya, kuota, dst.
  routeDetail: string; // markdown: keterangan rute kategori ini
  routeMapImage: Img | null; // gambar peta rute kategori ini
}

export interface RaceInfo {
  scheduleDate: string; // tanggal event
  scheduleDetail: string; // markdown: jam start tiap kategori
  locationName: string;
  locationAddress: string;
  locationMapUrl: string | null; // link Google Maps
  locationMapImage: Img | null;
  routeDetail: string; // markdown: catatan umum rute (peta per kategori ada di RaceCategory)
  routeMapUrl: string | null;
}

/** Section 05: hadiah (perlengkapan = RacepackItem) */
export interface Prize {
  quantity: number | null; // jumlah hadiah, mis. 5
  title: string; // mis. "Motor Listrik Polytron Fox 200"
  description: string;
  image: Img | null;
}

/** Section 07: kontak */
export interface ContactPerson {
  name: string;
  phone: string; // format lokal, mis. 0812xxxx
}

export interface ContactInfo {
  people: ContactPerson[];
  website: string;
  email: string;
  note: string; // markdown
}

/** Judul tiap section Beranda + video. Isi section lain: AboutPage, RaceInfo, Prize, RacepackItem, Step, Faq, ContactInfo. */
export interface HomePage {
  metaDescription: string;
  videoTitle: RichText;
  videoId: string; // ID video YouTube
  raceTitle: RichText;
  routeTitle: RichText;
  prizesTitle: RichText;
  racepackTitle: RichText;
  joinTitle: RichText;
}

/** Halaman 2: Racepack */
export interface RacepackPage {
  metaDescription: string;
  heroImage: Img | null;
  bannerTitle: RichText; // "Racepack Collection"
  title: RichText; // "GET YOUR RACEPACK. GET READY TO RUN."
  date: string; // tanggal pengambilan
  hours: string; // jam operasional
  venue: string; // lokasi pengambilan
  documents: string; // markdown: dokumen yang harus dibawa
  proxyNote: string; // markdown: mekanisme diwakilkan
  proxyFileUrl: string | null;
  proxyFileLabel: string;
  contact: string; // markdown: kontak panitia
}

export interface GalleryPhoto {
  caption: string | null;
  image: Img | null;
}

export interface SiteData {
  site: SiteSettings;
  sponsors: Sponsor[];
  footerLinks: FooterLink[];
}
