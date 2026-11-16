import type { ICON_NAMES } from './icon-names.mjs';

export interface Img {
  url: string;
  /** URL khusus untuk og:image (mis. versi JPG kecil); bila kosong dipakai url biasa */
  ogUrl?: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
}

/** Teks yang mendukung **tebal** dan baris baru — lihat lib/text.ts */
type RichText = string;

export type IconName = (typeof ICON_NAMES)[number];

/* ---------------------------------------------------------------- site */
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
  heroKv: Img | null;      // KV lengkap (sudah berisi judul); bila ada, hero memakai layout KV
  logo: Img | null;        // versi untuk latar gelap (di atas hero, footer)
  logoOnLight: Img | null; // versi untuk latar terang (header putih); kosong = logo dipakai dengan CSS filter
  primaryColor: string | null; // hex, override tema
  accentColor: string | null;
  registrationUrl: string | null;
  registrationLabel: string;
  galleryTitle: RichText;
  galleryText: string;
  newsletterAction: string | null;
  websiteUrl: string | null;
  contactUrl: string | null;
  instagramUrl: string | null;
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

export interface Contact {
  name: string;
  phone: string;
}

/* ---------------------------------------------------------------- home */
export interface HomePage {
  aboutTitle: RichText;
  aboutBody: string; // markdown
  stepsTitle: string;
  beneficiariesTitle: string;
  highlightsTitle: RichText;
  highlightsText: string;
  videoUrl: string | null; // link YouTube; kosong = placeholder
  videoPoster: Img | null;
  raceTitle: RichText;
  raceText: string;
  feeValue: string;
  feeNote: string;
  rundownTitle: string;
  routesTitle: string;
  prizesTitle: RichText;
  prizesText: string;
  racepackTitle: string;
  racepackText: string;
  racepackImage: Img | null;
  joinTitle: RichText;
  joinText: string;
  faqTitle: RichText;
  faqText: string;
  contactTitle: string;
  contactText: string;
}

export interface AboutStep { title: string; description: string; icon: IconName | null }
export interface Beneficiary { title: string; icon: IconName | null }
export interface RaceFact { value: string; note: string; icon: IconName | null }
export interface RundownItem { time: string; label: string }
export interface RaceRoute { title: string; description: string /* markdown */; image: Img | null }
export interface Prize { quantity: string; title: string; icon: IconName | null; image: Img | null }
export interface JoinStep { title: string; description: string; icon: IconName | null }

/** Dipakai oleh komponen Tabs */
export interface TabItem { title: string; content: string /* markdown */ }

/* --------------------------------------------------------------- about */
export interface AboutPage {
  metaDescription: string;
  sectionTitle: RichText;
  eyebrow: string;
  quote: string;
  body: string; // markdown
  faqEyebrow: string;
  faqTitle: RichText;
  faqText: string;
}

export interface Faq {
  question: string;
  answer: string; // markdown
}

/* ----------------------------------------------------------- racepack */
export interface RacepackPage {
  metaDescription: string;
  bannerImage: Img | null;
  title: RichText;
  slogan: string;
  intro: string;
  stepsTitle: string;
  itemsTitle: string;
  itemsText: string;
  proxyFileUrl: string | null;
  proxyFileLabel: string;
}

export interface RacepackInfo { title: string; content: string /* markdown */; icon: IconName | null }
export interface RacepackStep { title: string; description: string; icon: IconName | null }

export interface RacepackItem {
  title: string;
  description: string;
  icon: IconName | null;
  caption: string | null; // label kecil di preview
  image: Img | null;
}

/* ------------------------------------------------------------- galeri */
export interface GalleryPhoto {
  caption: string | null;
  image: Img | null;
}

export interface SiteData {
  site: SiteSettings;
  sponsors: Sponsor[];
  footerLinks: FooterLink[];
}
